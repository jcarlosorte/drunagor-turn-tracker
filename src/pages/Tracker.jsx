import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { COLORS } from '@/data/color';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);
  const { selectedExpansions } = useExpansions();
  const { language, translations } = useLanguage();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();

  const fullSelectedExpansions = EXPANSIONS.filter(exp => selectedExpansions.includes(exp.id));
  const heroIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.heroes);
  const enemyIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.enemies);
  const heroesInSelectedExpansions = HEROES.filter(h => heroIdsInSelectedExpansions.includes(h.id));
  const enemiesInSelectedExpansions = ENEMIES.filter(
    e => enemyIdsInSelectedExpansions.includes(e.id) && e.color !== "jefe"
  );
  
  // Preseleccionar todos los enemigos al cargar
  useEffect(() => {
    setSelectedEnemies(enemyIdsInSelectedExpansions.filter(id => {
      const enemy = ENEMIES.find(e => e.id === id);
      return enemy?.color !== "jefe";
    }));
  }, [enemyIdsInSelectedExpansions.join(',')]);

  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;
 
  const handleRoleSelect = (heroId, roleId) => {
    // Asignar el rol al héroe
    setHeroRoles(prev => ({
      ...prev,
      [heroId]: roleId,  // Asigna el rol al héroe seleccionado
    }));
  };
  
  const handleHeroSelect = heroId => {
    setHeroRoles(prev => {
      const roles = { ...prev };
      if (roles[heroId]) delete roles[heroId];
      return roles;
    });
    setSelectedHeroes(prev =>
      prev.includes(heroId)
        ? prev.filter(id => id !== heroId)
        : prev.length < 5
        ? [...prev, heroId]
        : prev
    );
    if (selectedHeroes.length >= 5 && !selectedHeroes.includes(heroId)) {
      alert(t.maxHeroes || 'Máx heroes');
    }
  };
  
  const handleEnemySelect = (enemyId) => {
    setSelectedEnemies(prev =>
      prev.includes(enemyId)
        ? prev.filter(id => id !== enemyId)
        : [...prev, enemyId]
    );
  };

  const handleRandomEnemySelect = (color) => {
    const matching = enemiesInSelectedExpansions.filter(e => e.color === color);
    if (matching.length > 0) {
      const randomEnemy = matching[Math.floor(Math.random() * matching.length)];
      handleEnemySelect(randomEnemy.id);
    }
  };

  const handleConfirm = () => {
    console.log('Confirmado:', {
      heroes: selectedHeroes,
      roles: heroRoles,
      enemies: selectedEnemies
    });
    // Navegar a siguiente pantalla o actualizar estado global si se desea
  };

  const handleBack = () => {
    navigate("/", { replace: true }); // o solo navigate("/") si no quieres reemplazo en el historial
  };

  const assignRole = (heroId, roleId) => {
  if (!roleId) return; // Evitar asignar rol vacío
  if (Object.values(heroRoles).includes(roleId)) {
    alert(t.roleAlreadyAssigned || 'Este rol ya está asignado a otro héroe');
    return;
  }
  setHeroRoles({ ...heroRoles, [heroId]: roleId });
};
  
  return (
    <div className="p-4 space-y-8 text-gray-900">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      {/* Selección de héroes */}
      <div className="border rounded-xl p-4 bg-gray-100 shadow">
        <h2 className="text-xl font-semibold mb-4">{t.selectHeroes}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {heroesInSelectedExpansions.map(hero => (
            <label
              key={hero.id}
              className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${{
                true: 'bg-blue-200 border border-blue-500',
                false: 'bg-white hover:bg-gray-200'
              }[selectedHeroes.includes(hero.id)]}`}
            >
              <input
                type="checkbox"
                checked={selectedHeroes.includes(hero.id)}
                onChange={() => handleHeroSelect(hero.id)}
                disabled={!selectedHeroes.includes(hero.id) && selectedHeroes.length >= 5}
              />
              {hero.image && (
                <img src={hero.image} alt={getHeroName(hero.id)} className="w-10 h-10 object-contain rounded" />
              )}
              <span>{getHeroName(hero.id)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Asignación de roles */}
      {selectedHeroes.length > 0 && (
        <div className="border p-4 rounded-xl bg-gray-100 shadow">
          <h3 className="text-lg font-semibold mb-2">{t.assignRoles}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find((h) => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center gap-2">
                  <img
                    src={heroData.image}
                    alt={getHeroName(heroId)}
                    className="w-24 h-24 object-contain"
                  />
                  <span className="font-semibold">{getHeroName(heroId)}</span>
                  {heroRoles[heroId] ? (
                    <span> - {heroRoles[heroId]}</span>
                  ) : (
                    <span> - <em>Elige rol</em></span>
                  )}
                  <select
                    value={heroRoles[heroId] || ""}
                    onChange={(e) => handleRoleSelect(heroId, e.target.value)}
                    //onChange={(e) => assignRole(heroId, e.target.value)}
                    className="mt-2 border rounded-md p-2"
                  >
                    <option value="" disabled>Elige rol</option>
                    <option value="">{t.selectRole}</option>
                    {ROLES.filter(role => !usedRoles.includes(role.id)).map(role => (
                      <option key={role.id} value={role.id}>
                        {getRoleName(role.id)} {/* Aquí obtenemos el nombre del rol con la traducción */}
                      </option>
                      ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

      )}

      {/* Enemigos agrupados por color */}
      <div className="border rounded-xl p-4 bg-gray-100 shadow space-y-6">
        <h2 className="text-xl font-semibold">{t.selectEnemies}</h2>
        {COLORS.map(color => {
          const enemiesOfColor = enemiesInSelectedExpansions.filter(e => e.color === color.id);
          if (enemiesOfColor.length === 0) return null;
          return (
            <div key={color.id}>
              <h3 className="text-lg font-semibold mb-2">{t.colors?.[color.id] || color.id}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {enemiesOfColor.map(enemy => (
                  <label key={enemy.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedEnemies.includes(enemy.id)}
                      onChange={() => handleEnemySelect(enemy.id)}
                    />
                    {enemy.imagen && (
                      <img src={enemy.imagen} alt={getEnemyName(enemy.id)} className="w-12 h-12 object-contain" />
                    )}
                    <span>{getEnemyName(enemy.id)}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => handleRandomEnemySelect(color.id)}
                className={`mt-2 px-3 py-1 rounded bg-${color.id}-600 text-white hover:bg-${color.id}-700`}
              >
                {t.selectRandomEnemyForColor?.replace('{color}', t.colors?.[color.id] || color.id)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="bg-gray-100 rounded p-4 border shadow">
        <h2 className="text-lg font-semibold">{t.summary}</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {selectedHeroes.map(id => (
            <span key={id} className="bg-white px-2 py-1 rounded">
              {getHeroName(id)}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {selectedEnemies.map(id => (
            <span key={id} className="bg-white px-2 py-1 rounded">
              {getEnemyName(id)}
            </span>
          ))}
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
         ← {t.back || 'Volver'}
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t.confirm || 'Confirmar'}
        </button>
      </div>
    </div>
  );
};

export default TrackerSelect;
