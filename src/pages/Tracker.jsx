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
import classNames from 'classnames';
import PageTransition from "@/components/PageTransition";

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState(["estandar", "alternativo", "complejo"]);
  const [showHeroes, setShowHeroes] = useState(false);
  const [showEnemies, setShowEnemies] = useState(false);
  
  const { selectedExpansions } = useExpansions();
  const { language, translations } = useLanguage();
  const { setTrackerData } = useTracker();
  const t = translations?.trackerSelect || {};
  const navigate = useNavigate();
  
  const heroesInSelectedExpansions = HEROES.filter(h => selectedExpansions.includes(h.expansionId));
  const enemiesInSelectedExpansions = ENEMIES.filter(e => 
    selectedExpansions.includes(e.expansionId) &&
    e.color !== "jefe" && e.color !== "hero" && e.color !== "esbirro"
  );
  
  useEffect(() => {
    const validEnemies = enemiesInSelectedExpansions.map(e => e.id);
  
    const stored = localStorage.getItem("trackerData");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.heroes) setSelectedHeroes(data.heroes);
      if (data.roles) setHeroRoles(data.roles);
      if (data.enemies) {
        // Filtra solo enemigos válidos según expansiones activas
        const filteredEnemies = data.enemies.filter(id => validEnemies.includes(id));
        setSelectedEnemies(filteredEnemies);
      } else {
        setSelectedEnemies(validEnemies);
      }
      if (data.behaviors) setSelectedBehaviors(data.behaviors);
    } else {
      setSelectedEnemies(validEnemies);
    }
  }, [selectedExpansions.join(',')]);


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
  
    // (opcional) Refiltrar enemigos por si el estado no estaba 100% sincronizado
    const validEnemies = selectedEnemies.filter(id => {
      const enemy = ENEMIES.find(e => e.id === id);
      return enemy?.color !== "jefe" && enemy?.color !== "hero" && enemy?.color !== "esbirro";
    });
  
    const trackerData = {
      heroes: selectedHeroes,
      roles: heroRoles,
      enemies: validEnemies,
      behaviors: selectedBehaviors,
    };
  
    setTrackerData(trackerData);
    localStorage.setItem("trackerData", JSON.stringify(trackerData));
    navigate("/init", { replace: true });
  };


  
  const handleReset = () => {
    const validEnemies = Array.from(new Set(enemiesInSelectedExpansions.map(e => e.id)));
    setSelectedHeroes([]);
    setHeroRoles({});
    setSelectedEnemies(validEnemies);
    setSelectedBehaviors(["estandar", "alternativo", "complejo"]);
    setTrackerData({
      heroes: [],
      roles: {},
      enemies: validEnemies,
      behaviors: ["estandar", "alternativo", "complejo"],
    });
    localStorage.removeItem("trackerData");
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
    <div className="p-4 space-y-8 font-fantasy bg-slate-700 min-h-screen">
      <div className="no-header" />
      <h1 className="text-3xl text-white font-bold text-center">{t.title}</h1>
      
      {/* Selección de héroes */}
      <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-yellow-700 text-black">
        <div className="cursor-pointer" onClick={() => setShowHeroes(!showHeroes)}>
          <RuneTitle>{t.selectHeroes}</RuneTitle>
        </div>
        {showHeroes && (
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
                      className="w-30 h-30 object-contain mb-2"
                    />
                  )}
                  <span className="absolute bottom-1 left-0 right-0 text-xs text-white bg-black bg-opacity-60 p-1 text-center">
                    {getEnemyName(enemy.id)}
                  </span>
                </label>
              );
            })}
          </div>
      )}  
      </div>

      {/* Asignación de roles */}
      {selectedHeroes.length > 0 && (
        <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-green-600 text-black">
          <RuneTitle>{t.assignRoles}</RuneTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
            {selectedHeroes.map((heroId) => {
              const heroData = HEROES.find((h) => h.id === heroId);
              const usedRoles = Object.values(heroRoles);
              return (
                <div key={heroId} className="flex flex-col items-center gap-2 p-4 bg-green-100/80 rounded-2xl border-0 border-green-600 shadow-md">
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
      <div className="border-0 rounded-3xl p-2 bg-slate-600 shadow-2xl border-yellow-700 text-black">
        <RuneTitle>{t.selectEnemies}</RuneTitle>

        {/* Comportamientos Generales */}
        <div className="mb-4 bg-white/70 rounded-3xl">
          <p className="text-lg font-semibold mb-2">{t?.comportamientos?.comportamiento}</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("estandar")}
                onChange={() => handleBehaviorSelect("estandar")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.estandar}:</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("alternativo")}
                onChange={() => handleBehaviorSelect("alternativo")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.alternativo}</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBehaviors.includes("complejo")}
                onChange={() => handleBehaviorSelect("complejo")}
                className="form-checkbox"
              />
              <span className="text-sm">{t?.comportamientos?.complejo}</span>
            </label>

          </div>
        </div>

        
        {/* Flex en filas con wrap */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {COLORS.map(color => {
            const enemiesOfColorMap = new Map();
            enemiesInSelectedExpansions.forEach(e => {
              if (e.color === color.id && !enemiesOfColorMap.has(e.id)) {
                enemiesOfColorMap.set(e.id, e);
              }
            });
            const enemiesOfColor = Array.from(enemiesOfColorMap.values());
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
                  className={`flex flex-col p-4 rounded-lg shadow items-center ${areaBg} ${textColor}
                    ${isCompact ? 'max-w-[800px] flex-1' : 'w-full'}
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
                        //: 'flex flex-row gap-4'
                        : 'flex flex-wrap gap-4 justify-center w-full'
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
                          w-full max-w-[150px]
                          ${isSelected ? 'border-green-600 bg-green-100/80' : 'border-red-600 bg-white hover:bg-gray-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleEnemySelect(enemy.id)}
                          className="hidden"
                        />
                        {enemy.imagen && (
                          <img src={enemy.imagen} alt={getEnemyName(enemy.id)} className="w-30 h-30 object-contain mb-2" />
                        )}
                        <span className="text-sm font-fantasy text-black">{getEnemyName(enemy.id)}</span>
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
      <div className="flex justify-between gap-4 mt-6 text-black">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg bg-blue-200 hover:bg-blue-400 shadow font-bold"
        >
          {t.back}
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition shadow "
        >
          {t.reset}
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 rounded-lg bg-green-200 hover:bg-green-400 shadow font-bold"
        >
          {t.confirm}
        </button>
      </div>
      </div>
    </PageTransition>
  );
};

export default TrackerSelect;

