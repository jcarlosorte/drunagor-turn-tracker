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
  const { placedEnemies, placeEnemy, removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies } = useInitEnemies();
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
        ataque: selected.ataque,
        color: selected.color
      }
    });
  };

  const handleManualEnemyAdd = (enemyId, behaviorType, category) => {
    setManualSelector({ open: false, color: null });
    const selected = ENEMIES.find(e => e.id === enemyId && e.categoria === category && e.comportamiento === behaviorType && enemies.includes(e.id));
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
        ataque: selected.ataque,
        color: selected.color
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
          ataque: selected.ataque,
          color: selected.color
        }
      });
    };

  const onRemove = (uuid) => {
    removeEnemyByUUID(uuid);
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

  const categoryGlowMap = { /* ... */ };
  const categoryTextGlowMap = { /* ... */ };
  const borderColorMap = { /* ... */ };
  const textBgColorMap = { /* ... */ };

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

  const showToast = (enemyData) => { /* ... */ };

  if (!isLandscape) { /* ... (código de pantalla de rotación) ... */ }

  const rolesOnTop = ['defensor', 'lider', 'controlador'];
  const rolesOnBottom = ['apoyo', 'agresor'];

  // MODIFICACIÓN: Cálculo de la altura del slot.
  // Esta variable determina la altura de TODOS los slots basado en el que tenga más personajes.
  // Asegúrate de que los valores como 'h-[24rem]' sean los que deseas.
  const countsPerIndex = Array(11).fill(0).map((_, index) => {
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');
    return Math.max(heroesAbove.length + enemiesAbove.length, heroesBelow.length + enemiesBelow.length);
  });
  const maxCharactersInAnySlot = Math.max(0, ...countsPerIndex); // Añadido 0 para evitar -Infinity si countsPerIndex está vacío

  // MODIFICACIÓN: Lógica de altura del slot actualizada con más granularidad y usando valores arbitrarios de Tailwind
  // Ajusta estos valores de rem (o usa px) según necesites. 1rem = 16px por defecto.
  // h-[24rem] = 384px, h-[32rem] = 512px, h-[40rem] = 640px, h-[48rem] = 768px
  let slotHeightClass = 'h-[24rem]'; // Altura base para 0 o 1 personaje
  if (maxCharactersInAnySlot >= 5) {
      slotHeightClass = 'h-[48rem]';
  } else if (maxCharactersInAnySlot >= 4) {
      slotHeightClass = 'h-[40rem]';
  } else if (maxCharactersInAnySlot >= 3) {
      slotHeightClass = 'h-[36rem]'; // Ajustado
  } else if (maxCharactersInAnySlot >= 2) {
      slotHeightClass = 'h-[30rem]'; // Ajustado
  }


const CharacterCard = ({ name, image, position }) => ( /* ... (sin cambios) ... */ );

// MODIFICACIÓN COMPLETA: Componente EnemyCard
const EnemyCard = ({ name, comportamiento, categoria, image, position, uuid, color, onRemove, cardScale }) => {
  const effectiveScale = cardScale || 1; // Escala por defecto es 1 si no se proporciona

  // Valores de traslación para el hover.
  // Asumiendo que '5' y '15' se refieren a unidades de espaciado de Tailwind (0.25rem por unidad)
  const translateXValue = '1.25rem'; // 5 * 0.25rem
  const translateYValue = '3.75rem'; // 15 * 0.25rem
  // Si eran píxeles, usa '5px', '15px'

  // Z-index clases
  const baseZIndexClass = 'z-10'; // Z-index base
  const hoverZIndexClass = 'hover:z-50'; // Z-index alto para el hover (Tailwind usa hasta z-50 por defecto)
                                       // Podrías usar `hover:z-[100]` para un valor arbitrario más alto si es necesario.

  // Clases de transformación
  const baseTransformClass = `[transform:scale(${effectiveScale})]`;
  // Los guiones bajos (_) separan las funciones de transformación en valores arbitrarios de Tailwind
  const hoverTransformClass = `hover:[transform:translateX(${translateXValue})_translateY(${translateYValue})_scale(${effectiveScale}*1.1)]`; // Aumentar un poco la escala en hover también


  return (
    <div
      key={uuid}
      className={`
        flex flex-col items-center mx-1 relative
        transition-all duration-300 ease-in-out
        ${baseZIndexClass}
        ${hoverZIndexClass}
        ${baseTransformClass}
        ${hoverTransformClass}
      `}
      // 'origin-bottom' hace que la escala y la transformación se sientan ancladas a la base.
      // También puedes usar 'origin-center' si lo prefieres.
      style={{ transformOrigin: 'bottom' }}
    >
      <button
        // El z-index del botón es relativo a la EnemyCard (su padre posicionado)
        // z-20 aquí para asegurar que esté sobre la imagen si esta tuviera su propio contexto de apilamiento.
        className="absolute top-1 right-1 text-white bg-red-600 hover:bg-red-700 rounded-full w-5 h-5 text-xs flex items-center justify-center z-20"
        // Escalar el botón inversamente para que parezca mantener su tamaño, y ajustar su posición
        style={{
          transform: `scale(${1 / effectiveScale})`,
          top: `${(0.25 / effectiveScale).toFixed(2)}rem`, // Ajustar posición del botón con la escala
          right: `${(0.25 / effectiveScale).toFixed(2)}rem`
        }}
        onClick={() => onRemove(uuid)}
      >
        ×
      </button>
      <div className="relative w-full rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
        <img
          src={image}
          alt={name}
          className={`w-full object-cover rounded-lg border-2 ${borderColorMap[color] || 'border-transparent'}`}
        />
        <div
          className={`
            absolute bottom-0 left-1/2 transform -translate-x-1/2 px-1 py-0.5 border-2 rounded-lg text-white
            ${borderColorMap[color] || 'border-transparent'}
            ${textBgColorMap[color] || 'bg-black/60'}
            ${categoryTextGlowMap[categoria] || ''}
            enemy-text-wrapper w-full text-center  // Asegurar que el texto tenga ancho completo y esté centrado
          `}
          // Ajustar dinámicamente el tamaño de la fuente del texto si es necesario
          // Esta es una forma, podrías usar clases de Tailwind condicionales también
          style={{ fontSize: `${Math.max(0.45, 0.65 / Math.sqrt(effectiveScale)).toFixed(2)}rem` }}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="enemy-text leading-none">{name}</span>
            {comportamiento && (
              <span
                className="italic leading-none mt-0.5 opacity-90"
                style={{ fontSize: `${Math.max(0.4, 0.5 / Math.sqrt(effectiveScale)).toFixed(2)}rem` }}
              >
                {tb?.[comportamiento] || comportamiento}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const renderSlot = (index) => {
  const isRune = Object.values(runesColorMap).includes(index);
  const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
  const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
  const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
  const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');


  // MODIFICACIÓN: Función renderStack
  const renderStack = (items, isTop, isEnemy = false) => {
    const numItems = items.length;
    let spacing, cardScale;

    // Ajustar espaciado y escala según el número de elementos.
    // Necesitarás experimentar con estos valores.
    // 'spacing' es cuánto se desplaza cada carta para crear el efecto de solapamiento.
    // 'cardScale' es el factor de escala para cada carta.
    if (numItems <= 1) {
      spacing = 0; // Sin desplazamiento si solo hay uno
      cardScale = 0.9; // Escala base ligeramente más pequeña para estética
    } else if (numItems === 2) {
      spacing = 35; // Un valor en píxeles o una fracción de la altura de la carta
      cardScale = 0.8;
    } else if (numItems === 3) {
      spacing = 28;
      cardScale = 0.7;
    } else if (numItems === 4) {
      spacing = 22;
      cardScale = 0.6;
    } else { // 5 o más
      spacing = 18;
      cardScale = 0.55;
    }

    const reversed = isTop ? [...items].reverse() : items; // El primero en el array (último en renderizar visualmente abajo) debe tener zIndex mayor

    // console.log si lo necesitas para depurar
    // if (isEnemy && items.length > 0) {
    //   console.log(`Renderizando ${isTop ? 'arriba' : 'abajo'} para slot ${index}, ${items.length} enemigos. Escala: ${cardScale}, Spacing: ${spacing}`);
    // }

    return reversed.map((item, i) => {
      // El zIndex debe ser calculado para que las cartas más "al frente" (las primeras en el array `reversed` si `isTop`,
      // o las últimas si `!isTop`) tengan un z-index mayor.
      const zIndex = items.length - i; // Simple z-index: el primer item del array renderizado obtiene el z-index más alto.

      // El offset ahora debería considerar la escala si quieres un solapamiento visualmente proporcional.
      // O un valor fijo si prefieres. Aquí un offset simple.
      const offset = i * spacing;
      const style = isTop ? { bottom: `${offset}px`, zIndex } : { top: `${offset}px`, zIndex };

      return (
        // Este div es el que se posiciona absolutamente y controla el z-index del stack
        <div key={isEnemy ? item.enemy.uuid : item.id} className="absolute w-full flex justify-center" style={style}>
          {/* Este div interno puede ayudar a controlar el ancho máximo de la carta si es necesario */}
          <div className="w-10/12 sm:w-9/12 md:w-8/12 lg:w-7/12"> {/* Ajusta el ancho de la carta */}
            {isEnemy ? (
              <EnemyCard
                uuid={item.enemy.uuid}
                name={getEnemyName(item.enemy.id)}
                image={item.enemy.imagen}
                comportamiento={item.enemy.comportamiento}
                categoria={item.enemy.categoria}
                position={isTop ? "top" : "bottom"} // Esta prop 'position' no parece usarse dentro de EnemyCard, puedes quitarla si no es necesaria
                color={item.enemy.color}
                onRemove={onRemove}
                cardScale={cardScale} // MODIFICACIÓN: Pasar la escala a la carta
              />
            ) : (
              <CharacterCard
                name={getHeroName(item.id)}
                image={item.image}
                position={isTop ? "top" : "bottom"} // Similar a EnemyCard, verifica si esta prop 'position' se usa
                // Podrías pasar cardScale a CharacterCard también si quieres un comportamiento similar
              />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    // MODIFICACIÓN: Aplicar la altura dinámica del slot aquí
    <div key={index} className={`flex flex-col w-full ${slotHeightClass} py-2 border-x border-gray-600 first:border-l-transparent last:border-r-transparent`}>

      {/* Escalonado arriba */}
      {/* Ajustar la altura de estos contenedores (h-1/2) si es necesario para dar espacio a las cartas solapadas */}
      <div className="relative flex justify-center h-1/2 w-full mb-1"> {/* o usa una altura fija/min-height */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          {renderStack(heroesAbove, true)}
          {isRune && renderStack(enemiesAbove, true, true)}
        </div>
      </div>

      {/* Centro del slot */}
      <div className="flex items-center justify-center h-8 shrink-0 bg-gray-500/50"> {/* bg-gray-300 */}
        <div className={classNames(
          'flex items-center justify-center font-fantasy',
          { /* ... (clases de gemas sin cambios) ... */ }
        )}>
          <span /* ... (texto del slot sin cambios) ... */ >
            {/* ... */}
          </span>
        </div>
      </div>

      {/* Escalonado abajo */}
      <div className="relative flex justify-center h-1/2 w-full mt-1"> {/* o usa una altura fija/min-height */}
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
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
          {/* Contenedor de la cuadrícula de slots */}
          <div className="grid grid-cols-11 gap-0 bg-slate-800/70 rounded-lg shadow-xl overflow-hidden"> {/* auto-rows-auto eliminado, la altura la da slotHeightClass */}
            {[...Array(11)].map((_, idx) => renderSlot(idx))}
          </div>

          {/* ... (Modales y botones inferiores sin cambios significativos) ... */}
          {categorySelector.open && ( /* ... */ )}
          {manualSelector.open && ( /* ... */ )}
          <div className="mt-8 flex justify-center gap-4"> {/* ... */ }</div>
        </div>
      </div>
      <ToastContainer toastClassName="toast-expand" bodyClassName="" />
    </PageTransition>
  );
};

export default InitTracker;

