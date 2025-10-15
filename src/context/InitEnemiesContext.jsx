import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { createContext, useContext, useState } from 'react';

const InitEnemiesContext = createContext();

export const InitEnemiesProvider = ({ children }) => {
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const [placedEnemies, setPlacedEnemies] = useState([]);
  const [huespedActivo, setHuespedActivo] = useState(false);
  const [acechoActivo, setAcechoActivo] = useState(false);
  const [invadidosActivo, setInvadidosActivo] = useState(false);
  const [usedColors, setUsedColors] = useState([]);
  const [usedColorsBig, setUsedColorsBig] = useState([]); 
  const [enemyColorMap, setEnemyColorMap] = useState({});
  const [avisos, setAvisos] = useState([]);
  
  const { tileToasts, setTileToasts, showTileToast, handleTileDraw, drawMultipleTiles, tileWarning, setTileWarning } = useGame();

  const activaHuesped = () => setHuespedActivo(true);
  const desactivaHuesped = () => setHuespedActivo(false);

  const activaAcecho = () => setAcechoActivo(true);
  const desactivaAcecho = () => setAcechoActivo(false);

  const activaInvadidos = () => setInvadidosActivo(true);
  const desactivaInvadidos = () => setInvadidosActivo(false);
  
  // Función para mostrar aviso
  const mostrarAviso = (mensaje) => {
    setAvisos((prev) => [...prev, { id: Date.now(), mensaje }]);
  };
  
  // Función para cerrar aviso manualmente
  const removeAviso = (id) => {
    setAvisos((prev) => prev.filter((a) => a.id !== id));
  };
  
  // Función para obtener un color libre
  const getNextAvailableColor = (isBig = false) => {
    const used = new Set(isBig ? usedColorsBig : usedColors);
    const source = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
    const next = source.find(c => !used.has(c.id));
    return next ? next.id : null;
  };
  
  // Función para asignar un color a un enemigo
  const assignColorToEnemy = (enemyUUID, isBig = false, forcedColor = false) => {
    const available = forcedColor || getNextAvailableColor(isBig);
    if (!available) {
      alert(ti.noColorsAvailable || 'No hay más colores disponibles');
      return undefined;
    }
  
    if (isBig) {
      setUsedColorsBig(prev => [...prev, available]);
    } else {
      setUsedColors(prev => [...prev, available]);
    }
    setEnemyColorMap(prev => ({ ...prev, [enemyUUID]: available }));
    return available;
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
    //console.log('Placing enemy:', enemyWithPosition);
    setPlacedEnemies(prev => {
      const updated = [...prev, enemyWithPosition];
      //console.log('Updated placedEnemies:', updated);
      return updated;
    });
  };

  const removeEnemyAt = (position) => {
    //console.log('Removing enemy at position:', position);
    setPlacedEnemies(prev => {
      const updated = prev.filter(e => e.position !== position);
      //console.log('Updated placedEnemies after removal:', updated);
      return updated;
    });
  };

  const removeEnemyByUUID = (uuid) => { 
     setPlacedEnemies((prev = []) => {
        const target = prev.find(e => e.enemy.uuid === uuid);
        if (!target) return prev;
        const isCommander = target.enemy.categoria === 'comandante';
        const isOverlord = target.enemy.categoria === 'overlord';
        const isFallenHero= target.enemy.categoria === 'hero';
        const isBoss= target.enemy.categoria === 'jefe';
        const updated = prev.filter(e => {
          const enemy = e.enemy;
          if (enemy.uuid === uuid) return false;
          if (isCommander && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
          if (isOverlord && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
          if (isFallenHero && (enemy.tipo === 'especial' || enemy.tipo === 'fallenHero') && enemy.sourceEnemyUUID === uuid) return false;
          if (isBoss && enemy.tipo === 'especial' && enemy.sourceEnemyUUID === uuid) return false;
          return true;
        });

       if (huespedActivo) {
        const cantidad = target.enemy.size === 'grande' ? 2 : 1;
        const tiles = drawMultipleTiles(cantidad);
        if (tiles && tiles.length > 0) {
          tiles.forEach(tile => handleTileDraw(tile));
        } else {
          mostrarAviso(ti.aviso);
        }
        mostrarAviso(`🐉 ${ti.robaHuesped}`);
      }
      if (acechoActivo) {
        desactivaAcecho();
      }
       
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
    <InitEnemiesContext.Provider value={{ placedEnemies, setPlacedEnemies, placeEnemy, 
                                         removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies, 
                                         assignColorToEnemy, releaseColor, usedColors, setUsedColors, 
                                         usedColorsBig, setUsedColorsBig, enemyColorMap, setEnemyColorMap, 
                                         huespedActivo, activaHuesped, desactivaHuesped, 
                                         activaAcecho, desactivaAcecho, acechoActivo,
                                         activaInvadidos, desactivaInvadidos, invadidosActivo,
                                         avisos, mostrarAviso, removeAviso }}>
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

