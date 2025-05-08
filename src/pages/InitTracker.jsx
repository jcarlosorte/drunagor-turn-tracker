// src/pages/InitTracker.jsx
import { useNavigate } from 'react-router-dom';
import { MdScreenRotation } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget, GiShield, GiDaemonSkull, GiBullyMinion } from 'react-icons/gi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import TopMenu from '@/components/TopMenu';
import AnimatedEnemyToast from '@/components/AnimatedEnemyToast';
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
  const [toastMessage, setToastMessage] = useState('');
  const specialCategories = ['comandante', 'jefe', 'otros'];
  
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
    //console.log(selected);
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: selected.vida, 
        movimiento: selected.movimiento, 
        ataque: selected.ataque
      }
    });
  };

  const handleManualEnemyAdd = (enemyId, behaviorType, category) => {
    //console.log(`Enemigo añadido: ${enemyId}, Comportamiento: ${behaviorType}, Categoría: ${category}`);
    setManualSelector({ open: false, color: null });
    const selected = ENEMIES.find(e => e.id === enemyId && e.categoria === category && e.comportamiento === behaviorType && enemies.includes(e.id));
    console.log(selected);
    if (!selected) return;
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: category,
        comportamiento: behaviorType,
        vida: selected.vida, 
        movimiento: selected.movimiento, 
        ataque: selected.ataque
      }
    });
  };

  const handleRandomCommander = () => {
    const filtered = ENEMIES.filter(e => e.categoria === 'comandante');
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: selected.vida, 
        movimiento: selected.movimiento, 
        ataque: selected.ataque
      }
    });
  };

const getEnemiesByColor = (trackerEnemies, color, behaviorType = null) => {
  return ENEMIES.filter(e =>
    trackerEnemies.includes(e.id) &&
    e.color === color &&
    (behaviorType ? e.comportamiento === behaviorType : true)
  );
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

  const showToast = (enemyData) => {
    const translatedName = translations?.enemies?.[enemyData.id];
  
    toast(
      <AnimatedEnemyToast
        enemyData={enemyData}
        t={translations}

      />,
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastClassName: '!max-w-[800px] w-auto overflow-visible',
        bodyClassName: '!p-0 !m-0',
      }
    );
  };

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

  const EnemyCard = ({ name, behavior, category, image, position, uuid }) => (
    <div key={uuid} className="flex flex-col items-center mx-1">
      {position === 'top' && (
        <div className="text-xs mt-1">
          {name}
          {category && ` (${translations.categories?.[category] || category})`}
          {behavior && ` (${translations.behaviors?.[behavior] || behavior})`}
        </div>
      )}
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg border-2 border-white-400" />
      {position === 'bottom' && (
        <div className="text-xs mt-1">
          {name}
          {category && ` (${translations.categories?.[category] || category})`}
          {behavior && ` (${translations.behaviors?.[behavior] || behavior})`}
        </div>
      )}
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
        <div className="relative flex justify-center h-52">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {heroesAbove.map((h, i) => (
              <div key={h.id} className="absolute" style={{ bottom: `${i * 30}px`, zIndex: i }}>
                <CharacterCard name={getHeroName(h.id)} image={h.image} position="top" />
              </div>
            ))}
            {enemiesAbove.map((e, i) => (
              <div key={e.enemy.uuid} className="absolute" style={{ bottom: `${(heroesAbove.length + i) * 30}px`, zIndex: heroesAbove.length + i }}>
                <EnemyCard
                  name={getEnemyName(e.enemy.id)}
                  behavior={e.enemy.comportamiento}
                  category={e.enemy.categoria}
                  image={e.enemy.imagen}
                  uuid={e.enemy.uuid}
                  position="top"
                />
              </div>
            ))}
          </div>
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

        <div className="relative flex justify-center h-52">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            {heroesBelow.map((h, i) => (
              <div key={h.id} className="absolute" style={{ top: `${i * 30}px`, zIndex: i }}>
                <CharacterCard name={getHeroName(h.id)} image={h.image} position="bottom" />
              </div>
            ))}
            {enemiesBelow.map((e, i) => (
              <div key={e.enemy.uuid} className="absolute" style={{ top: `${(heroesBelow.length + i) * 30}px`, zIndex: heroesBelow.length + i }}>
                <EnemyCard
                  name={getEnemyName(e.enemy.id)}
                  behavior={e.enemy.comportamiento}
                  category={e.enemy.categoria}
                  image={e.enemy.imagen}
                  uuid={e.enemy.uuid}
                  position="bottom"
                />
              </div>
            ))}
          </div>
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
                <div className="bg-gray-900 p-4 rounded-xl shadow-lg text-white text-center">
                  <h2 className="text-lg mb-4">{ti.selectCategory}</h2>
                    {allowedCategories.map(cat => (
                      <button key={cat} onClick={() => handleCategorySelect(cat)} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded m-1">
                        {tc[cat] || cat}
                      </button>
                    ))}
                  <div className="mt-4 text-center">
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setCategorySelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
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
                    {Object.entries(
                      getEnemiesByColor(enemies, manualSelector.color).reduce((acc, enemy) => {
                        if (!acc[enemy.id]) acc[enemy.id] = {};
                        if (!acc[enemy.id][enemy.categoria]) acc[enemy.id][enemy.categoria] = [];
                        acc[enemy.id][enemy.categoria].push(enemy);
                        return acc;
                      }, {})
                    ).map(([enemyId, categories]) => {
                      const sampleEnemy = Object.values(categories)[0][0]; // Para imagen y nombre
                    
                      return (
                        <div key={enemyId} className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
                          <img src={sampleEnemy.imagen} alt={enemyId} className="w-20 h-20 object-cover mb-2 rounded" />
                          <div className="text-sm text-white text-center mb-2">{getEnemyName(enemyId)}</div>
                    
                          {Object.entries(categories).map(([categoria, variants]) => (
                            <div key={categoria} className="w-full mb-2">
                              {specialCategories.includes(categoria) ? (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {variants.map(variant => (
                                    <button
                                      key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                      onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                    >
                                      {ti.addEnemy}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs text-yellow-300 mb-1 text-center">{tc?.[categoria] || categoria}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {variants.map(variant => (
                                      <button
                                        key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                      >
                                        {tb?.[variant.comportamiento] || variant.comportamiento}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}

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
        <ToastContainer toastClassName="toast-expand" bodyClassName="" />
      </PageTransition>
    
  );
};

export default InitTracker;

