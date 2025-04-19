// src/pages/Tracker.jsx
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';

import { EXPANSIONS } from '@/data/expansions';
import HEROES from '@/data/heroes';
import ENEMIES from '@/data/enemies';
import ROLES from '@/data/roles';

const TrackerSelect = () => {
  const { activeExpansions } = useLanguage(); // Aquí asumimos que tienes las expansiones activas en contexto
  const { t } = useTranslation();

  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);

  const availableHeroes = useMemo(() =>
    HEROES.filter(h => activeExpansions.includes(h.expansionId)), [activeExpansions]
  );

  const availableEnemies = useMemo(() =>
    ENEMIES.filter(e => activeExpansions.includes(e.expansionId)), [activeExpansions]
  );

  const handleHeroSelect = (heroId, role) => {
    if (selectedHeroes.includes(heroId)) {
      setSelectedHeroes(prev => prev.filter(id => id !== heroId));
      const newRoles = { ...heroRoles };
      delete newRoles[heroId];
      setHeroRoles(newRoles);
    } else if (selectedHeroes.length < 5) {
      setSelectedHeroes(prev => [...prev, heroId]);
      setHeroRoles(prev => ({ ...prev, [heroId]: role }));
    } else {
      alert(t('trackerSelect.maxHeroesAlert'));
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
    const candidates = availableEnemies.filter(e => e.color === color);
    if (candidates.length > 0) {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      handleEnemySelect(random.id);
    }
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
        {availableHeroes.map(hero => (
          <div key={hero.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedHeroes.includes(hero.id)}
                onChange={() => handleHeroSelect(hero.id, 'none')}
              />
              {t(`heroes.${hero.id}`)}
            </label>
          </div>
        ))}

        <h3>{t('trackerSelect.assignRoles')}</h3>
        {selectedHeroes.map(heroId => (
          <div key={heroId}>
            <select
              value={heroRoles[heroId] || 'none'}
              onChange={(e) =>
                setHeroRoles({ ...heroRoles, [heroId]: e.target.value })
              }
            >
              <option value="none">{t('trackerSelect.noRole')}</option>
              {ROLES.map(role => (
                <option key={role.id} value={role.id}>
                  {t(`roles.${role.id}`)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <h2>{t('trackerSelect.selectEnemies')}</h2>
        {availableEnemies.map(enemy => (
          <div key={enemy.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedEnemies.includes(enemy.id)}
                onChange={() => handleEnemySelect(enemy.id)}
              />
              {t(`enemies.${enemy.id}`)}
            </label>
          </div>
        ))}

        <h3>{t('trackerSelect.randomEnemyByColor')}</h3>
        {['red', 'green', 'blue', 'yellow'].map(color => (
          <button key={color} onClick={() => handleRandomEnemySelect(color)}>
            {t('trackerSelect.selectRandomEnemyForColor', {
              color: t(`trackerSelect.colors.${color}`),
            })}
          </button>
        ))}
      </div>

      <div>
        <h2>{t('trackerSelect.summary')}</h2>
        <p>
          {t('trackerSelect.selectedHeroes')}:{' '}
          {selectedHeroes.map(id => t(`heroes.${id}`)).join(', ')}
        </p>
        <p>
          {t('trackerSelect.selectedEnemies')}:{' '}
          {selectedEnemies.map(id => t(`enemies.${id}`)).join(', ')}
        </p>
      </div>

      <div>
        <button onClick={handleBack}>{t('trackerSelect.back')}</button>
        <button onClick={handleConfirm}>{t('trackerSelect.confirm')}</button>
      </div>
    </div>
  );
};

export default TrackerSelect;

