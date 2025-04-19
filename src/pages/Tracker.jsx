// src/components/TrackerSelect.jsx
import React, { useState, useEffect } from 'react';
import { EXPANSIONS } from '@/data/expansions'; // Importar las expansiones
import { useTranslation } from 'react-i18next'; // Para gestionar traducciones

const TrackerSelect = () => {
  // Estado para los héroes seleccionados y sus roles
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [heroRoles, setHeroRoles] = useState({});
  
  // Estado para los enemigos seleccionados
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  
  // Estado para la expansión seleccionada
  const [selectedExpansion, setSelectedExpansion] = useState(EXPANSIONS[0]); // Por defecto la expansión base
  
  // Estado para los colores de los enemigos seleccionados aleatoriamente
  const [selectedEnemyColors, setSelectedEnemyColors] = useState([]);
  
  // Gestión del idioma
  const { i18n } = useTranslation();
  
  // Cargar las expansiones disponibles y los héroes
  useEffect(() => {
    // Esto podría venir de alguna configuración o del estado del usuario
  }, [selectedExpansion]);

  // Función para seleccionar un héroe y asignarle un rol
  const handleHeroSelect = (heroId, role) => {
    if (selectedHeroes.length < 5 && !selectedHeroes.includes(heroId)) {
      setSelectedHeroes([...selectedHeroes, heroId]);
      setHeroRoles({ ...heroRoles, [heroId]: role });
    } else {
      alert('Puedes seleccionar hasta 5 héroes');
    }
  };

  // Función para manejar la selección de enemigos
  const handleEnemySelect = (enemyId) => {
    setSelectedEnemies(prevSelected =>
      prevSelected.includes(enemyId)
        ? prevSelected.filter(id => id !== enemyId)
        : [...prevSelected, enemyId]
    );
  };

  // Función para manejar la selección aleatoria de enemigos por color
  const handleRandomEnemySelect = (color) => {
    const randomEnemy = selectedExpansion.enemies.filter(enemy => enemy.color === color);
    const randomId = randomEnemy[Math.floor(Math.random() * randomEnemy.length)].id;
    handleEnemySelect(randomId);
  };

  // Confirmar selección
  const handleConfirm = () => {
    // Aquí puedes enviar los datos seleccionados a la siguiente pantalla
    console.log('Héroes seleccionados:', selectedHeroes, 'Roles:', heroRoles);
    console.log('Enemigos seleccionados:', selectedEnemies);
  };

  // Volver atrás
  const handleBack = () => {
    // Aquí puedes gestionar la lógica de volver atrás (por ejemplo, ir a la configuración)
    console.log('Volver a la configuración');
  };

  return (
    <div>
      <h1>{i18n.t('trackerSelect.title')}</h1>

      <div>
        <h2>{i18n.t('trackerSelect.selectHeroes')}</h2>
        <div>
          {selectedExpansion.heroes.map(hero => (
            <div key={hero.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedHeroes.includes(hero.id)}
                  onChange={() => handleHeroSelect(hero.id, 'role_example')} // Cambiar según el rol
                />
                {hero.name}
              </label>
            </div>
          ))}
        </div>

        <h3>{i18n.t('trackerSelect.assignRoles')}</h3>
        {selectedHeroes.map(hero => (
          <div key={hero.id}>
            <select
              value={heroRoles[hero.id] || 'none'}
              onChange={(e) => setHeroRoles({ ...heroRoles, [hero.id]: e.target.value })}
            >
              <option value="none">{i18n.t('trackerSelect.noRole')}</option>
              <option value="tank">{i18n.t('trackerSelect.tank')}</option>
              <option value="support">{i18n.t('trackerSelect.support')}</option>
              <option value="dps">{i18n.t('trackerSelect.dps')}</option>
              <option value="healer">{i18n.t('trackerSelect.healer')}</option>
              <option value="control">{i18n.t('trackerSelect.control')}</option>
            </select>
          </div>
        ))}
      </div>

      <div>
        <h2>{i18n.t('trackerSelect.selectEnemies')}</h2>
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

        <h3>{i18n.t('trackerSelect.randomEnemyByColor')}</h3>
        <div>
          {['red', 'green', 'blue', 'yellow'].map(color => (
            <button key={color} onClick={() => handleRandomEnemySelect(color)}>
              {i18n.t(`trackerSelect.selectRandomEnemyForColor`, { color })}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2>{i18n.t('trackerSelect.summary')}</h2>
        <p>{i18n.t('trackerSelect.selectedHeroes')}: {selectedHeroes.join(', ')}</p>
        <p>{i18n.t('trackerSelect.selectedEnemies')}: {selectedEnemies.join(', ')}</p>
      </div>

      <div>
        <button onClick={handleBack}>{i18n.t('trackerSelect.back')}</button>
        <button onClick={handleConfirm}>{i18n.t('trackerSelect.confirm')}</button>
      </div>
    </div>
  );
};

export default TrackerSelect;

