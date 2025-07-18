import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useLanguage } from '@/context/LanguageContext';
import { createContext, useContext, useState } from 'react';

const InitEnemiesContext = createContext();

export const InitEnemiesProvider = ({ children }) => {
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const [placedEnemies, setPlacedEnemies] = useState([]);
  const [usedColors, setUsedColors] = useState([]);
  const [usedColorsBig, setUsedColorsBig] = useState([]); 
  const [enemyColorMap, setEnemyColorMap] = useState({});
  // Función para obtener un color libre
  const getNextAvailableColor = (isBig = false) => {
    const used = new Set(isBig ? usedColorsBig : usedColors);
    const source = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
    return source.find(c => !used.has(c.id));
  };
  
  // Función para asignar un color a un enemigo
  const assignColorToEnemy = (enemyUUID, isBig = false, forcedColor = false) => {
    const available = forcedColor || getNextAvailableColor(isBig);
    if (!available) {
      alert(ti.noColorsAvailable || 'No hay más colores disponibles');
      return undefined;
    }
  
    if (isBig) {
      setUsedColorsBig(prev => [...prev, available.id]);
    } else {
      setUsedColors(prev => [...prev, available.id]);
    }
  
    setEnemyColorMap(prev => ({ ...prev, [enemyUUID]: available.id }));
    return available.id;
  };
  // Función para liberar el color
  const releaseColor = (enemyUUID) => {
    const colorId = enemyColorMap[enemyUUID];
    if (!colorId) return;
  
    setUsedColors(prev => prev.filter(c => c !== colorId));
    setUsedColorsBig(prev => prev.filter(c => c !== colorId));
    setEnemyColorMap(prev => {
      const updated = { ...prev };
      delete updated[enemyUUID];
      return updated;
    });
  };
  
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

  const removeEnemyByUUID = (uuid) => {
   setPlacedEnemies((prev) => {
      const target = prev.find(e => e.enemy.uuid === uuid);
      if (!target) return prev;
  
      const isCommander = target.enemy.categoria === 'comandante';
      const isOverlord = target.enemy.categoria === 'overlord';
      const isFallenHero= target.enemy.categoria === 'hero';
      const isBoss= target.enemy.categoria === 'jefe';
      const updated = prev.filter(e => {
        const enemy = e.enemy;
        if (enemy.uuid === uuid) return false;
  
        if (isCommander && enemy.tipo === 'especial' && enemy.sourceCommanderId === uuid) return false;
        if (isOverlord && enemy.tipo === 'especial' && enemy.sourceOverlordId === uuid) return false;
        if (isFallenHero && enemy.tipo === 'especial' && enemy.sourceCommanderId === uuid) return false;
        if (isBoss && enemy.tipo === 'especial' && enemy.sourceBossdId === uuid) return false;
  
        return true;
      });
  
      return updated;
    });

  };
  
  const resetPlacedEnemies = () => {
    //console.log('Resetting placedEnemies');
    setPlacedEnemies([]);
    setUsedColors([]);
    setUsedColorsBig([]);
    setEnemyColorMap({});
  };

  return (
    <InitEnemiesContext.Provider value={{ placedEnemies, setPlacedEnemies, placeEnemy, removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies, assignColorToEnemy, releaseColor, usedColors, setUsedColors, usedColorsBig, setUsedColorsBig }}>
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

