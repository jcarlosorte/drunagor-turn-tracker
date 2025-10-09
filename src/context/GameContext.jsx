import React, { createContext, useContext, useState } from 'react';
import { FICHAS } from '@/data/fichas';
import { useLanguage } from '@/context/LanguageContext';
import { ALDEANO, ERRANTES } from '@/data/cartasEspeciales';
import { v4 as uuidv4 } from 'uuid';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [runes, setRunes] = useState({
    rojo: 0,
    azul: 0,
    verde: 0,
    naranja: 0,
    gris: 0
  });
  const [discardedTiles, setDiscardedTiles] = useState({
    rojo: [],
    azul: [],
    verde: [],
    naranja: [],
    gris: []
  });
  const [pilaDeRunas, setPilaDeRunas] = useState([]);
  const [pilas, setPilas] = useState([]);
  const [pilasConcentrada, setPilasConcentrada] = useState([]);
  const [contadorPilas, setContadorPilas] = useState(1);
  const [contadorPilasConcentradas, setContadorPilasConcentradas] = useState(1);
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const [availableTiles, setAvailableTiles] = useState(
    FICHAS.map(f => ({ ...f, uuid: uuidv4() }))
  );
  const [tileWarning, setTileWarning] = useState(null);
  const [usedTiles, setUsedTiles] = useState([]);
  const [scenarioMonster, setScenarioMonster] = useState(null);
  const [tileToasts, setTileToasts] = useState([]);
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [controlPoints, setControlPoints] = useState([]);
  const [runeKeys, setRuneKeys] = useState([]);
  const [rescue, setRescue] = useState([]);
  const [aldeanoDeck, setAldeanoDeck] = useState([]);
  const [errantesDeck, setErrantesDeck] = useState([]);
  const [codigosPilas, setCodigosPilas] = useState({});

  const handleCodigoChange = (pilaId, nuevoCodigo) => {
    setCodigosPilas(prev => ({
      ...prev,
      [pilaId]: nuevoCodigo.slice(0, 5)
    }));
  };
  
  const addRune = (color) => {
    
    setRunes(prev => ({
      ...prev,
      [color]: prev[color] + 1
    }));
  };

  const removeRune = (color) => {
    // Buscar una ficha usada del color indicado
    const index = usedTiles.findIndex(tile => tile.runa === color);
    if (index === -1) return null; // No hay ficha del color
  
    const removed = usedTiles[index];
  
    // Eliminarla del array
    setUsedTiles(prev => prev.filter((_, i) => i !== index));
  
    // Reducir el contador
    setRunes(prev => ({
      ...prev,
      [color]: Math.max(prev[color] - 1, 0)
    }));
  
    return removed; // Devolvemos la ficha real para el toast
  };

  const getRuneCount = (color) => runes[color] || 0;

  const clearRunes = () => {
    setRunes({ rojo: 0, azul: 0, verde: 0, naranja: 0, gris: 0 });
  };

  const addRunesCascade = (n) => {
    const colores = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    let avail = [...availableTiles];
    let used = [...usedTiles];
    let runesCopy = { ...runes };
    const drawnForToast = [];
  
    colores.forEach(color => {
      for (let i = 0; i < n; i++) {
        const candidates = avail.filter(t => t.runa === color);
        if (candidates.length === 0) break;
  
        const random = candidates[Math.floor(Math.random() * candidates.length)];
  
        // quitar de avail y añadir a used
        avail = avail.filter(t => t.uuid !== random.uuid);
        used.push(random);
  
        // incrementar contador en el track
        runesCopy[color] = (runesCopy[color] || 0) + 1;

      }
    });
  
    // Aplicamos cambios UNA vez
    setAvailableTiles(avail);
    setUsedTiles(used);
    setRunes(runesCopy);
  
    // Opcional: mostrar toasts
    // drawnForToast.forEach(tile => showTileToast(tile, 'show'));
  };
  
    
  const drawTileByColor = (color) => {
    const candidates = availableTiles.filter(t => t.runa === color);
    if (candidates.length === 0) return null;
  
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setAvailableTiles(prev => prev.filter(t => t.uuid !== random.uuid));
    setUsedTiles(prev => [...prev, random]);
  
    addRune(color);
    return random;
  };

  const drawTilePreviewByColor = (color) => {
    const candidates = availableTiles.filter(t => t.runa === color);
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  
  const drawMultipleTiles = (count) => {
    const available = [...availableTiles];
     if (available.length < count) {
      setTileWarning(`(${ti.aviso3}) (${available.length} / ${count})`);
      return null;
    }
  
    const selected = [];
  
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const tile = available.splice(randomIndex, 1)[0];
      selected.push(tile);
      addRune(tile.runa);
    }
  
    setAvailableTiles(available);
    setUsedTiles(prev => [...prev, ...selected]);
  
    return selected;
  };


  const resetTiles = () => {
    setAvailableTiles(FICHAS.map(f => ({ ...f, uuid: uuidv4() })));
    setUsedTiles([]);
    setDiscardedTiles({
      rojo: [],
      azul: [],
      verde: [],
      naranja: [],
      gris: [],
    });
    setPilas([]); // 🔁 Limpiar también las pilas
    setPilasConcentrada([]);
    clearRunes();
    setSpawnPoints([]);
    setControlPoints([]);
  };

  const discardTileByColor = (color) => {
    const candidates = availableTiles.filter(t => t.runa === color);
    if (candidates.length === 0) return null;
  
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setAvailableTiles(prev => prev.filter(t => t.uuid !== random.uuid));
    setDiscardedTiles(prev => ({
      ...prev,
      [color]: [...prev[color], random]
    }));
    return random;
  };

  const discardTileRandom = () => {
    if (availableTiles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableTiles.length);
    const tile = availableTiles[randomIndex];
  
    setAvailableTiles(prev => prev.filter(t => t.uuid !== tile.uuid));
    setDiscardedTiles(prev => ({
      ...prev,
      [tile.runa]: [...prev[tile.runa], tile]
    }));
    return tile;
  };

  const restoreDiscardedTile = (color) => {
    const pile = discardedTiles[color];
    if (pile.length === 0) return null;
  
    const restored = pile[pile.length - 1];
    setDiscardedTiles(prev => ({
      ...prev,
      [color]: prev[color].slice(0, -1)
    }));
    setAvailableTiles(prev => [...prev, restored]);
    return restored;
  };

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const addNewPila = () => {
    const coloresAleatorios = shuffle(['rojo', 'azul', 'verde', 'naranja', 'gris']);
    const nuevaPila = [];
  
    for (const color of coloresAleatorios) {
      const tile = discardTileByColor(color); // usamos discard para mantener consistencia
      if (!tile) return null; // abortar si falta alguna
      nuevaPila.push(tile);
    }
  
    const nueva = {
      id: uuidv4(),
      tiles: nuevaPila,
      estado: 'reserva',
      numPila: contadorPilas
    };
  
    setPilas(prev => [...prev, nueva]);
    setContadorPilas(prev => prev + 1);
    return nueva;
  };

  const removeTileFromPila = (pilaId) => {
    // 1) Leer estado actual y decidir qué quitar (fuera de setPilas)
    const pilaActual = pilas.find(p => p.id === pilaId);
    if (!pilaActual || pilaActual.tiles.length === 0) return null;
  
    const [firstTile, ...resto] = pilaActual.tiles;
  
    // 2) Devolver la ficha a la base
    setAvailableTiles(prev => [...prev, firstTile]);
  
    // 3) Actualizar pilas (eliminar la pila si queda vacía)
    setPilas(prev =>
      prev
        .map(p => {
          if (p.id !== pilaId) return p;
          return resto.length === 0 ? null : { ...p, tiles: resto };
        })
        .filter(Boolean)
    );
  
    // 4) Devolver la ficha para el toast
    return firstTile;
  };

  const placeTilesFromPilaToTrack = (pilaId) => {
    const pilaActual = pilas.find(p => p.id === pilaId);
    if (!pilaActual || !Array.isArray(pilaActual.tiles) || pilaActual.tiles.length === 0) return [];

    // Copia de las tiles que vamos a colocar
    const tilesRestantes = [...pilaActual.tiles];

    // 1) Añadirlas a usedTiles (las ponemos en el track)
    setUsedTiles(prev => [...prev, ...tilesRestantes]);

    // 2) Actualizar contadores de runas de forma global (sumar por color)
    const increments = tilesRestantes.reduce((acc, t) => {
      acc[t.runa] = (acc[t.runa] || 0) + 1;
      return acc;
    }, {});
    if (Object.keys(increments).length > 0) {
      setRunes(prev => {
        const next = { ...prev };
        Object.entries(increments).forEach(([color, amount]) => {
          next[color] = (next[color] || 0) + amount;
        });
        return next;
      });
    }

    // 3) Mostrar toast/feedback por cada ficha colocada
    tilesRestantes.forEach(tile => showTileToast(tile, 'add')); // tipo 'add' (igual que draw)

    // 4) Eliminar la pila entera
    setPilas(prev => prev.filter(p => p.id !== pilaId));

    // 5) Devolver las tiles por si hace falta manejar algo desde el caller
    return tilesRestantes;
  };
  
  const activarPila = (id) => {
    setPilas(prev => prev.map(pila => 
      pila.id === id ? { ...pila, estado: 'activa' } : pila
    ));
  };
  
  const addNewPilaConcentrada = () => {
    const colores = shuffleArray(['naranja', 'verde', 'azul', 'rojo', 'gris']);
    const tilesSeleccionadas = [];
    let updatedRunes = { ...runes };
    let updatedUsedTiles = [...usedTiles];
    
    colores.forEach(color => {
      if (updatedRunes[color] > 0) {
        // buscar una tile de ese color en la copia
        const index = updatedUsedTiles.findIndex(t => t.runa === color);
        if (index !== -1) {
          const tile = updatedUsedTiles[index];
          tilesSeleccionadas.push(tile);
  
          // quitar la tile de la copia
          updatedUsedTiles.splice(index, 1);
  
          // reducir contador en la copia
          updatedRunes[color] = updatedRunes[color] - 1;
        }
      }
    });

    if (tilesSeleccionadas.length === 0) {
      alert(ti.noRunasColocadas || 'No hay runas colocadas para formar la pila');
      return;
    }

    // aplicar cambios de una sola vez
    setUsedTiles(updatedUsedTiles);
    setRunes(updatedRunes);
    
    // Crear la nueva pila
    const nuevaPila = {
      id: uuidv4(),
      tiles: tilesSeleccionadas,
      estado: 'reserva',
      numPila: contadorPilasConcentradas
    };
    
    setPilasConcentrada(prev => [...prev, nuevaPila]);
    setContadorPilasConcentradas(prev => prev + 1);
    return nuevaPila;

  };
  
  const removeTileFromPilaConcentrada = (pilaId) => {
    // 1) Buscar la pila actual y extraer ficha fuera del setState
    const pilaActual = pilasConcentrada.find(p => p.id === pilaId);
    if (!pilaActual || pilaActual.tiles.length === 0) return null;
  
    const [firstTile, ...resto] = pilaActual.tiles;
  
    // 2) Devolver ficha a la bolsa
    setAvailableTiles(prev => [...prev, firstTile]);
  
    // 3) Actualizar pilas (eliminar pila si queda vacía)
    setPilasConcentrada(prev =>
      prev
        .map(p => {
          if (p.id !== pilaId) return p;
          return resto.length === 0 ? null : { ...p, tiles: resto };
        })
        .filter(Boolean)
    );
  
    // 4) Devolver ficha eliminada para el toast
    return firstTile;
  };

  const placeTilesFromPilaConcentradaToTrack = (pilaId) => {
    const pilaActual = pilasConcentrada.find(p => p.id === pilaId);
    if (!pilaActual || !Array.isArray(pilaActual.tiles) || pilaActual.tiles.length === 0) return [];

    // Copia de las tiles que vamos a colocar
    const tilesRestantes = [...pilaActual.tiles];

    // 1) Añadirlas a usedTiles (las ponemos en el track)
    setUsedTiles(prev => [...prev, ...tilesRestantes]);

    // 2) Actualizar contadores de runas de forma global (sumar por color)
    const increments = tilesRestantes.reduce((acc, t) => {
      acc[t.runa] = (acc[t.runa] || 0) + 1;
      return acc;
    }, {});
    if (Object.keys(increments).length > 0) {
      setRunes(prev => {
        const next = { ...prev };
        Object.entries(increments).forEach(([color, amount]) => {
          next[color] = (next[color] || 0) + amount;
        });
        return next;
      });
    }

    // 3) Mostrar toast/feedback por cada ficha colocada
    tilesRestantes.forEach(tile => showTileToast(tile, 'add')); // tipo 'add' (igual que draw)

    // 4) Eliminar la pila entera
    setPilasConcentrada(prev => prev.filter(p => p.id !== pilaId));

    // 5) Devolver las tiles por si hace falta manejar algo desde el caller
    return tilesRestantes;
  };
  

  const activarPilaConcentrada = (id) => {
    setPilasConcentrada(prev => prev.map(pila => 
      pila.id === id ? { ...pila, estado: 'activa' } : pila
    ));
  };


  const deleteAvailableTileByColor = (color) => {
    const candidates = availableTiles.filter(t => t.runa === color);
    if (candidates.length === 0) return null;
  
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setAvailableTiles(prev => prev.filter(t => t.uuid !== random.uuid));
    return random; // Por si quieres mostrar con toast o alert
  };
  
  const deleteAvailableTileRandom = () => {
    if (availableTiles.length === 0) return null;
  
    const randomIndex = Math.floor(Math.random() * availableTiles.length);
    const random = availableTiles[randomIndex];
    setAvailableTiles(prev => prev.filter((_, i) => i !== randomIndex));
    return random;
  };

  const showTileToast = (tile, tipo = 'remove') => {
    const uuid = uuidv4();
    const tileWithId = { ...tile, tipo, uuid };
    setTileToasts(prev => [...prev, tileWithId]);
  };
  
  const manifestTile = () => {
    if (availableTiles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableTiles.length);
    const randomColor = availableTiles[randomIndex].runa;
    
    //const allColors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    //const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
    const tile = drawTilePreviewByColor(randomColor);
    if (tile) {
      showTileToast(tile, 'show');
    }
    return tile;
  };

  const initializeSpawnPoints = (tipo = "runa") => {
    if (tipo === "evento") {
      // ✅ Solo un punto genérico de evento
      const newPoints = [
        {
          uuid: uuidv4(),
          runa: "evento",
          tile: { id: "evento", nombre: "Evento" } // puedes ajustar los datos que quieras mostrar
        }
      ];
      setSpawnPoints(newPoints);
      return;
    }
  
    // ✅ Versión clásica: por runas
    const colors = ["naranja", "verde", "azul", "rojo", "gris"];
    const newPoints = [];
  
    colors.forEach(color => {
      const tile = deleteAvailableTileByColor(color); // quita 1 ficha de la bolsa
      if (tile) {
        newPoints.push({
          uuid: uuidv4(),
          runa: color,
          tile
        });
      } else {
        alert(`No hay fichas ${ti.colores[color]} para crear punto de aparición`);
      }
    });
  
    setSpawnPoints(newPoints);
  };

  
  const removeSpawnPoint = (uuid) => {
    setSpawnPoints(prev => {
      const point = prev.find(p => p.uuid === uuid);
      if (point) {
        // ✅ devolvemos la ficha a la bolsa
        //restoreTile(point.tile);
      }
      return prev.filter(p => p.uuid !== uuid);
    });
  };

  const initializeControlPoints = () => {
    const colors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    const newPoints = [];
  
    colors.forEach(color => {
      const tile = deleteAvailableTileByColor(color); // quita 1 ficha de la bolsa
      if (tile) {
        newPoints.push({
          uuid: uuidv4(),
          runa: color,
          tile
        });
      } else {
        alert(`No hay fichas ${ti.colores[color]} para crear una Barricada`);
      }
    });
  
    setControlPoints(newPoints);
  };
  
  const removeControlPoint = (uuid) => {
    setControlPoints(prev => {
      const point = prev.find(p => p.uuid === uuid);
      if (point) {
        // ✅ Colocar la ficha en el track 
        addRune(point.runa);
        // ✅ Eliminar 2 de la bolsa del mismo color
        deleteAvailableTileByColor(point.runa);
        deleteAvailableTileByColor(point.runa);
      }
      return prev.filter(p => p.uuid !== uuid);
    });
  };

  const initializeRuneKeys = () => {
    // Solo tiene los 4 colores esta mecánica
    const colors = ['naranja', 'verde', 'rojo', 'gris'];
    const newPoints = [];
  
    colors.forEach(color => {
      const tile = deleteAvailableTileByColor(color); // quita 1 ficha de la bolsa
      if (tile) {
        newPoints.push({
          uuid: uuidv4(),
          runa: color,
          tile
        });
      } else {
        alert(`No hay fichas ${ti.colores[color]} para crear punto de aparición`);
      }
    });
  
    setRuneKeys(newPoints);
  };
  
  const removeRuneKey = (uuid) => {
    setRuneKeys(prev => {
      const point = prev.find(p => p.uuid === uuid);
      if (point) {
        // ✅ devolvemos la ficha a la bolsa
        //restoreTile(point.tile);
      }
      return prev.filter(p => p.uuid !== uuid);
    });
  };

  const initializeRescue = () => {
    const colors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    const newPoints = [];
  
    colors.forEach(color => {
      const tile = deleteAvailableTileByColor(color); // quita 1 ficha de la bolsa
      if (tile) {
        newPoints.push({
          uuid: uuidv4(),
          runa: color,
          tile
        });
      } else {
        alert(`No hay fichas ${ti.colores[color]} para crear punto de aparición del aldeano`);
      }
    });
  
    setRescue(newPoints);
  };
  
  const removeRescue = (uuid) => {
    setRescue(prev => {
      const point = prev.find(p => p.uuid === uuid);
      if (point) {
        // ✅ devolvemos la ficha a la bolsa
        //restoreTile(point.tile);
      }
      return prev.filter(p => p.uuid !== uuid);
    });
  };
  
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const initializeDecks = () => {
    const aldeanoBase = ALDEANO.map(card => card.id);
    const errantesBase = ERRANTES.map(card => card.id);
    setAldeanoDeck(shuffleArray(aldeanoBase));
    setErrantesDeck(shuffleArray(errantesBase));
  };

  const drawCardFromDeck = (deckType) => {
    let selectedDeck = [];
    let setDeckFn = null;
    let sourceDB = null;
  
    if (deckType === 'aldeano') {
      if (!aldeanoDeck) {
        console.warn(`⚠ El mazo de aldeanos no está inicializado`);
        return null;
      }
      selectedDeck = [...aldeanoDeck];
      setDeckFn = setAldeanoDeck;
      sourceDB = ALDEANO;
    } else if (deckType === 'errantes') {
      if (!errantesDeck) {
        console.warn(`⚠ El mazo de errantes no está inicializado`);
        return null;
      }
      selectedDeck = [...errantesDeck];
      setDeckFn = setErrantesDeck;
      sourceDB = ERRANTES;
    } else {
      console.warn(`❌ Mazo desconocido: ${deckType}`);
      return null;
    }
  
    if (selectedDeck.length === 0) {
      console.warn(`⚠ El mazo ${deckType} está agotado. No se puede robar más.`);
      return null;
    }
  
    const drawnCardId = selectedDeck.shift(); // Sacamos la primera carta
    setDeckFn(selectedDeck); // Guardamos el mazo actualizado
  
    const fullCardData = sourceDB.find(c => c.id === drawnCardId);
    if (!fullCardData) {
      console.error(`❌ Carta con id ${drawnCardId} no encontrada en ${deckType}`);
      return null;
    }
  
    return fullCardData;
  };

  const handleTileDraw = (tile) => {
    if (!tile) return;
    showTileToast(tile, 'add');
  };
  
  return (
    <GameContext.Provider
      value={{
        runes,
        addRune,
        removeRune,
        getRuneCount,
        clearRunes,
        availableTiles,
        usedTiles,
        drawTileByColor,
        drawTilePreviewByColor,
        drawMultipleTiles,
        discardedTiles,
        discardTileByColor,
        discardTileRandom,
        restoreDiscardedTile,
        pilas, setPilas, addNewPila, activarPila, activarPilaConcentrada, codigosPilas, setCodigosPilas, handleCodigoChange,
        removeTileFromPila, addRunesCascade, placeTilesFromPilaToTrack,
        pilasConcentrada, setPilasConcentrada, addNewPilaConcentrada, removeTileFromPilaConcentrada, placeTilesFromPilaConcentradaToTrack,
        resetTiles,
        tileWarning, 
        setTileWarning,
        deleteAvailableTileByColor,
        deleteAvailableTileRandom,
        scenarioMonster,
        setScenarioMonster,
        manifestTile,
        handleTileDraw,
        showTileToast,
        setTileToasts,
        tileToasts,
        setSpawnPoints,
        spawnPoints,
        initializeSpawnPoints,
        removeSpawnPoint,
        controlPoints, 
        setControlPoints,
        initializeControlPoints,
        removeControlPoint,
        setRuneKeys, runeKeys, initializeRuneKeys, removeRuneKey,
        setRescue, rescue, initializeRescue, removeRescue,
        initializeDecks,
        drawCardFromDeck
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
