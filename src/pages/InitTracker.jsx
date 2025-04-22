// src/pages/InitTracker.jsx
import React from 'react';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
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
    // Lógica para añadir el enemigo correspondiente al estado
    setTrackerData(prevState => ({
      ...prevState,
      enemies: [...prevState.enemies, color]  // Simplemente ejemplo de agregar
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
    <div className="p-4 text-gray-900">
      <TopMenu
        onAddEnemy={handleAddEnemy}
        onSelectBoss={handleSelectBoss}
        onSelectOther={handleSelectOther}
        onAddManual={handleAddManual}
      />
      <div className="no-header"></div>  {/* Esto elimina la cabecera global */}
      
      <h1 className="text-3xl font-bold text-white-500 font-fantasy">{t.title || 'Inicio del Tracker'}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Héroes Seleccionados:</h2>
          <ul>
            {trackerData.heroes.map(heroId => (
              <li key={heroId}>
                {getHeroName(heroId)} - {getRoleName(trackerData.roles[heroId])}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Enemigos Seleccionados:</h2>
          <ul>
            {trackerData.enemies.map(enemyId => (
              <li key={enemyId}>{getEnemyName(enemyId)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Comportamientos:</h2>
          <ul>
            {trackerData.behaviors.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InitTracker;
