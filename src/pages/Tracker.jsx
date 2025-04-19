// src/components/Tracker.jsx
import React, { useState, useEffect } from 'react';
import { EXPANSIONS } from '@/data/expansions'; // Importar las expansiones
import { useTranslation } from 'react-i18next'; // Para gestionar traducciones

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedExpansion, setSelectedExpansion] = useState(EXPANSIONS[0]);
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Esto podría venir de alguna configuración o del estado del usuario
  }, [selectedExpansion]);

  const handleHeroSelect = (heroId, role) => {
    if (selectedHeroes.length < 5 && !selectedHeroes.includes(heroId)) {
      setSelectedHeroes([...selectedHeroes, heroId]);
      setHeroRoles({ ...heroRoles, [heroId]: role });
    } else {
      alert('Puedes seleccionar hasta 5 héroes');
    }
  };

  const handleEnemySelect = (enemyId) => {
    setSelectedEnemies(prevSelected =>
      prevSelected.includes(enemyId)
        ? prevSelected.filter(id => id !== enemyId)
        : [...prevSelected, enemyId]
    );
  };

  const handleRandomEnemySelect = (color) => {
    const randomEnemy = selectedExpansion.enemies.filter(enemy => enemy.color === color);
    const randomId = randomEnemy[Math.floor(Math.random() * randomEnemy.length)].id;
    handleEnemySelect(randomId);
  };

  const handleConfirm = () => {
    console.log('Héroes seleccionados:', selectedHeroes, 'Roles:', heroRoles);
    console.log('Enemigos seleccionados:', selectedEnemies);
  };

  const handleBack = () => {
    console.log('Volver a la configuración');
  };

  return (
    <div>
      <h1>{t('trackerSelect.title')}</h1>

      <div>
        <h2>{t('trackerSelect.selectHeroes')}</h2>
        <div>
          {selectedExpansion.heroes.map(hero => (
            <div key={hero.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedHeroes.includes(hero.id)}
                  onChange={() => handleHeroSelect(hero.id, 'role_example')}
                />
                {hero.name}
              </label>
            </div>
          ))}
        </div>

        <h3>{t('trackerSelect.assignRoles')}</h3>
        {selectedHeroes.map(hero => (
          <div key={hero.id}>
            <select
              value={heroRoles[hero.id] || 'none'}
              onChange={(e) => setHeroRoles({ ...heroRoles, [hero.id]: e.target.value })}
            >
              <option value="none">{t('trackerSelect.noRole')}</option>
              <option value="tank">{t('trackerSelect.tank')}</option>
              <option value="support">{t('trackerSelect.support')}</option>
              <option value="dps">{t('trackerSelect.dps')}</option>
              <option value="healer">{t('trackerSelect.healer')}</option>
              <option value="control">{t('trackerSelect.control')}</option>
            </select>
          </div>
        ))}
      </div>

      <div>
        <h2>{t('trackerSelect.selectEnemies')}</h2>
        <div>
          {selectedExpansion.enemies.map(enemy => (
            <div key={enemy.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedEnemies.includes(enemy.id)}
                  onChange={() => handleEnemySelect(enemy.id)}
                />
                {enemy.name}
              </label>
            </div>
          ))}
        </div>

        <h3>{t('trackerSelect.randomEnemyByColor')}</h3>
        <div>
          {['red', 'green', 'blue', 'yellow'].map(color => (
            <button key={color} onClick={() => handleRandomEnemySelect(color)}>
              {t('trackerSelect.selectRandomEnemyForColor', { color })}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2>{t('trackerSelect.summary')}</h2>
        <p>{t('trackerSelect.selectedHeroes')}: {selectedHeroes.join(', ')}</p>
        <p>{t('trackerSelect.selectedEnemies')}: {selectedEnemies.join(', ')}</p>
      </div>

      <div>
        <button onClick={handleBack}>{t('trackerSelect.back')}</button>
        <button onClick={handleConfirm}>{t('trackerSelect.confirm')}</button>
      </div>
    </div>
  );
};

export default TrackerSelect;
