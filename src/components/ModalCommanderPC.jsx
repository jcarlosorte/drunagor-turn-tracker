import React, { useState } from 'react';

const ModalCommanderPC = ({ onConfirm, onCancel }) => {
  const [pcValue, setPcValue] = useState(1);

  const handleConfirm = () => {
    const pc = parseInt(pcValue);
    if (!isNaN(pc) && pc >= 0) {
      onConfirm(pc);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-yellow-100 border-4 border-yellow-500 rounded-lg shadow-lg p-6 max-w-xs w-full relative">
        <h2 className="text-xl font-bold text-yellow-800 mb-4 text-center">Introduce valor de PC</h2>

        <input
          type="number"
          min="0"
          value={pcValue}
          onChange={(e) => setPcValue(e.target.value)}
          className="w-full px-3 py-2 border border-yellow-500 rounded text-center text-lg mb-4"
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded w-full"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCommanderPC;
