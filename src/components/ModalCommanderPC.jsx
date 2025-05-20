// ModalCommanderPC.jsx
import React, { useState } from 'react';

const ModalCommanderPC = ({ onConfirm, onCancel, color = 'gray' }) => {
  const [pcValue, setPcValue] = useState('');

  const handleSubmit = () => {
    const parsed = parseInt(pcValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      onConfirm(1); // Por defecto PC = 1
    } else {
      onConfirm(parsed);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className={`bg-${color}-800 text-white p-4 rounded-xl shadow-lg`}>
        <h2 className="text-lg font-bold mb-2">Introduce el valor de PC</h2>
        <input
          type="number"
          min="1"
          value={pcValue}
          onChange={(e) => setPcValue(e.target.value)}
          className="text-black p-1 w-full rounded"
        />
        <div className="flex justify-end gap-2 mt-3">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={`bg-${color}-600 hover:bg-${color}-700 text-white py-1 px-3 rounded`}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCommanderPC;
