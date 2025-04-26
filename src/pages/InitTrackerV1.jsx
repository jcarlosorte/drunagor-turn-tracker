// src/pages/InitTracker.jsx
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
  naranja: 1,
  verde: 3,
  azul: 5,
  rojo: 7,
  gris: 9
};

const rolesOnTop = ['defensor', 'lider', 'controlador'];
const rolesOnBottom = ['apoyo', 'agresor'];

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { language, translations } = useLanguage();
  const navigate = useNavigate();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const tc = translations.enemies?.categoria || {};

  const [categorySelector, setCategorySelector] = useState({ open: false, color: null });
  const [turnIndex, setTurnIndex] = useState(0);
  const [lifeState, setLifeState] = useState({}); // Control de vidas locales

  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id) => translations.enemies?.[id] || id;
  const getRoleName = (id) => translations.roles?.[id] || id;

  const openCategorySelector = (color) => {
    setCategorySelector({ open: true, color });
  };

  const handleCategorySelect = (categoryKey) => {
    const color = categorySelector.color;
    setCategorySelector({ open: false, color: null });

    const filtered = ENEMIES.filter(e => e.color === color && e.categoria === categoryKey);
    
    if (filtered.length === 0) return;
    
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition || 'arriba';
    
    const newEnemy = { 
      id: selected.id, 
      rune: selected.rune, 
      position: runeIndex, 
      runePosition,
      imagen: selected.imagen
    };
    
    setTrackerData(prev => ({
      ...prev,
      enemies: [...prev.enemies, newEnemy]
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

    // Inicializar vida
    const initialLife = {};
    trackerData.heroes.forEach(id => {
      const hero = HEROES.find(h => h.id === id);
      if (hero) initialLife[id] = hero.life || 10;
    });
    trackerData.enemies.forEach((e, i) => {
      initialLife[e.id + '-' + i] = ENEMIES.find(en => en.id === e.id)?.vida || 5;
    });
    setLifeState(initialLife);

  }, []);

  const rolesOnTop = ['defensor', 'lider', 'controlador'];
  const rolesOnBottom = ['apoyo', 'agresor'];

  const countsPerIndex = Array(11).fill(0).map((_, index) => {
    const heroesAbove = (trackerData.placedHeroes || []).filter(
      h => h.position === index && rolesOnTop.includes(h.role)
    );
    const heroesBelow = (trackerData.placedHeroes || []).filter(
      h => h.position === index && rolesOnBottom.includes(h.role)
    );

    const enemiesAbove = (trackerData.enemies || []).filter(
      e => runesColorMap[e.rune] === index && e.runePosition === 'arriba'
    );
    const enemiesBelow = (trackerData.enemies || []).filter(
      e => runesColorMap[e.rune] === index && e.runePosition === 'abajo'
    );

    return Math.max(
      heroesAbove.length + enemiesAbove.length,
      heroesBelow.length + enemiesBelow.length
    );
  });

  const maxCharactersInAnySlot = Math.max(...countsPerIndex);

  let dynamicHeight = 'h-192';
  if (maxCharactersInAnySlot >= 5) {
    dynamicHeight = 'h-512';
  } else if (maxCharactersInAnySlot >= 3) {
    dynamicHeight = 'h-192';
  }

  const renderSlot = (index) => {
    const isRune = Object.values(runesColorMap).includes(index);
    
    const heroesAbove = (trackerData.placedHeroes || []).filter(
      h => h.position === index && rolesOnTop.includes(h.role)
    );
    const heroesBelow = (trackerData.placedHeroes || []).filter(
      h => h.position === index && rolesOnBottom.includes(h.role)
    );
    
    const enemiesAbove = (trackerData.enemies || []).filter(
      e => runesColorMap[e.rune] === index && e.runePosition === 'arriba'
    );
    const enemiesBelow = (trackerData.enemies || []).filter(
      e => runesColorMap[e.rune] === index && e.runePosition === 'abajo'
    );

    return (
      <div key={index} className={`flex flex-col w-full ${dynamicHeight} py-2`}>
        {/* Superior */}
        <div className="flex items-end justify-center gap-1 flex-wrap overflow-y-auto h-52">
          {heroesAbove.map(h => (
            <CharacterCard key={h.id} name={getHeroName(h.id)} image={h.image} />
          ))}
          {isRune && enemiesAbove.map((e, i) => (
            <CharacterCard key={e.id + '-' + i} name={getEnemyName(e.id)} image={e.imagen} />
          ))}
        </div>

        {/* Barra */}
        <div className="flex items-center justify-center h-8 bg-gray-300">
          <div
            className={classNames(
              'flex items-center justify-center font-fantasy',
              {
                'w-12 h-12 rotate-45 bg-orange-500': index === 1,
                'w-12 h-12 rotate-45 bg-green-500': index === 3,
                'w-12 h-12 rotate-45 bg-blue-500': index === 5,
                'w-12 h-12 rotate-45 bg-red-500': index === 7,
                'w-12 h-12 rotate-45 bg-gray-500': index === 9,
                'w-full h-10 bg-gray-300 text-black text-center': index % 2 === 0
              }
            )}
          >
            <span className={classNames({'rotate-[315deg]': index % 2 !== 0})}>
              {index === 0 && tr.defensor ||
               index === 2 && tr.apoyo ||
               index === 4 && tr.lider ||
               index === 6 && tr.agresor ||
               index === 8 && tr.controlador ||
               index === 10 && ti.rune}
            </span>
          </div>
        </div>

        {/* Inferior */}
        <div className="flex items-start justify-center gap-1 flex-wrap overflow-y-auto h-52">
          {heroesBelow.map(h => (
            <CharacterCard key={h.id} name={getHeroName(h.id)} image={h.image} />
          ))}
          {isRune && enemiesBelow.map((e, i) => (
            <CharacterCard key={e.id + '-' + i + '-b'} name={getEnemyName(e.id)} image={e.imagen} />
          ))}
        </div>
      </div>
    );
  };

  const CharacterCard = ({ name, image }) => (
    <div className="flex flex-col items-center mx-1">
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg border-2 border-yellow-400" />
      <div className="text-xs mt-1">{name}</div>
    </div>
  );

  // 👉 Nueva sección de control de turnos
  const fullTurnOrder = [
    ...trackerData.placedHeroes.filter(h => h.role === 'defensor'),
    ...trackerData.enemies.filter(e => e.rune === 'naranja' && e.runePosition === 'arriba'),
    ...trackerData.enemies.filter(e => e.rune === 'verde' && e.runePosition === 'arriba'),
    ...trackerData.placedHeroes.filter(h => h.role === 'lider'),
    ...trackerData.enemies.filter(e => e.rune === 'azul' && e.runePosition === 'arriba'),
    ...trackerData.enemies.filter(e => e.rune === 'rojo' && e.runePosition === 'arriba'),
    ...trackerData.placedHeroes.filter(h => h.role === 'controlador'),
    ...trackerData.enemies.filter(e => e.rune === 'gris' && e.runePosition === 'arriba'),
    ...trackerData.enemies.filter(e => e.rune === 'naranja' && e.runePosition === 'abajo'),
    ...trackerData.placedHeroes.filter(h => h.role === 'apoyo'),
    ...trackerData.enemies.filter(e => e.rune === 'verde' && e.runePosition === 'abajo'),
    ...trackerData.enemies.filter(e => e.rune === 'azul' && e.runePosition === 'abajo'),
    ...trackerData.placedHeroes.filter(h => h.role === 'agresor'),
    ...trackerData.enemies.filter(e => e.rune === 'rojo' && e.runePosition === 'abajo'),
    ...trackerData.enemies.filter(e => e.rune === 'gris' && e.runePosition === 'abajo')
  ];

  const handleLifeChange = (id, amount) => {
    setLifeState(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + amount)
    }));
  };

  return (
    <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <div className="no-header" />
      <h1 className="text-3xl font-bold text-yellow-300 font-fantasy mb-6">{ti.title || 'Inicio del Tracker'}</h1>

      <TopMenu
        onAddEnemy={openCategorySelector}
        onSelectBoss={handleSelectBoss}
        onSelectOther={handleSelectOther}
        onAddManual={handleAddManual}
      />

      <div className="grid grid-cols-11 gap-0 auto-rows-auto">
        {[...Array(11)].map((_, idx) => renderSlot(idx))}
      </div>

      {/* 🔥 Nueva Sección Turno */}
      <div className="mt-10">
        <h2 className="text-2xl mb-4">{ti.turnOrder || 'Orden de Turno'}</h2>
        <div className="flex flex-col gap-2">
          {fullTurnOrder.map((p, idx) => {
            const id = p.id + (p.rune ? '-' + idx : '');
            const isHero = p.role;
            const name = isHero ? getHeroName(p.id) : getEnemyName(p.id);
            const image = isHero ? HEROES.find(h => h.id === p.id)?.image : p.imagen;
            const type = isHero ? 'Héroe' : 'Enemigo';
            const life = lifeState[id] ?? 0;
            return (
              <div
                key={id}
                className={classNames("flex items-center gap-4 p-2 rounded shadow",
                  { "bg-yellow-500 text-black": idx === turnIndex, "bg-gray-800": idx !== turnIndex })}
              >
                <img src={image} alt={name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-lg font-bold">{name}</div>
                  <div className="text-sm">{type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLifeChange(id, -1)} className="bg-red-500 px-2 rounded">-</button>
                  <span>{life} ❤️</span>
                  <button onClick={() => handleLifeChange(id, 1)} className="bg-green-500 px-2 rounded">+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botones Turno */}
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={() => setTurnIndex(i => Math.max(0, i - 1))}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            {ti.previous || 'Anterior'}
          </button>
          <button
            onClick={() => setTurnIndex(i => Math.min(fullTurnOrder.length - 1, i + 1))}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded"
          >
            {ti.next || 'Siguiente'}
          </button>
        </div>
      </div>

      {/* 🔽 Navegación Final */}
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded">
          {ti.goHome || 'Ir al inicio'}
        </button>
        <button onClick={() => navigate('/tracker')} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded">
          {ti.backToConfig || 'Volver a configuración'}
        </button>
      </div>
    </div>
  );
};

export default InitTracker;

