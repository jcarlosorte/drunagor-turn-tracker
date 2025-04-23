// src/pages/InitTracker.jsx
import React, { useEffect } from 'react';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import TopMenu from '@/components/TopMenu';
import classNames from 'classnames';

const rolesPositionMap = {
  defensor: 0,
  apoyo: 2,
  lider: 4,
  agresor: 6,
  controlador: 8
};

const runesColorMap = {
  orange: 1,
  green: 3,
  blue: 5,
  red: 7,
  gray: 9
};

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};

  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id) => translations.enemies?.[id] || id;
  const getRoleName = (id) => translations.roles?.[id] || id;

  const handleAddEnemy = (color) => {
    const filtered = trackerData.enemiesAvailable.filter(e => e.rune === color);
    setTrackerData(prev => ({
      ...prev,
      enemies: [...prev.enemies, ...filtered.map(e => ({ id: e.id, rune: e.rune }))]
    }));
  };

  const handleSelectBoss = () => {
    console.log("Seleccionar jefes");
  };

  const handleSelectOther = () => {
    console.log("Seleccionar otros");
  };

  const handleAddManual = () => {
    console.log("Añadir enemigo manualmente");
  };

  useEffect(() => {
    const initialHeroes = trackerData.heroes.map(id => {
      const role = trackerData.roles[id];
      const image = HEROES.find(h => h.id === id)?.image;
      return { id, role, image, position: rolesPositionMap[role] };
    });
  
    setTrackerData(prev => ({
      ...prev,
      placedHeroes: initialHeroes
    }));
  }, []);

  const renderSlot = (index) => {
    const rolesOnTop = ['defensor', 'lider', 'controlador'];
    const rolesOnBottom = ['apoyo', 'agresor'];
    const isRune = Object.values(runesColorMap).includes(index);
    const heroesAbove = trackerData.placedHeroes?.filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = trackerData.placedHeroes?.filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = trackerData.enemies?.filter(e => runesColorMap[e.rune] === index && index % 2 === 1);
    const enemiesBelow = trackerData.enemies?.filter(e => runesColorMap[e.rune] === index && index % 2 === 1);

    return (
      <div key={index} className="flex flex-col items-center w-full">
        <div className="h-20 flex items-center justify-center gap-1 flex-wrap">
          {heroesAbove?.map(h => (
            
            <div key={h.id} className="flex flex-col items-center mx-1">
              <div key={h.id} className="mt-1 text-xs text-white text-center font-semibold">
                  {getHeroName(h.id)}
              </div>  
              <img
                src={h.image}
                alt={getHeroName(h.id)}
                className="w-12 h-12 object-cover rounded-full border-2 border-yellow-300 shadow-md"
              />
            </div>
          ))}
          {isRune && enemiesAbove?.map((e, i) => (
            <div key={e.id + '-' + i} className="bg-red-200 px-2 py-1 rounded shadow text-xs">
              {getEnemyName(e.id)}
            </div>
          ))}
        </div>

        <div className="relative w-full h-8 flex items-center justify-center bg-gray-200">
          
            <div
              className={classNames(
                'flex items-center justify-center border-4',
                {
                  // Rombos
                  'w-12 h-12 rotate-45 bg-orange-500 shadow': index === 1,
                  'w-12 h-12 rotate-45 bg-green-500 shadow': index === 3,
                  'w-12 h-12 rotate-45 bg-blue-500 shadow': index === 5,
                  'w-12 h-12 rotate-45 bg-red-500 shadow': index === 7,
                  'w-12 h-12 rotate-45 bg-gray-500 shadow': index === 9,
            
                  // Cuadrados grandes con texto
                  'w-full h-10 bg-gray-200 text-black font-bold text-center shadow': index % 2 === 0
                }
              )}
            >
              <span
                className={classNames({
                  'rotate-[315deg]': index % 2 !== 0 // Revertir texto de los rombos
                })}
              >
              {index === 0 && tr.defensor ||
                index === 2 && tr.apoyo ||
                index === 4 && tr.lider ||
                index === 6 && tr.agresor ||
                index === 8 && tr.controlador ||
                index === 10 && ti.rune || null}
            </span>
          </div>
        </div>
        
        <div className="h-20 flex items-center justify-center">
          {heroesBelow?.map(h => (
          <div key={h.id} className="flex flex-col items-center mx-1">
            <img
              src={h.image}
              alt={getHeroName(h.id)}
              className="w-12 h-12 object-cover rounded-full border-2 border-yellow-300 shadow-md"
            />
            <div className="mt-1 text-xs text-white text-center font-semibold">
              {getHeroName(h.id)}
            </div>
          </div>
          ))}
          {isRune && enemiesBelow?.map((e, i) => (
            <div key={e.id + '-' + i + '-b'} className="bg-red-200 px-2 py-1 rounded shadow text-xs">
              {getEnemyName(e.id)}
            </div>
           
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <TopMenu
        onAddEnemy={handleAddEnemy}
        onSelectBoss={handleSelectBoss}
        onSelectOther={handleSelectOther}
        onAddManual={handleAddManual}
        translations={translations}
      />
      <div className="no-header" />

      <h1 className="text-3xl font-bold text-yellow-300 font-fantasy mb-6">{ti.title || 'Inicio del Tracker'}</h1>

      <div className="grid grid-cols-11 gap-0">
        {[...Array(11)].map((_, idx) => renderSlot(idx))}
      </div>
    </div>
  );
};

export default InitTracker;


