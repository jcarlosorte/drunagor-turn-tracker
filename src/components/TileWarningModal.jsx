// src/components/TileWarningModal.jsx
import React from 'react';
import { useGame } from '@/context/GameContext';

const TileWarningModal = () => {
  const { tileWarning, setTileWarning } = useGame();

  if (!tileWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">⚠️ Aviso </h2>
        <p className="text-sm text-gray-800 mb-4">{tileWarning}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => setTileWarning(null)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TileWarningModal;
