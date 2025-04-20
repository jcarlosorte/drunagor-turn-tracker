import React, { useState, useContext } from 'react';
import { EXPANSIONS } from '@/data/expansions';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { ROLES } from '@/data/roles';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext'; // Asumiendo que tienes este contexto

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const { selectedExpansions, toggleExpansion } = useExpansions();
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);
  const fullSelectedExpansions = EXPANSIONS.filter(exp => selectedExpansions.includes(exp.id));

  const { language, translations } = useLanguage();
  const t = translations?.trackerSelect || {};

  const getHeroName = (heroId) => translations.heroes?.[heroId] || heroId;
  const getEnemyName = (enemyId) => translations.enemies?.[enemyId] || enemyId;
  const getRoleName = (roleId) => translations.roles?.[roleId] || roleId;

 // Obtener todos los IDs de héroes/enemigos que pertenecen a las expansiones seleccionadas
  const heroIdsInSelectedExpansions = EXPANSIONS
    .filter(exp => selectedExpansions.includes(exp.id))
    .flatMap(exp => exp.heroes);
  
  const enemyIdsInSelectedExpansions = EXPANSIONS
    .filter(exp => selectedExpansions.includes(exp.id))
    .flatMap(exp => exp.enemies);
  
  const heroesInSelectedExpansions = HEROES.filter(h => heroIdsInSelectedExpansions.includes(h.id));
  const enemiesInSelectedExpansions = ENEMIES.filter(e => enemyIdsInSelectedExpansions.includes(e.id));

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
    console.log('Héroes seleccionados:', selectedHeroes, 'Roles:', heroRoles);
    console.log('Enemigos seleccionados:', selectedEnemies);
  };

  const handleBack = () => {
    console.log('Volver a la configuración');
  };

  return (
    <div>
      <h1>{t.title}</h1>

      {/* Héroes por expansión */}
      {fullSelectedExpansions.map(expansion => (
        
          <h2>{t.selectHeroes}</h2>
          {heroesInSelectedExpansions.filter(hero => expansion.heroes.includes(hero.id)).map(hero => (
            <div key={hero.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedHeroes.includes(hero.id)}
                  onChange={() => handleHeroSelect(hero.id)}
                />
                {getHeroName(hero.id)}
              </label>
            
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
      ))}

      {/* Enemigos por expansión */}
      {fullSelectedExpansions.map(expansion => (
        <div key={expansion.id}>
          <h2>{t.selectEnemies} ({translations.expansions?.[expansion.id] || expansion.id})</h2>
          {enemiesInSelectedExpansions.filter(enemy => expansion.enemies.includes(enemy.id)).map(enemy => (
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
      ))}

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
