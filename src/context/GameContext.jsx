import React, { createContext, useContext, useState } from 'react';
import { FICHAS } from '@/data/fichas';
import { useLanguage } from '@/context/LanguageContext';
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
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const [availableTiles, setAvailableTiles] = useState(
    FICHAS.map(f => ({ ...f, uuid: uuidv4() }))
  );
  const [tileWarning, setTileWarning] = useState(null);
  const [usedTiles, setUsedTiles] = useState([]);
  const [scenarioMonster, setScenarioMonster] = useState(null);
  const [tileToasts, setTileToasts] = useState([]);
    
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
        resetTiles,
        tileWarning, 
        setTileWarning,
        deleteAvailableTileByColor,
        deleteAvailableTileRandom,
        scenarioMonster,
        setScenarioMonster,
        manifestTile,
        showTileToast,
        tileToasts
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
