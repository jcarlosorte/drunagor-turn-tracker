// src/components/TileToast.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import TetrisPiece from './TetrisPiece';
import { IoClose } from 'react-icons/io5';

const colorMap = {
  rojo: 'bg-red-600',
  azul: 'bg-blue-600',
  verde: 'bg-green-600',
  naranja: 'bg-orange-500',
  gris: 'bg-gray-500',
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
    <AnimatePresence>
      <motion.div
        key={tile.uuid}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`relative flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl text-white ${colorMap[tile.runa]} border-4 border-white animate-pulse`}

      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
        >
          <IoClose className="text-white text-lg" />
        </button>

        <div className="text-xs font-bold mb-2">{mensaje}</div>
        <TetrisPiece type={tile.dibujo} color="text-white" />
      </motion.div>
    </AnimatePresence>
  );
};

export default TileToast;
