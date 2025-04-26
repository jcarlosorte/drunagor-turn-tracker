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

export default function InitTracker() {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};

  // ---- Estado para control de turnos ----
  const [currentStep, setCurrentStep] = useState(0);

  // ---- Montaje inicial de héroes ----
  useEffect(() => {
    const initialHeroes = trackerData.heroes.map(id => {
      const role = trackerData.roles[id];
      const image = HEROES.find(h => h.id === id)?.image;
      return { id, role, image };
    });
    setTrackerData(prev => ({ ...prev, placedHeroes: initialHeroes }));
  }, []);

  // ---- Generar la secuencia completa de turnos ----
  const buildSequence = () => {
    const seq = [];

    // 1) Defensor
    trackerData.placedHeroes
      .filter(h => h.role === 'defensor')
      .forEach(h => seq.push({ kind: 'hero', ...h }));

    // 2) Enemigos runa arriba, por color
    ['naranja','verde','azul','rojo','gris'].forEach(color => {
      trackerData.enemies
        .filter(e => e.rune === color && e.runePosition === 'arriba')
        .forEach(e => {
          const meta = ENEMIES.find(x=>x.id===e.id);
          seq.push({ kind: 'enemy', ...e, image: meta.imagen, vida: meta.vida, tipo: meta.categoria });
        });
    });

    // 3) Líder
    trackerData.placedHeroes
      .filter(h => h.role === 'lider')
      .forEach(h => seq.push({ kind: 'hero', ...h }));

    // 4) Enemigos runa abajo, por color
    ['naranja','verde','azul','rojo','gris'].forEach(color => {
      trackerData.enemies
        .filter(e => e.rune === color && e.runePosition === 'abajo')
        .forEach(e => {
          const meta = ENEMIES.find(x=>x.id===e.id);
          seq.push({ kind: 'enemy', ...e, image: meta.imagen, vida: meta.vida, tipo: meta.categoria });
        });
    });

    // 5) Apoyo y Agresor
    ['apoyo','agresor'].forEach(role => {
      trackerData.placedHeroes
        .filter(h => h.role === role)
        .forEach(h => seq.push({ kind: 'hero', ...h }));
    });

    return seq;
  };

  const sequence = buildSequence();
  const totalSteps = sequence.length;

  const advance = () => setCurrentStep((s) => (s + 1) % totalSteps);
  const retreat = () => setCurrentStep((s) => (s - 1 + totalSteps) % totalSteps);

  const changeVida = (idx, delta) => {
    const item = sequence[idx];
    if (item.kind === 'enemy') {
      // actualizar vida en trackerData.enemies
      setTrackerData(prev => ({
        ...prev,
        enemies: prev.enemies.map(e =>
          e.id === item.id && e.runePosition===item.runePosition
            ? { ...e, vida: Math.max(0, (e.vida||0) + delta) }
            : e
        )
      }));
    } else {
      // héroes: si guardas vida en placedHeroes
      setTrackerData(prev => ({
        ...prev,
        placedHeroes: prev.placedHeroes.map(h =>
          h.id === item.id
            ? { ...h, vida: Math.max(0, (h.vida||0) + delta) }
            : h
        )
      }));
    }
  };

  return (
    <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <TopMenu
        onAddEnemy={() => {}}
        onSelectBoss={() => {}}
        onSelectOther={() => {}}
        onAddManual={() => {}}
      />

      {/* ---- Tu barra central existente ---- */}
      {/* ... aquí tu grid de 11 slots ... */}

      {/* ---- Nueva sección: Control de Turno ---- */}
      <div className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4">
        <h2 className="text-xl text-yellow-300 mb-4">{ti.title || 'Turnos'}</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={retreat}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
          >◀️</button>
          <span className="flex-1 text-center text-lg">
            Turno {currentStep + 1} / {totalSteps}
          </span>
          <button
            onClick={advance}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm"
          >▶️</button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
          {sequence.map((ent, idx) => (
            <div
              key={`${ent.kind}-${ent.id}-${ent.runePosition||''}-${idx}`}
              className={classNames(
                "p-2 rounded-lg bg-gray-700 bg-opacity-70 flex flex-col items-center",
                { "ring-4 ring-yellow-400": idx === currentStep }
              )}
            >
              <img
                src={ent.image}
                alt={ent.id}
                className="w-12 h-12 rounded-full mb-1 border border-white"
              />
              <span className="text-sm text-white font-semibold">
                {ent.kind === 'hero'
                  ? translations.heroes?.[ent.id] || ent.id
                  : translations.enemies?.[ent.id] || ent.id}
              </span>
              <span className="text-xs text-gray-300">{ent.kind === 'hero' ? 'Héroe' : ent.tipo}</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => changeVida(idx, -1)}
                  className="px-1 bg-red-600 rounded text-xs"
                >–</button>
                <span className="text-sm">
                  {ent.vida ?? (ent.kind==='hero'? trackerData.placedHeroes.find(h=>h.id===ent.id)?.vida : trackerData.enemies.find(e=>e.id===ent.id && e.runePosition===ent.runePosition)?.vida) || 0}
                </span>
                <button
                  onClick={() => changeVida(idx, +1)}
                  className="px-1 bg-green-600 rounded text-xs"
                >+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Botones finales ---- */}
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow">
          {ti.goHome || 'Ir al inicio'}
        </button>
        <button onClick={() => navigate('/tracker')} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow">
          {ti.backToConfig || 'Volver a configuración'}
        </button>
      </div>
    </div>
  );
};


export default InitTracker;
