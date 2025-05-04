import { createContext, useContext, useState } from 'react';

const InitEnemiesContext = createContext();

export const InitEnemiesProvider = ({ children }) => {
  const [placedEnemies, setPlacedEnemies] = useState([]);

  const placeEnemy = (enemyWithPosition) => {
    console.log('Placing enemy:', enemyWithPosition);
    setPlacedEnemies(prev => {
      const updated = [...prev, enemyWithPosition];
      console.log('Updated placedEnemies:', updated);
      return updated;
    });
  };

  const removeEnemyAt = (position) => {
    console.log('Removing enemy at position:', position);
    setPlacedEnemies(prev => {
      const updated = prev.filter(e => e.position !== position);
      console.log('Updated placedEnemies after removal:', updated);
      return updated;
    });
  };

  const resetPlacedEnemies = () => {
    console.log('Resetting placedEnemies');
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

