// src/components/TileToast.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import TetrisPiece from './TetrisPiece';
import { IoClose } from 'react-icons/io5';

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
    <AnimatePresence>
      <motion.div
        key={tile.uuid}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`relative flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl text-white ${colorMap[tile.runa]} border-4 border-white animate-pulse`}
        style={{
          background: `linear-gradient(45deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2))`,
        }}
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
