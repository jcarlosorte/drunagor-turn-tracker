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
  const [aldeanoDeck, setAldeanoDeck] = useState([]);
  const [errantesDeck, setErrantesDeck] = useState([]);
  
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
    };
  
    setPilas(prev => [...prev, nueva]);
    return nueva;
  };

  const removeTileFromPila = (pilaId) => {
    setPilas(prevPilas => {
      const nuevaLista = prevPilas.map(pila => {
        if (pila.id !== pilaId) return pila;
  
        const [firstTile, ...resto] = pila.tiles;
        if (!firstTile) return null; // Nada que quitar
  
        // Devolver ficha a la base
        setAvailableTiles(prev => [...prev, firstTile]);
  
        return {
          ...pila,
          tiles: resto
        };
      }).filter(Boolean); // Eliminar pilas que hayan quedado vacías
  
      return nuevaLista;
    });
  
    // Nota: devolver la ficha para el toast
    const pila = pilas.find(p => p.id === pilaId);
    if (pila && pila.tiles.length > 0) {
      return pila.tiles[0]; // la ficha que vamos a mostrar
    }
  
    return null;
  };

  const addNewPilaConcentrada = () => {
    const colores = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    const tilesSeleccionadas = colores
      .map(color => {
        const tile = placedRunes.find(r => r.runa === color); // busca la primera de ese color
        return tile || null;
      })
      .filter(Boolean); // quita nulls (colores que no había)
    
    if (tilesSeleccionadas.length === 0) {
      alert(t.noRunasColocadas || 'No hay runas colocadas para formar la pila');
      return;
    }

    // Quitarlas del medidor / tracker
    tilesSeleccionadas.forEach(tile => {
      removeRune(tile.runa); // función que quita la runa colocada
    });
    
    // Crear la nueva pila
    const nuevaPila = {
      id: uuidv4(),
      tiles: tilesSeleccionadas
    };
    
    setPilasConcentrada(prev => [...prev, nuevaPila]);
    return nuevaPila;
  };

  const removeTileFromPilaConcentrada = (pilaId) => {
    setPilasConcentrada(prevPilas => {
      const nuevaLista = prevPilas.map(pila => {
        if (pila.id !== pilaId) return pila;
  
        const [firstTile, ...resto] = pila.tiles;
        if (!firstTile) return null; // Nada que quitar
  
        // Devolver ficha a la base
        setAvailableTiles(prev => [...prev, firstTile]);
  
        return {
          ...pila,
          tiles: resto
        };
      }).filter(Boolean); // Eliminar pilas que hayan quedado vacías
  
      return nuevaLista;
    });
  
    // Nota: devolver la ficha para el toast
    const pila = pilasConcentrada.find(p => p.id === pilaId);
    if (pila && pila.tiles.length > 0) {
      return pila.tiles[0]; // la ficha que vamos a mostrar
    }
  
    return null;
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
    setTimeout(() => {
      setTileToasts(prev => prev.filter(t => t.uuid !== uuid));
    }, 3000);
  };
  
  const manifestTile = () => {
    const allColors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
    const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
    const tile = drawTilePreviewByColor(randomColor);
    if (tile) {
      showTileToast(tile, 'show');
    }
    return tile;
  };

  const initializeSpawnPoints = () => {
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
        // ✅ Eliminar 2 de la bolsa del mismo color ++++ PENDIENTE +++
        deleteAvailableTileByColor(point.runa);
        deleteAvailableTileByColor(point.runa);
      }
      return prev.filter(p => p.uuid !== uuid);
    });
  };
  
  // Función de shuffle genérica
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const initializeDecks = () => {
    const aldeanoBase = ALDEANO.map(card => card.id);
    const errantesBase = ERRANTES.map(card => card.id);
  
    setAldeanoDeck(shuffleArray(aldeanoBase));
    setErrantesDeck(shuffleArray(errantesBase));
  
    console.log("✅ Mazos inicializados y barajados");
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
      console.log(aldeanoDeck);
      console.log(errantesDeck);
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
        pilas,
        setPilas,
        addNewPila,
        removeTileFromPila,
        pilasConcentrada, setPilasConcentrada, addNewPilaConcentrada, removeTileFromPilaConcentrada,
        resetTiles,
        tileWarning, 
        setTileWarning,
        deleteAvailableTileByColor,
        deleteAvailableTileRandom,
        scenarioMonster,
        setScenarioMonster,
        manifestTile,
        showTileToast,
        tileToasts,
        setSpawnPoints,
        spawnPoints,
        initializeSpawnPoints,
        removeSpawnPoint,
        controlPoints, 
        setControlPoints,
        initializeControlPoints,
        removeControlPoint,
        initializeDecks,
        drawCardFromDeck
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
