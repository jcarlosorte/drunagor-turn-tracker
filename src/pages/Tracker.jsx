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
  const enemiesInSelectedExpansions = ENEMIES.filter(e => enemyIdsInSelectedExpansions.includes(e.id));

  // Preseleccionar todos los enemigos al cargar
  useEffect(() => {
    setSelectedEnemies(enemyIdsInSelectedExpansions);
  }, [enemyIdsInSelectedExpansions.join(',')]);

  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;

  const handleHeroSelect = (heroId) => {
    if (selectedHeroes.includes(heroId)) {
      setSelectedHeroes(selectedHeroes.filter(id => id !== heroId));
      const updatedRoles = { ...heroRoles };
      delete updatedRoles[heroId];
      setHeroRoles(updatedRoles);
    } else if (selectedHeroes.length < 5) {
      setSelectedHeroes([...selectedHeroes, heroId]);
      setHeroRoles({ ...heroRoles, [heroId]: 'none' });
    } else {
      alert(t.maxHeroes || 'Puedes seleccionar hasta 5 héroes');
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
              className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${
                selectedHeroes.includes(hero.id)
                  ? 'bg-blue-200 border border-blue-500'
                  : 'bg-white hover:bg-gray-200'
              }`}
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
          <div className="space-y-2">
            {selectedHeroes.map((hero) => {
            const heroData = heroes.find((h) => h.id === hero.id);
            return (
              <div key={hero.id} className="flex items-center gap-2">
                <img src={heroData.image} alt={t(`heroes.${hero.id}`)} className="w-10 h-10 object-contain" />
                <span className="font-semibold">{t(`heroes.${hero.id}`)}</span>
                <select
                  value={hero.role || ""}
                  onChange={(e) => assignRole(hero.id, e.target.value)}
                  className="ml-2"
                >
                  <option value="">{t("tracker.selectRole")}</option>
                  {dungeonRoles
                    .filter((role) => !selectedHeroes.some((h) => h.role === role && h.id !== hero.id))
                    .map((role) => (
                      <option key={role} value={role}>
                        {t(`roles.${role}`)}
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
                    {enemy.image && (
                      <img src={enemy.image} alt={getEnemyName(enemy.id)} className="w-12 h-12 object-contain" />
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
        <p>{t.selectedHeroes}: {selectedHeroes.map(getHeroName).join(', ')}</p>
        <p>{t.selectedEnemies}: {selectedEnemies.map(getEnemyName).join(', ')}</p>
      </div>

      {/* Botones finales */}
      <div className="flex justify-between">
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
