import { createContext, useContext, useState } from 'react';

const InitEnemiesContext = createContext();

export const InitEnemiesProvider = ({ children }) => {
  const [placedEnemies, setPlacedEnemies] = useState([]);

  const placeEnemy = (enemy, position) => {
    setPlacedEnemies(prev => [...prev, { enemy, position }]);
  };

  const removeEnemyAt = (position) => {
    setPlacedEnemies(prev => prev.filter(e => e.position !== position));
  };

  const resetPlacedEnemies = () => {
    setPlacedEnemies([]);
  };

  return (
    <InitEnemiesContext.Provider value={{ placedEnemies, placeEnemy, removeEnemyAt, resetPlacedEnemies }}>
      {children}
    </InitEnemiesContext.Provider>
  );
};

export const useInitEnemies = () => {
  const context = useContext(InitEnemiesContext);
  if (!context) {
    throw new Error('useInitEnemies must be used within an InitEnemiesProvider');
  }
  return context;
};
