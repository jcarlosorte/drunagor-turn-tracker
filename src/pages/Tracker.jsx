// src/pages/Tracker.jsx
import React, { useState } from 'react';
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { useLanguage } from '@/context/LanguageContext';

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedExpansion, setSelectedExpansion] = useState(EXPANSIONS[0]);
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);

  const { language, translations } = useLanguage();
  const t = translations?.trackerSelect || {};

  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;

  const heroesInExpansion = HEROES.filter(h => selectedExpansion.heroes.includes(h.id));
  const enemiesInExpansion = ENEMIES.filter(e => selectedExpansion.enemies.includes(e.id));

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
    const matching = enemiesInExpansion.filter(e => e.color === color);
    if (matching.length > 0) {
      const randomEnemy = matching[Math.floor(Math.random() * matching.length)];
      handleEnemySelect(randomEnemy.id);
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
      <h1>{t.title}</h1>

      <div>
        <h2>{t.selectHeroes}</h2>
        {heroesInExpansion.map(hero => (
          <div key={hero.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedHeroes.includes(hero.id)}
                onChange={() => handleHeroSelect(hero.id)}
              />
              {getHeroName(hero.id)}
            </label>
          </div>
        ))}

        <h3>{t.assignRoles}</h3>
        {selectedHeroes.map(heroId => (
          <div key={heroId}>
            <label>{getHeroName(heroId)}:</label>
            <select
              value={heroRoles[heroId] || 'none'}
              onChange={(e) => setHeroRoles({ ...heroRoles, [heroId]: e.target.value })}
            >
              {ROLES.map(role => (
                <option key={role.id} value={role.id}>
                  {getRoleName(role.id)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <h2>{t.selectEnemies}</h2>
        {enemiesInExpansion.map(enemy => (
          <div key={enemy.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedEnemies.includes(enemy.id)}
                onChange={() => handleEnemySelect(enemy.id)}
              />
              {getEnemyName(enemy.id)}
            </label>
          </div>
        ))}

        <h3>{t.randomEnemyByColor}</h3>
        <div>
          {['red', 'green', 'blue', 'yellow'].map(color => (
            <button key={color} onClick={() => handleRandomEnemySelect(color)}>
              {t.selectRandomEnemyForColor?.replace('{color}', t.colors?.[color] || color)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2>{t.summary}</h2>
        <p>{t.selectedHeroes}: {selectedHeroes.map(getHeroName).join(', ')}</p>
        <p>{t.selectedEnemies}: {selectedEnemies.map(getEnemyName).join(', ')}</p>
      </div>

      <div>
        <button onClick={handleBack}>{t.back}</button>
        <button onClick={handleConfirm}>{t.confirm}</button>
      </div>
    </div>
  );
};

export default TrackerSelect;
