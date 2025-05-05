// src/pages/InitTracker.jsx
import { useNavigate } from 'react-router-dom';
import { MdScreenRotation } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import TopMenu from '@/components/TopMenu';
import classNames from 'classnames';
import PageTransition from "@/components/PageTransition";
import { v4 as uuidv4 } from 'uuid';

const rolesPositionMap = {
  defensor: 0,
  apoyo: 2,
  lider: 4,
  agresor: 6,
  controlador: 8
};

const runesColorMap = {
  naranja: 1,
  verde: 3,
  azul: 5,
  rojo: 7,
  gris: 9
};

const allowedCategories = ['campeon', 'veterano', 'soldado', 'bisoño'];
const behaviorOptions = ['estandar', 'alternativo', 'complejo'];

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { placedEnemies, placeEnemy, removeEnemyAt, resetPlacedEnemies } = useInitEnemies();
  const { language, translations } = useLanguage();
  const navigate = useNavigate();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const tc = translations.enemies?.categoria || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const behaviors = trackerData.behaviors;
  const enemies = trackerData.enemies;
  const [categorySelector, setCategorySelector] = useState({ open: false, color: null });
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);
  const [manualSelector, setManualSelector] = useState({ open: false, color: null });
  const [selectedColor, setSelectedColor] = useState('');
  
  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id) => translations.enemies?.[id] || id;

  const openCategorySelector = (color) => setCategorySelector({ open: true, color });
  const openManualSelector = (color) => setManualSelector({ open: true, color });

  const handleCategorySelect = (categoryKey) => {
    const color = categorySelector.color;
    setCategorySelector({ open: false, color: null });
    const filtered = ENEMIES.filter(e => e.color === color && e.categoria === categoryKey && enemies.includes(e.id));
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex
      }
    });
  };

  const handleManualEnemyAdd = (enemyId, behaviorType = null) => {
    const selected = ENEMIES.find(e => e.id === enemyId && enemies.includes(e.id));
    if (!selected) return;
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        comportamiento: behaviorType // Aquí se asigna el comportamiento
      }
    });
  };

  const handleRandomCommander = () => {
    const filtered = ENEMIES.filter(e => e.categoria === 'comandante');
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex
      }
    });
  };

  const getEnemiesByColor = (trackerEnemies, color, behaviorType = null) => {
    return trackerEnemies
      .map(id => ENEMIES.find(e => e.id === id))
      .filter(enemy => enemy && enemy.color === color && 
        (behaviorType ? enemy.comportamiento === behaviorType : true)); // Filtrar por comportamiento si se especifica
  };

  const handleSelectBoss = () => console.log("Seleccionar jefes");
  const handleSelectOther = () => console.log("Seleccionar otros");

  useEffect(() => {
    const initialHeroes = trackerData.heroes.map(id => {
      const role = trackerData.roles[id];
      const image = HEROES.find(h => h.id === id)?.image;
      return { id, role, image, position: rolesPositionMap[role] };
    });
    const handleResize = () => setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    setTrackerData(prev => ({ ...prev, placedHeroes: initialHeroes }));
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in">
          <MdScreenRotation className="text-6xl mb-4 animate-spin-slow" />
          <p className="text-xl font-semibold">Por favor, gira tu dispositivo a orientación horizontal</p>
          <p className="text-sm mt-2 text-gray-300">Para disfrutar correctamente del control de turnos</p>
        </div>
      </div>
    );
  }

  const rolesOnTop = ['defensor', 'lider', 'controlador'];
  const rolesOnBottom = ['apoyo', 'agresor'];

  const countsPerIndex = Array(11).fill(0).map((_, index) => {
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');
    return Math.max(heroesAbove.length + enemiesAbove.length, heroesBelow.length + enemiesBelow.length);
  });

  const maxCharactersInAnySlot = Math.max(...countsPerIndex);
  let dynamicHeight = 'h-192';
  if (maxCharactersInAnySlot >= 5) dynamicHeight = 'h-256';
  else if (maxCharactersInAnySlot >= 3) dynamicHeight = 'h-192';

  const CharacterCard = ({ name, image, position }) => (
    <div className="flex flex-col items-center mx-1">
      {position === 'top' && <div className="text-xs mt-1">{name}</div>}
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg border-2 border-yellow-400" />
      {position === 'bottom' && <div className="text-xs mt-1">{name}</div>}
    </div>
  );

  const EnemyCard = ({ name, image, position }) => (
    <div className="flex flex-col items-center mx-1">
      {position === 'top' && <div className="text-xs mt-1">{name}</div>}
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg border-2 border-white-400" />
      {position === 'bottom' && <div className="text-xs mt-1">{name}</div>}
    </div>
  );

  const renderSlot = (index) => {
    const isRune = Object.values(runesColorMap).includes(index);
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');


    return (
      <div key={index} className={`flex flex-col w-full ${dynamicHeight} py-2`}>
        <div className="flex items-end justify-center gap-1 flex-wrap overflow-y-auto h-52">
          {heroesAbove.map(h => <CharacterCard key={h.id} name={getHeroName(h.id)} image={h.image} position="top" />)}
     
          {isRune && enemiesAbove.map((e, i) => ( <EnemyCard key={e.enemy.uuid} name={getEnemyName(e.enemy.id)} image={e.enemy.imagen} position="top" />))}
        </div>

        <div className="flex items-center justify-center h-8 bg-gray-300">
          <div className={classNames(
            'flex items-center justify-center font-fantasy',
            {
              'w-12 h-12 rotate-45 bg-orange-500 shadow border-4': index === 1,
              'w-12 h-12 rotate-45 bg-green-500 shadow border-4': index === 3,
              'w-12 h-12 rotate-45 bg-blue-500 shadow border-4': index === 5,
              'w-12 h-12 rotate-45 bg-red-500 shadow border-4': index === 7,
              'w-12 h-12 rotate-45 bg-gray-500 shadow border-4': index === 9,
              'w-full h-10 bg-gray-300 text-black text-center shadow': index % 2 === 0
            })}>
            <span className={classNames({ 'rotate-[315deg]': index % 2 !== 0 })}>
              {index === 0 && tr.defensor ||
                index === 2 && tr.apoyo ||
                index === 4 && tr.lider ||
                index === 6 && tr.agresor ||
                index === 8 && tr.controlador ||
                index === 10 && ti.rune}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-center gap-1 flex-wrap overflow-y-auto h-52">
          {heroesBelow.map(h => <CharacterCard key={h.id} name={getHeroName(h.id)} image={h.image} position="bottom" />)}
       
          {isRune && enemiesBelow.map((e, i) => ( <EnemyCard key={e.enemy.uuid} name={getEnemyName(e.enemy.id)} image={e.enemy.imagen} position="bottom" />))}
        </div>
      </div>
    );
  };

  return (
    
      <PageTransition>
        <div className={isLandscape ? "" : "portrait-lock"}>
          <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
            <div className="no-header" />
            <h1 className="text-3xl font-bold text-yellow-300 font-fantasy mb-6">- {ti.title || 'Inicio del Tracker'} -</h1>
            <TopMenu
              onAddEnemy={openCategorySelector}
              onSelectCommander={handleRandomCommander}
              onSelectBoss={handleSelectBoss}
              onSelectOther={handleSelectOther}
              onAddManual={openManualSelector}
              behaviors={behaviors}
            />
            <div className="grid grid-cols-11 gap-0 auto-rows-auto bg-slate-700">
              {[...Array(11)].map((_, idx) => renderSlot(idx))}
            </div>
  
            {categorySelector.open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white text-black p-6 rounded-xl shadow-xl w-[90%] max-w-md">
                  <h2 className="text-lg font-bold mb-4 text-center">{ti.selectCategory}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {allowedCategories.map(cat => (
                      <button key={cat} onClick={() => handleCategorySelect(cat)} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow">
                        {tc[cat] || cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Manual Selector Modal */}
            {manualSelector.open && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl text-yellow-300 mb-4">{ti.manualTitle || 'Seleccionar enemigo manualmente'}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getEnemiesByColor(enemies, manualSelector.color).map((enemy) => (
                      <div key={enemy.id} className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
                        <img src={enemy.imagen} alt={enemy.id} className="w-20 h-20 object-cover mb-2 rounded" />
                        <div className="text-sm text-white text-center mb-1">{getEnemyName(enemy.id)}</div>
                        {allowedCategories.includes(enemy.categoria) ? (
                          behaviors.filter(type =>
                              !enemy.comportamiento || enemy.comportamiento.includes(type)
                            ).
                            map(type => (
                            <button
                              key={type}
                              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded mb-1"
                              onClick={() => handleManualEnemyAdd(enemy.id, type)} // Pasar el tipo de comportamiento
                            >
                              {ti.behavior?.[type] || type}
                            </button>
                          ))
                        ) : (
                          <button
                            className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => handleManualEnemyAdd(enemy.id)} // Si no tiene categoría, solo agregar
                          >
                            {ti.addEnemy || 'Añadir'}
                          </button>
                        )}
                      </div>

                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setManualSelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow">
                {ti.goHome || 'Ir al inicio'}
              </button>
              <button onClick={() => navigate('/tracker')} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow">
                {ti.backToConfig || 'Volver a configuración'}
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    
  );
};

export default InitTracker;

