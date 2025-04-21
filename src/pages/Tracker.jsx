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
  const { selectedExpansions } = useExpansions();
  const { language, translations } = useLanguage();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();

  const fullSelectedExpansions = EXPANSIONS.filter(exp => selectedExpansions.includes(exp.id));
  const heroIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.heroes);
  const enemyIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.enemies);
  const heroesInSelectedExpansions = HEROES.filter(h => heroIdsInSelectedExpansions.includes(h.id));
  const enemiesInSelectedExpansions = ENEMIES.filter(e => enemyIdsInSelectedExpansions.includes(e.id) && e.color !== "jefe");

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
    setHeroRoles(prev => ({ ...prev, [heroId]: roleId }));
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
      alert(t.maxHeroes || 'Máximo 5 héroes');
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
    const matching = enemiesInSelectedExpansions.filter(e => e.color === color && !selectedEnemies.includes(e.id));
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
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  const RuneTitle = ({ children }) => (
    <div className="relative text-center my-6">
      <div className="inline-block px-8 py-3 border-4 border-yellow-700 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl shadow-xl font-fantasy">
        <span className="text-4xl font-extrabold text-yellow-900 tracking-wider">
          {children}
        </span>
        <span className="absolute -top-3 -left-3 w-5 h-5 bg-yellow-800 rounded-full shadow-md" />
        <span className="absolute -top-3 -right-3 w-5 h-5 bg-yellow-800 rounded-full shadow-md" />
        <span className="absolute -bottom-3 -left-3 w-5 h-5 bg-yellow-800 rounded-full shadow-md" />
        <span className="absolute -bottom-3 -right-3 w-5 h-5 bg-yellow-800 rounded-full shadow-md" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-10 text-gray-900 font-fantasy">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
          .font-fantasy { font-family: 'MedievalSharp', cursive; }
        `}
      </style>

      <h1 className="text-3xl font-bold text-center">{t.title}</h1>

      {/* HEROES */}
      <div className="border border-yellow-900 rounded-xl p-4 bg-yellow-50/90 shadow-lg">
        <RuneTitle>{t.selectHeroes}</RuneTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
          {heroesInSelectedExpansions.map((hero) => {
            const isSelected = selectedHeroes.includes(hero.id);
            return (
              <label
                key={hero.id}
                className={`cursor-pointer border-4 rounded-lg p-3 flex flex-col items-center text-center transition
                  ${isSelected ? 'border-green-700 bg-green-100/80 shadow-2xl' : 'border-gray-400 bg-white/70 hover:bg-gray-100'}
                  font-fantasy`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleHeroSelect(hero.id)}
                  disabled={!isSelected && selectedHeroes.length >= 5}
                  className="hidden"
                />
                {hero.image && (
                  <img
                    src={hero.image}
                    alt={getHeroName(hero.id)}
                    className="w-16 h-16 object-contain mb-2 border border-gray-700 rounded-lg shadow-md"
                  />
                )}
                <span className="text-md font-bold">{getHeroName(hero.id)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ROLES */}
      {selectedHeroes.length > 0 && (
        <div className="border border-blue-900 rounded-xl p-4 bg-blue-100/60 shadow-lg">
          <RuneTitle>{t.assignRoles}</RuneTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find(h => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center p-4 bg-white rounded-xl border-4 border-blue-600 shadow-md font-fantasy">
                  <img
                    src={heroData.image}
                    alt={getHeroName(heroId)}
                    className="w-20 h-20 object-contain border rounded"
                  />
                  <span className="mt-2 font-bold">{getHeroName(heroId)}</span>
                  <span className="italic text-sm">
                    {heroRoles[heroId]
                      ? `- ${getRoleName(heroRoles[heroId])} -`
                      : '- Elige rol -'}
                  </span>
                  <select
                    value={heroRoles[heroId] || ""}
                    onChange={(e) => handleRoleSelect(heroId, e.target.value)}
                    className="mt-2 border rounded-md p-2 w-full bg-blue-50 text-blue-900"
                  >
                    <option value="">Elige rol</option>
                    {ROLES.filter(role => !usedRoles.includes(role.id)).map(role => (
                      <option key={role.id} value={role.id}>
                        {getRoleName(role.id)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ENEMIGOS */}
      <div className="border border-red-800 rounded-xl p-4 bg-red-100/80 shadow-lg">
        <RuneTitle>{t.selectEnemies}</RuneTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
          {enemiesInSelectedExpansions.map((enemy) => {
            const isSelected = selectedEnemies.includes(enemy.id);
            return (
              <label
                key={enemy.id}
                className={`cursor-pointer border-4 rounded-xl p-3 flex flex-col items-center text-center transition
                  ${isSelected ? 'border-red-700 bg-red-200/80 shadow-xl' : 'border-gray-400 bg-white/70 hover:bg-gray-100'}
                  font-fantasy`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleEnemySelect(enemy.id)}
                  className="hidden"
                />
                {enemy.image && (
                  <img
                    src={enemy.image}
                    alt={getEnemyName(enemy.id)}
                    className="w-16 h-16 object-contain mb-2 border border-gray-700 rounded-lg"
                  />
                )}
                <span className="text-md font-bold">{getEnemyName(enemy.id)}</span>
              </label>
            );
          })}
        </div>
        {/* Botones por color */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => handleRandomEnemySelect(color)}
              className={`px-4 py-2 rounded-md text-white font-bold shadow font-fantasy
                ${color === 'rojo' ? 'bg-red-600' : color === 'azul' ? 'bg-blue-600' : color === 'verde' ? 'bg-green-600' : 'bg-gray-600'}
              `}
            >
              {t.randomColor?.[color] || color}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-gray-700 text-white shadow font-fantasy">
          {t.back}
        </button>
        <button onClick={handleConfirm} className="px-6 py-3 rounded-lg bg-green-700 text-white shadow font-fantasy">
          {t.confirm}
        </button>
      </div>
    </div>
  );
};

export default TrackerSelect;

