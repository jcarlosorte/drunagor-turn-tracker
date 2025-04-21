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
  const enemiesInSelectedExpansions = ENEMIES.filter(
    e => enemyIdsInSelectedExpansions.includes(e.id) && e.color !== "jefe"
  );

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
    // Aquí puedes guardar los datos globalmente o navegar a la siguiente pantalla
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  const RuneTitle = ({ children }) => (
    <div className="relative text-center my-4">
      <div className="inline-block border-4 border-yellow-800 rounded-lg px-6 py-2 bg-yellow-50 shadow-lg relative">
        <span className="text-3xl font-extrabold tracking-wider text-yellow-900">
          {children}
        </span>
        <span className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
        <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
      </div>
    </div>
  );
  
  return (
    <div className="p-4 space-y-8 text-gray-900">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      {/* Selección de héroes */}
      <div className="border rounded-xl p-4 bg-white/70 shadow">
        <RuneTitle>{t.selectHeroes}</RuneTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {heroesInSelectedExpansions.map((hero) => {
            const isSelected = selectedHeroes.includes(hero.id);
            return (
              <label
                key={hero.id}
                className={`cursor-pointer border-2 rounded-lg p-2 flex flex-col items-center text-center transition w-full max-w-[150px] mx-auto
                  ${isSelected ? 'border-green-600 bg-green-100/80 shadow-lg' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
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
                    className="w-12 h-12 object-contain mb-2"
                  />
                )}
                <span className="text-sm font-semibold">{getHeroName(hero.id)}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Asignación de roles */}
      {selectedHeroes.length > 0 && (
        <div className="border p-4 rounded-xl bg-blue-100/60 shadow">
          <RuneTitle>{t.assignRoles}</RuneTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find((h) => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center gap-2 p-2 bg-white rounded-lg shadow">
                  <img
                    src={heroData.image}
                    alt={getHeroName(heroId)}
                    className="w-20 h-20 object-contain"
                  />
                  <span className="font-semibold">{getHeroName(heroId)}</span>
                  <span>
                    {heroRoles[heroId]
                      ? `- ${getRoleName(heroRoles[heroId])} -`
                      : <em>- Elige rol -</em>}
                  </span>
                  <select
                    value={heroRoles[heroId] || ""}
                    onChange={(e) => handleRoleSelect(heroId, e.target.value)}
                    className="mt-2 border rounded-md p-2 w-full"
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

      {/* Enemigos agrupados por color */}
      <div className="border rounded-xl p-4 bg-gray-100 shadow space-y-6">
        <RuneTitle>{t.selectEnemies}</RuneTitle>
      
        {/* Agrupación tipo masonry con columnas */}
        <div className="columns-1 sm:columns-2 lg:columns-2 gap-6 space-y-6">
          {COLORS.map(color => {
            const enemiesOfColor = enemiesInSelectedExpansions.filter(e => e.color === color.id);
            if (enemiesOfColor.length === 0) return null;
      
            let areaBg = "bg-white";
            let textColor = "";
            if (color.id === "gris") areaBg = "bg-gray-300";
            else if (color.id === "negro") {
              areaBg = "bg-black/60";
              textColor = "text-white";
            } else if (color.id === "comandante") areaBg = "bg-yellow-200";
      
            return (
              <div
                key={color.id}
                className={`break-inside-avoid rounded-lg p-4 shadow ${areaBg} ${textColor} mb-6`}
              >
                <h3 className="text-xl font-bold mb-4">{t.colors?.[color.id] || color.id}</h3>
      
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                  {enemiesOfColor.map(enemy => {
                    const isSelected = selectedEnemies.includes(enemy.id);
                    return (
                      <label
                        key={enemy.id}
                        className={`flex flex-col items-center space-y-2 p-2 rounded-lg cursor-pointer border transition 
                        w-full 
                        ${isSelected ? 'border-green-600 bg-green-100/80' : 'border-red-600 bg-white hover:bg-gray-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleEnemySelect(enemy.id)}
                          className="hidden"
                        />
                        {enemy.imagen && (
                          <img src={enemy.imagen} alt={getEnemyName(enemy.id)} className="w-12 h-12 object-contain" />
                        )}
                        <span className="text-sm text-center">{getEnemyName(enemy.id)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen de selección */}
      <div className="border rounded-xl p-4 bg-gray-100 shadow space-y-2">
        <h3 className="text-lg font-semibold">{t.currentSelection || "Selección actual"}</h3>
        <p><strong>{t.heroes || "Héroes"}:</strong> {selectedHeroes.map(id => getHeroName(id)).join(", ") || "-"}</p>
        <p><strong>{t.enemies || "Enemigos"}:</strong> {selectedEnemies.map(id => getEnemyName(id)).join(", ") || "-"}</p>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button onClick={handleBack} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
          {t.back || "Volver"}
        </button>
        <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">
          {t.confirm || "Confirmar"}
        </button>
      </div>
    </div>
  );
};

export default TrackerSelect;
