import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [runes, setRunes] = useState({
    rojo: 0,
    azul: 0,
    verde: 0,
    naranja: 0,
    gris: 0
  });

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

  return (
    <GameContext.Provider value={{ runes, addRune, removeRune, getRuneCount }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
