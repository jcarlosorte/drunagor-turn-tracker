// src/context/InitTrackerContext.jsx
import React, { createContext, useContext, useState } from 'react';

const InitTrackerContext = createContext();

export const InitTrackerProvider = ({ children }) => {
  const [selectedEnemies, setSelectedEnemies] = useState([]);

  const resetEnemies = () => setSelectedEnemies([]);

  return (
    <InitTrackerContext.Provider value={{ selectedEnemies, setSelectedEnemies, resetEnemies }}>
      {children}
    </InitTrackerContext.Provider>
  );
};

export const useInitTracker = () => useContext(InitTrackerContext);
