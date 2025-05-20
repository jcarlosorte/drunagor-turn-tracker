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
import { useExpansions } from '@/context/ExpansionContext';
import TopMenu from '@/components/TopMenu';
import AnimatedEnemyToast from '@/components/AnimatedEnemyToast';
import classNames from 'classnames';
import PageTransition from "@/components/PageTransition";
import { ModalEnemyCard } from "@/components/ModalEnemyCard";
import ModalCommanderPC from '@/components/ModalCommanderPC';
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
  const { placedEnemies, setPlacedEnemies, placeEnemy, removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies } = useInitEnemies();
  const { language, translations } = useLanguage();
  const { selectedExpansions } = useExpansions();
  const navigate = useNavigate();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const tc = translations.enemies?.categoria || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const behaviors = trackerData.behaviors;
  const enemies = trackerData.enemies;
  const selectedHeroes = trackerData.heroes;
  const numHeroes = selectedHeroes.length;
  const [categorySelector, setCategorySelector] = useState({ open: false, color: null });
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);
  const [manualSelector, setManualSelector] = useState({ open: false, color: null });
  const [selectedColor, setSelectedColor] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedEnemyUuid, setSelectedEnemyUuid] = useState(null);
  const specialCategories = ['comandante', 'jefe', 'otros'];

  const [showPCModal, setShowPCModal] = useState(false);
  const [onPCConfirm, setOnPCConfirm] = useState(null);
  const [modalColor, setModalColor] = useState('gray');
  
  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id) => translations.enemies?.[id] || id;

  const openCategorySelector = (color) => setCategorySelector({ open: true, color });
  const openManualSelector = (color) => setManualSelector({ open: true, color });

  const openCommanderPCModal = (color, callback) => {
    setModalColor(color);
    setOnPCConfirm(() => callback);
    setShowPCModal(true);
  };
  
  const closePCModal = () => {
    setShowPCModal(false);
    setOnPCConfirm(null);
  };

  const enemiesInSelectedExpansions = ENEMIES.filter(e => 
    selectedExpansions.includes(e.expansionId) &&
    e.color !== "jefe" && e.color !== "hero" && e.color !== "esbirro"
  );
  
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
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento, 
        ataque: selected.ataque,
        color: selected.color
      }
    });
  };

  const getCommanderHealth = (baseVida) => {
    const pcStr = prompt("Introduce el valor de PC:");
    const pc = parseInt(pcStr);
    if (isNaN(pc) || pc <= 0) {
      alert("PC inválido, se usará PC = 1 por defecto.");
      return baseVida * (1 + selectedHeroes.length);
    }
    return baseVida * (pc + selectedHeroes.length);
  };
  
  const handleManualEnemyAdd = (enemyId, behaviorType, category) => {
    setManualSelector({ open: false, color: null });
    const selected = ENEMIES.find(
      e => e.id === enemyId && e.categoria === category && e.comportamiento === behaviorType && enemies.includes(e.id)
    );
    if (!selected) return;

    if (selected.categoria === 'comandante') {
      openCommanderPCModal(selected.color, (pcValue) => {
        const totalVida = selected.vida * (pcValue + numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const enemy = {
          uuid: uuidv4(),
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color
        };
        showToast(enemy);
        placeEnemy({ enemy });
      });
      return;
    }

    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuidv4(),
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: category,
        comportamiento: behaviorType,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color
      }
    });
  };
  
  const handleRandomCommander = () => {
    const filtered = ENEMIES.filter(e => e.categoria === 'comandante');
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    openCommanderPCModal(selected.color, (pcValue) => {
      const totalVida = selected.vida * (pcValue + numHeroes);
      const runeIndex = runesColorMap[selected.rune];
      const runePosition = selected.runePosition;
      const enemy = {
        uuid: uuidv4(),
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: totalVida,
        vidaMax: totalVida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color
      };
      showToast(enemy);
      placeEnemy({ enemy });
    });
  };

  const onRemove = (uuid) => {
    removeEnemyByUUID(uuid);
  };
  const openEnemyModal = (uuid) => {
    setSelectedEnemyUuid(uuid);
  };

  const updateEnemyVida = (uuid, nuevaVida) => {
    setPlacedEnemies(prev =>
      prev.map(e =>
        e.enemy.uuid === uuid
          ? { ...e, enemy: { ...e.enemy, vida: nuevaVida } }
          : e
      )
    );
  };
    
  const getEnemiesByColor = (trackerEnemies, color, behaviorType = null) => {
    const validEnemies = Array.from(new Set(trackerEnemies.map(e => e.id)));
    console.log(validEnemies)
    return ENEMIES.filter(e =>
      validEnemies.includes(e.id) &&
      e.color === color &&
      (behaviorType ? e.comportamiento === behaviorType : true)
    );
  };

  const handleSelectBoss = () => console.log("Seleccionar jefes");
  const handleSelectOther = () => console.log("Seleccionar otros");

  const categoryGlowMap = {
    bisoño: 'drop-shadow-[0_0_6px_rgba(59,130,246,1)]',    // azul
    soldado: 'drop-shadow-[0_0_6px_rgba(234,179,8,1)]',     // amarillo
    veterano: 'drop-shadow-[0_0_6px_rgba(251,146,60,1)]',   // naranja
    campeon: 'drop-shadow-[0_0_6px_rgba(239,68,68,1)]'      // rojo
  };

  const categoryTextGlowMap = {
    bisoño: 'glow-bisono',
    soldado: 'glow-soldado',
    veterano: 'glow-veterano',
    campeon: 'glow-campeon',
    comandante: 'glow-commander',
  };

  const borderColorMap = {
    blanco: 'border-blanco',
    gris: 'border-gris',
    negro: 'border-negro',
    comandante: 'border-dorado',
    jefe: 'border-morado',
  };

  const textBgColorMap = {
    blanco: 'bg-white',      // Blanco con opacidad
    gris: 'bg-gray-500',     // Gris medio
    negro: 'bg-black',       // Negro
    comandante: 'bg-orange-400 ', // Dorado aproximado
    jefe: 'bg-purple-700',   // Morado
  };
  
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

  let slotHeightClass = 'h-[22rem]'; // Base height (ej. 192px o 48rem)
    if (maxCharactersInAnySlot >= 5) {
        slotHeightClass = 'h-[40rem]'; // Taller height (ej. 256px o 64rem)
    } else if (maxCharactersInAnySlot >= 3) {
        slotHeightClass = 'h-[40rem]'; // Intermediate height (ej. 224px o 56rem) - puedes añadir más granularidad
    } else if (maxCharactersInAnySlot >= 2) {
        slotHeightClass = 'h-[34rem]'; // Intermediate height (ej. 224px o 56rem) - puedes añadir más granularidad
    }

  
 const CharacterCard = ({ name, image, position }) => (
    <div className="flex flex-col items-center mx-1">
      <div className="relative w-full max-w-[140px]">
        <img
          src={image}
          alt={name}
          className="w-full h-auto object-cover rounded-lg border-2 border-[#800020]/70"
        />
        <div
          className="absolute w-full bottom-0 left-1/2 transform -translate-x-1/2 px-1 rounded-lg text-white text-xs text-center bg-[#800020]/70 leading-tight"
          style={{
            textShadow: '0 0 4px #b87333aa',
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );


  const EnemyCard = ({ id, name, comportamiento, categoria, image, position, uuid, color, onRemove, vida, vidaMax, movimiento, ataque, openEnemyModal }) => (
    <div key={uuid} className="flex flex-col items-center mx-1 relative z-10">
      <div className="relative w-full max-w-[140px] rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
   
      <img
        src={image}
        alt={name}
        className={`w-full h-auto object-cover rounded-lg border-2 ${borderColorMap[color] || ''}`}
      />
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 px-1 py-0.5 border-2 rounded-lg text-white text-xs
          ${borderColorMap[color] || ''} 
          ${textBgColorMap[color] || 'bg-black/60'} 
          ${categoryTextGlowMap[categoria] || ''} 
          enemy-text-wrapper`}
      >
        <div className="flex flex-col w-full items-center leading-none" onClick={() => {openEnemyModal(uuid);}}>
          <span className="enemy-text leading-none">{name}</span>
          {comportamiento && (
            <span className="text-[0.50rem] italic leading-none mt-0.5 opacity-90">
              {tb?.[comportamiento] || comportamiento}
            </span>
            )}
          {/* Barra de vida */}
          <div className="w-full relative h-2 mt-2">
            {/* Texto encima de la barra */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-[0.6rem] font-bold z-10">
              {vida} / {vidaMax}
            </div>
          
            {/* Barra de fondo */}
            <div className="w-full h-full bg-red-900 rounded">
              {/* Barra de vida actual */}
              <div
                className="h-full bg-red-500 rounded"
                style={{ width: `${(vida / vidaMax) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

  const renderSlot = (index) => {
    const isRune = Object.values(runesColorMap).includes(index);
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');
    const renderStack = (items, isTop, isEnemy = false) => {
      const spacing = items.length <= 2
        ? 90
        : items.length === 3
          ? 70
          : items.length === 4
            ? 40
            : 30; // Más elementos = menos separación (más solapados)
      // Revertimos el orden para que el primero tenga el mayor zIndex y quede al frente
      const reversed = isTop ? [...items].reverse() : items; 
      return reversed.map((item, i) => {
        const zIndex = isTop ? items.length + i : items.length - i;  // mayor zIndex al primero
        const offset = i * spacing;
        const style = isTop ? { bottom: `${offset}px`, zIndex } : { top: `${offset}px`, zIndex };
        
        return (
          <div key={isEnemy ? item.enemy.uuid : item.id} className="absolute w-full" style={style}>
            {isEnemy ? (
              <EnemyCard
                uuid={item.enemy.uuid}
                id={item.enemy.id}
                name={getEnemyName(item.enemy.id)}
                image={item.enemy.imagen}
                comportamiento={item.enemy.comportamiento}
                categoria={item.enemy.categoria}
                position={isTop ? "top" : "bottom"}
                color={item.enemy.color}
                onRemove={onRemove}
                vida={item.enemy.vida}
                vidaMax={item.enemy.vidaMax}
                movimiento={item.enemy.movimiento}
                ataque={item.enemy.ataque}
                openEnemyModal={openEnemyModal}
              />
            ) : (
              <CharacterCard
                name={getHeroName(item.id)}
                image={item.image}
                position={isTop ? "top" : "bottom"}
              />
            )}
          </div>
        );
      });
    };
  
    return (
      <div key={index} className={`flex flex-col w-full ${slotHeightClass} py-2`}>
        
        {/* Escalonado arriba */}
        <div className="relative flex justify-center h-1/2 w-full mb-5">
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            {renderStack(heroesAbove, true)}
            {isRune && renderStack(enemiesAbove, true, true)}
          </div>
        </div>
  
        {/* Centro del slot */}
        <div className="flex items-center justify-center h-8 shrink-0 bg-gray-300">
          <div className={classNames(
            'flex items-center justify-center font-fantasy',
            {
              'w-12 h-12 rotate-45 border-4 gem-orange': index === 1,
              'w-12 h-12 rotate-45 border-4 gem-green': index === 3,
              'w-12 h-12 rotate-45 border-4 gem-blue': index === 5,
              'w-12 h-12 rotate-45 border-4 gem-red': index === 7,
              'w-12 h-12 rotate-45 border-4 gem-gray': index === 9,
              'w-full h-10 bg-gray-300 text-black text-center shadow': index % 2 === 0
            })}>
            <span
              className={classNames(
                'block text-[0.6rem] sm:text-xs md:text-sm lg:text-base leading-none text-center whitespace-nowrap max-w-full overflow-hidden text-ellipsis'
              )}
              style={{ width: 'fit-content', maxWidth: '100%' }}
            >
              {index === 0 && tr.defensor ||
                index === 2 && tr.apoyo ||
                index === 4 && tr.lider ||
                index === 6 && tr.agresor ||
                index === 8 && tr.controlador ||
                index === 10 && ti.rune}
            </span>
          </div>
        </div>

        {/* Escalonado abajo */}
        <div className="relative flex justify-center h-1/2 w-full mt-5">
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            {renderStack(heroesBelow, false)}
            {isRune && renderStack(enemiesBelow, false, true)}
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
                      getEnemiesByColor(enemiesInSelectedExpansions, manualSelector.color).reduce((acc, enemy) => {
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
        {selectedEnemyUuid && (
          <ModalEnemyCard
            key={selectedEnemyUuid}
            uuid={selectedEnemyUuid}
            enemy={placedEnemies.find(e => e.enemy.uuid === selectedEnemyUuid)?.enemy}
            onClose={() => setSelectedEnemyUuid(null)}
            onDelete={onRemove}
            onVidaChange={updateEnemyVida}
          />
          )}
        {showPCModal && (
        <ModalCommanderPC
          color={modalColor}
          onConfirm={(pcValue) => {
            onPCConfirm?.(pcValue);
            closePCModal();
          }}
          onCancel={closePCModal}
        />
      )}
      </PageTransition>
  );
};

export default InitTracker;
