// src/context/TrackerContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TrackerContext = createContext();

export const TrackerProvider = ({ children }) => {
  const [trackerData, setTrackerData] = useState(() => {
    const stored = localStorage.getItem('trackerData');
    return stored ? JSON.parse(stored) : {
      heroes: [],
      roles: {},
      enemies: [],
      behaviors: ["Estándar", "Alternativo", "Complejo"],
    };
  });

  useEffect(() => {
    localStorage.setItem('trackerData', JSON.stringify(trackerData));
    console.log('[TrackerContext] Datos seleccionados:', trackerData);
  }, [trackerData]);

  return (
    <TrackerContext.Provider value={{ trackerData, setTrackerData }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => useContext(TrackerContext);
