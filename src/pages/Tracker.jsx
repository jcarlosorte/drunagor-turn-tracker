import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { COLORS } from '@/data/color';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useTracker } from '@/context/TrackerContext';
import PageTransition from "@/components/PageTransition";

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState(["Estándar", "Alternativo", "Complejo"]);
  const { selectedExpansions } = useExpansions();
  const { language, translations } = useLanguage();
  const { setTrackerData } = useTracker();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();

  const fullSelectedExpansions = EXPANSIONS.filter(exp => selectedExpansions.includes(exp.id));
  const heroIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.heroes);
  const enemyIdsInSelectedExpansions = fullSelectedExpansions.flatMap(exp => exp.enemies);
  const heroesInSelectedExpansions = HEROES.filter(h => heroIdsInSelectedExpansions.includes(h.id));
  const enemiesInSelectedExpansions = ENEMIES.filter(
    e => enemyIdsInSelectedExpansions.includes(e.id) && e.color !== "jefe" && e.color !== "hero"
  );

  useEffect(() => {
    setSelectedEnemies(enemyIdsInSelectedExpansions.filter(id => {
      const enemy = ENEMIES.find(e => e.id === id);
      return enemy?.color !== "jefe" && enemy?.color !== "hero";
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
    if (selectedHeroes.length === 0) {
      alert(t.noHeroesSelected || "Debes seleccionar al menos un héroe.");
      return;
  }
   const heroesWithoutRole = selectedHeroes.filter(h => !heroRoles[h]);
    if (heroesWithoutRole.length > 0) {
      const names = heroesWithoutRole.map(getHeroName).join(', ');
      alert(
        t.heroesWithoutRoles?.replace('{heroes}', names) ||
        `Todos los héroes deben tener un rol asignado. Faltan: ${names}`
      );
      return;
    }
    setTrackerData({
      heroes: selectedHeroes,
      roles: heroRoles,
      enemies: selectedEnemies,
      behaviors: selectedBehaviors
  });
    navigate("/init", { replace: true });
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  // Función para manejar la selección de comportamientos
  const handleBehaviorSelect = (behavior) => {
  setSelectedBehaviors(prev => {
    if (prev.includes(behavior)) {
      // Si el comportamiento ya está seleccionado, lo eliminamos
      const newBehaviors = prev.filter(b => b !== behavior);
      // Si no hay ningún comportamiento seleccionado, restauramos el comportamiento
      if (newBehaviors.length === 0) {
        return prev; // No dejamos que se deseleccione el último comportamiento
      }
      return newBehaviors;
    } else {
      // Si el comportamiento no está seleccionado, lo añadimos
      return [...prev, behavior];
    }
  });
};
  
  const RuneTitle = ({ children }) => (
      <div className="relative text-center my-6">
        <div className="inline-block border-4 border-yellow-800 rounded-2xl px-6 py-3 bg-yellow-100 shadow-xl relative font-fantasy">
          <span className="text-4xl tracking-wider text-yellow-900">{children}</span>
          <span className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
          <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
          <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-800 rounded-full shadow" />
        </div>
      </div>
    );

  
  return (
  <PageTransition>
    <div className="p-4 space-y-8 text-gray-900 font-fantasy bg-gradient-to-br from-yellow-50 to-yellow-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center">{t.title}</h1>

      {/* Selección de héroes */}
      <div className="border-4 rounded-3xl p-6 bg-white/80 shadow-2xl border-yellow-700">
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
        <div className="border-4 rounded-3xl p-6 bg-blue-100/60 shadow-2xl border-blue-600">
          <RuneTitle>{t.assignRoles}</RuneTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find((h) => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-blue-500 shadow-md">
                  <img
                    src={heroData.image}
                    alt={getHeroName(heroId)}
                    className="w-20 h-20 object-contain"
                  />
                  <span className="font-bold">{getHeroName(heroId)}</span>
                  <span>
                    {heroRoles[heroId]
                      ? `- ${getRoleName(heroRoles[heroId])} -`
                      : <em>- Elige rol -</em>}
                  </span>
                  <select
                    value={heroRoles[heroId] || ""}
                    onChange={(e) => handleRoleSelect(heroId, e.target.value)}
                    className="mt-1 p-1 border border-gray-400 rounded text-sm"
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
      <div className="border-4 rounded-3xl p-6 bg-white/70 shadow-2xl border-yellow-700">
        <RuneTitle>{t.selectEnemies}</RuneTitle>

        {/* Comportamientos Generales */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">{t?.comportamientos?.comportamiento}</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("Estándar")}
                onChange={() => handleBehaviorSelect("Estándar")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.estandar}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("Alternativo")}
                onChange={() => handleBehaviorSelect("Alternativo")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.alternativo}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("Complejo")}
                onChange={() => handleBehaviorSelect("Complejo")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.complejo}</span>
            </label>
          </div>
        </div>

        
        {/* Flex en filas con wrap */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
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
      
            const isCompact = enemiesOfColor.length <= 4;
      
            return (
              <div
                  key={color.id}
                  className={`flex flex-col p-4 rounded-lg shadow ${areaBg} ${textColor}
                    ${isCompact ? 'max-w-[240px] flex-1' : 'w-full'}
                  `}
                >
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {t.colors?.[color.id] || color.id}
                  </h3>
              
                  {/** Aquí está la magia: cambiamos el layout según el color */}
                  <div
                    className={
                      ['blanco', 'gris'].includes(color.id)
                        ? 'grid gap-4 w-full'
                        : 'flex flex-col gap-4'
                    }
                    style={
                      ['blanco', 'gris'].includes(color.id)
                        ? { gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }
                        : {}
                    }
                  >
                  {enemiesOfColor.map(enemy => {
                    const isSelected = selectedEnemies.includes(enemy.id);
                    return (
                      <label
                        key={enemy.id}
                        className={`fantasy-frame flex flex-col items-center space-y-2 p-2 rounded-lg cursor-pointer border transition 
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
                          <img src={enemy.imagen} alt={getEnemyName(enemy.id)} className="w-12 h-12 object-contain mb-2" />
                        )}
                        <span className="text-sm font-fantasy">{getEnemyName(enemy.id)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Botones */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg bg-red-200 hover:bg-red-300 shadow font-bold"
        >
          {t.back}
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 rounded-lg bg-green-200 hover:bg-green-300 shadow font-bold"
        >
          {t.confirm}
        </button>
      </div>
    </div>
    </PageTransition>
  );
};

export default TrackerSelect;

