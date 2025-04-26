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

const rolesPositionMap = { defensor:0, apoyo:2, lider:4, agresor:6, controlador:8 };
const runesColorMap   = { naranja:1, verde:3, azul:5, rojo:7, gris:9 };
const turnOrderKeys   = [
  'defensor',
  'runa:naranja:arriba',
  'runa:verde:arriba',
  'lider',
  'runa:azul:arriba',
  'runa:rojo:arriba',
  'controlador',
  'runa:gris:arriba',
  'runa:naranja:abajo',
  'apoyo',
  'runa:verde:abajo',
  'runa:azul:abajo',
  'agresor',
  'runa:rojo:abajo',
  'runa:gris:abajo',
  'runa:gris:abajo' // o 'runa abajo'?
];

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [turnIndex, setTurnIndex] = useState(0);
  const [characters, setCharacters] = useState([]);
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const te = translations.enemies || {};

  // Prepara el array de participantes en orden
  useEffect(() => {
    const list = [];
    // Para cada key...
    turnOrderKeys.forEach(key => {
      if (key.startsWith('runa:')) {
        // formato "runa:color:pos"
        const [, color, pos] = key.split(':');
        // busca enemigos con ese rune y posición
        trackerData.enemies
          .filter(e => e.rune === color && e.runePosition === pos)
          .forEach(e => list.push({ 
            type: 'enemy', 
            id: e.id, 
            name: te[e.id] || e.id, 
            life: e.life ?? 0 
          }));
      } else {
        // es rol
        trackerData.placedHeroes
          .filter(h => h.role === key)
          .forEach(h => list.push({
            type: 'hero',
            id: h.id,
            name: translations.heroes[h.id] || h.id,
            life: h.life ?? 0
          }));
      }
    });
    setCharacters(list);
  }, [trackerData]);

  const adjustLife = (id, delta) => {
    setCharacters(chars =>
      chars.map(c =>
        c.id === id ? { ...c, life: Math.max(0, c.life + delta) } : c
      )
    );
  };

  return (
    <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* ——— Tu TopMenu y barra existente ——— */}
      <TopMenu /* ...props */ />

      {/* grid de slots */}
      <div className="grid grid-cols-11 gap-0">
        {[...Array(11)].map((_,idx)=>renderSlot(idx))}
      </div>

      {/* ——— Nueva sección de control de turno ——— */}
      <div className="mt-8 bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl text-white mb-4">Turno {turnIndex+1} de {characters.length}</h2>
        <div className="flex space-x-2 overflow-x-auto">
          {characters.map((c,i) => (
            <div
              key={`${c.type}-${c.id}-${i}`}
              className={classNames(
                'flex-shrink-0 w-32 p-2 bg-gray-700 rounded-lg text-center',
                i === turnIndex && 'ring-4 ring-yellow-400'
              )}
            >
              <img
                src={ c.type==='hero'
                  ? HEROES.find(h=>h.id===c.id)?.image
                  : ENEMIES.find(e=>e.id===c.id)?.imagen }
                alt={c.name}
                className="w-12 h-12 mx-auto rounded-full mb-2"
              />
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs mb-2">Vida: {c.life}</div>
              <div className="flex justify-center space-x-1">
                <button
                  onClick={()=>adjustLife(c.id,-1)}
                  className="px-1 bg-red-600 rounded text-sm">➖</button>
                <button
                  onClick={()=>adjustLife(c.id, +1)}
                  className="px-1 bg-green-600 rounded text-sm">➕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={()=>setTurnIndex((ti)=> (ti-1+characters.length)%characters.length)}
            className="px-4 py-1 bg-yellow-500 rounded">Anterior</button>
          <button
            onClick={()=>setTurnIndex((ti)=> (ti+1)%characters.length)}
            className="px-4 py-1 bg-yellow-500 rounded">Siguiente</button>
        </div>
      </div>

      {/* ——— Botones de navegación ——— */}
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={()=>navigate('/')}       className="bg-yellow-500 ...">Ir al inicio</button>
        <button onClick={()=>navigate('/tracker')}className="bg-gray-700 ...">Volver</button>
      </div>
    </div>
  );
};

export default InitTracker;
