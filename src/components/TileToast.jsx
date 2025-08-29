// src/components/TileToast.jsx
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TetrisPiece from './TetrisPiece';

const colorMap = {
  rojo: 'from-red-600 to-red-800',
  azul: 'from-blue-600 to-blue-800',
  verde: 'from-green-600 to-green-800',
  naranja: 'from-orange-500 to-orange-700',
  gris: 'from-gray-500 to-gray-700',
};


const TileToast = ({ tile, tipo = 'add', onClose }) => {
  if (!tile?.runa) return null;
  const { translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const mensaje = tipo === 'remove'
    ? `−1 ${ti.rune}: ${ti.colores[tile.runa]}`
    : tipo === 'show'
    ? `🔮 ${ti.manifestar || 'Manifestar'}: ${ti.colores[tile.runa]}`
    : `+1 ${ti.rune}: ${ti.colores[tile.runa]}`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-lg shadow-xl text-white bg-gradient-to-r ${colorMap[tile.runa]} animate-pulse border-2 border-white`}
    >
      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-white hover:text-gray-200"
        title="Cerrar"
      >
        <IoClose size={18} />
      </button>

      {/* Texto del mensaje */}
      <div className="text-xs font-bold mb-1">{mensaje}</div>

      {/* Pieza Tetris */}
      <TetrisPiece type={tile.dibujo} color="text-white" />
    </div>
  );
};

export default TileToast;
