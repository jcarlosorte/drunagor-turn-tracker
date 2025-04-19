// src/components/Tracker.jsx
import React, { useState, useEffect } from 'react';
import { EXPANSIONS } from '@/data/expansions';
import { useLanguage } from '@/context/LanguageContext';

const TrackerSelect = () => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [selectedExpansion, setSelectedExpansion] = useState(EXPANSIONS[0]);
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);

  const { translations } = useLanguage();

  const t = translations?.trackerSelect || {};

  useEffect(() => {
    // Esto podría venir de alguna configuración o del estado del usuario
  }, [selectedExpansion]);

  const handleHeroSelect = (heroId, role) => {
  // Asegúrate de que no se seleccionen más de 5 héroes
  if (selectedHeroes.length < 5) {
    if (selectedHeroes.includes(heroId)) {
      setSelectedHeroes(selectedHeroes.filter(id => id !== heroId)); // Eliminar héroe si ya está seleccionado
      const newHeroRoles = { ...heroRoles };
      delete newHeroRoles[heroId]; // Eliminar el rol del héroe si se deselecciona
      setHeroRoles(newHeroRoles);
    } else {
      setSelectedHeroes([...selectedHeroes, heroId]); // Agregar héroe si no está seleccionado
      setHeroRoles({ ...heroRoles, [heroId]: role }); // Asignar rol al héroe
    }
  } else if (!selectedHeroes.includes(heroId)) {
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
      <h1>{t.title}</h1>

      <div>
        <h2>{t.selectHeroes}</h2>
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

        <h3>{t.assignRoles}</h3>
        {selectedHeroes.map(heroId => (
          <div key={heroId}>
            <select
              value={heroRoles[heroId] || 'none'}
              onChange={(e) => setHeroRoles({ ...heroRoles, [heroId]: e.target.value })}
            >
              <option value="none">{t.noRole}</option>
              <option value="tank">{t.tank}</option>
              <option value="support">{t.support}</option>
              <option value="dps">{t.dps}</option>
              <option value="healer">{t.healer}</option>
              <option value="control">{t.control}</option>
            </select>
          </div>
        ))}
      </div>

      <div>
        <h2>{t.selectEnemies}</h2>
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

        <h3>{t.randomEnemyByColor}</h3>
        <div>
          {['red', 'green', 'blue', 'yellow'].map(color => (
            <button key={color} onClick={() => handleRandomEnemySelect(color)}>
              {t.selectRandomEnemyForColor.replace('{color}', t.colors?.[color] || color)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2>{t.summary}</h2>
        <p>{t.selectedHeroes}: {selectedHeroes.join(', ')}</p>
        <p>{t.selectedEnemies}: {selectedEnemies.join(', ')}</p>
      </div>

      <div>
        <button onClick={handleBack}>{t.back}</button>
        <button onClick={handleConfirm}>{t.confirm}</button>
      </div>
    </div>
  );
};

export default TrackerSelect;
