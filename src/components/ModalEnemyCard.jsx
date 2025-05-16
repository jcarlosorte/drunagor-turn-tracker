import React from 'react';
import { useTracker } from '@/context/TrackerContext';

export default function ModalEnemyCard({ uuid, onClose, onUpdateLife }) {
  const { trackerData, setTrackerData } = useTracker();

  // Buscar el enemigo por uuid dentro de trackerData.enemies (o donde los tengas)
  const enemy = trackerData.enemies.find(e => e.uuid === uuid);

  if (!enemy) {
    return (
      <div className="modal">
        <p>Enemigo no encontrado</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  // Función ejemplo para actualizar vida
  const handleLifeChange = (e) => {
    const newLife = parseInt(e.target.value, 10);
    if (isNaN(newLife)) return;

    // Actualizamos vida del enemigo en trackerData
    const updatedEnemies = trackerData.enemies.map(e =>
      e.uuid === uuid ? { ...e, life: newLife } : e
    );

    setTrackerData(prev => ({
      ...prev,
      enemies: updatedEnemies,
    }));

    if (onUpdateLife) onUpdateLife(uuid, newLife);
  };

  return (
    <div className="modal">
      <h2>{enemy.name}</h2>
      <img src={enemy.image} alt={enemy.name} />
      <p>Vida: <input type="number" value={enemy.life} onChange={handleLifeChange} /></p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
