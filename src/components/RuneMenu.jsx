import React, { useState } from 'react';
import { RUNAS } from '@/data/runas';

const RuneMenu = ({ onSelectCard }) => {
  const [showRuneFaceOptions, setShowRuneFaceOptions] = useState(false);

  const handleAddDefaultRunes = () => {
    const defaultRunes = RUNAS.filter(r => r.cara === 'A');
    defaultRunes.forEach(r => onSelectCard(r));
  };

  const handleAddSpecificRuna = (runa) => {
    onSelectCard(runa);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAddDefaultRunes}
          className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
        >
          Añadir Runas (cara A)
        </button>

        <button
          onClick={() => setShowRuneFaceOptions(prev => !prev)}
          className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
        >
          Seleccionar Runa por cara
        </button>

        <button
          onClick={() => alert('Funcionalidad de runas especiales próximamente')}
          className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
        >
          Añadir Runa Especial
        </button>
      </div>

      {showRuneFaceOptions && (
        <div className="flex gap-2 flex-wrap mt-2">
          {RUNAS.map((card, index) => (
            <button
              key={`${card.id}-${card.cara}-${index}`}
              onClick={() => handleAddSpecificRuna(card)}
              className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
            >
              {card.nombre} ({card.cara})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RuneMenu;
