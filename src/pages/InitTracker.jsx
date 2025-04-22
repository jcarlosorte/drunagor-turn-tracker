// src/pages/InitTracker.jsx
import React from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import TopMenu from "@/components/TopMenu";

const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { translations } = useLanguage();
  const t = translations.trackerInit || {};

  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id) => translations.enemies?.[id] || id;
  const getRoleName = (id) => translations.roles?.[id] || id;

  const handleAddEnemy = (color) => {
    console.log("Añadir enemigo:", color);
    setTrackerData(prevState => ({
      ...prevState,
      enemies: [...prevState.enemies, color]  // Solo ejemplo
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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-4 font-sans">
      <TopMenu
        onAddEnemy={handleAddEnemy}
        onSelectBoss={handleSelectBoss}
        onSelectOther={handleSelectOther}
        onAddManual={handleAddManual}
        translations={translations}
      />
      <div className="no-header" />

      <h1 className="text-4xl font-bold text-center font-fantasy text-yellow-300 mt-6 drop-shadow">
        {t.title || 'Inicio del Tracker'}
      </h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Héroes */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">{t.selectedHeroes || 'Héroes Seleccionados'}</h2>
          <ul className="space-y-2">
            {trackerData.heroes.map(heroId => (
              <li key={heroId} className="text-white">
                <span className="font-semibold text-green-400">{getHeroName(heroId)}</span> – <span className="italic text-gray-300">{getRoleName(trackerData.roles[heroId])}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enemigos */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-300">{t.selectedEnemies || 'Enemigos Seleccionados'}</h2>
          <ul className="space-y-2">
            {trackerData.enemies.map(enemyId => (
              <li key={enemyId} className="text-white">
                {getEnemyName(enemyId)}
              </li>
            ))}
          </ul>
        </div>

        {/* Comportamientos */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">{t.behaviors || 'Comportamientos'}</h2>
          <ul className="space-y-2">
            {trackerData.behaviors.map(b => (
              <li key={b} className="text-white">{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InitTracker;

