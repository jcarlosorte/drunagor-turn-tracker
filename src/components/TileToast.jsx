// src/components/TileToast.jsx
import React, { useEffect } from 'react';
import TetrisPiece from './TetrisPiece';

const colorMap = {
  rojo: 'bg-red-600',
  azul: 'bg-blue-600',
  verde: 'bg-green-600',
  naranja: 'bg-orange-500',
  gris: 'bg-gray-500',
};

const TileToast = ({ tile, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-xl text-white ${colorMap[tile.runa]} border-2 border-white`}>
      <div className="text-xs font-bold mb-1">+1 Runa {tile.runa}</div>
      <TetrisPiece type={tile.dibujo} color="text-white" />
    </div>
  );
};

export default TileToast;
