import React, { createContext, useContext, useState } from 'react';
import { FICHAS } from '@/data/fichas';

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

  const [availableTiles, setAvailableTiles] = useState(
    FICHAS.map(f => ({ ...f, uuid: uuidv4() }))
  );
  const [tileWarning, setTileWarning] = useState(null);
  const [usedTiles, setUsedTiles] = useState([]);
  
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};

    
  const addRune = (color) => {
    
    setRunes(prev => ({
      ...prev,
      [color]: prev[color] + 1
    }));
  };

  const removeRune = (color) => {
    
    setRunes(prev => ({
      ...prev,
      [color]: Math.max(prev[color] - 1, 0)
    }));
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
    console.log("RESETTING TILES...");
    const fresh = FICHAS.map(f => ({ ...f, uuid: uuidv4() }));
    setAvailableTiles(fresh);
    setUsedTiles([]);
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
        drawMultipleTiles,
        resetTiles,
        tileWarning, 
        setTileWarning
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
