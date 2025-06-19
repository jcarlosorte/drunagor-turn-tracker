// src/components/CommanderCard.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CommanderCardModal from '@/components/CommanderCardModal';

const CommanderCard = ({ carta }) => {
  const { translations } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [highlight, setHighlight] = useState(carta.highlight || false);
  const ta = translations.cartas_ataque || {};

  const nombre = ta.nombre?.[carta.id] || carta.nombre;

  // ⚡ Quitar highlight tras 1.5s
  useEffect(() => {
    if (highlight) {
      const timeout = setTimeout(() => setHighlight(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [highlight]);

  // 🎨 Clases visuales condicionales por tipo
  const ringClass =
    carta.sourceOverlordId
      ? 'ring-4 ring-purple-500 animate-pulse'
      : carta.sourceCommanderId
      ? 'ring-4 ring-yellow-400 animate-pulse'
      : carta.sourceBossId
      ? 'ring-4 ring-red-500 animate-pulse'
      : '';
  
  return (
    <div className="flex flex-col items-center mx-1">
      <div
        onClick={() => setShowModal(true)}
        className={`cursor-pointer relative w-full max-w-[140px] p-2 rounded-lg border-2 shadow-md hover:scale-105 transition
          ${highlight ? ringClass : 'bg-black border-yellow-400'}`}
      >
        <div
          className="text-sm text-yellow-300 text-center"
          style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}
        >
          {nombre}
        </div>
        <div
          className="text-[0.50rem] italic text-white-300 text-center"
          style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}
        >
          -{ta.ataqueC}-
        </div>
      </div>

      {showModal && (
        <CommanderCardModal carta={carta} onClose={() => setShowModal(false)} />
      )}
   </div>
  );
};

export default CommanderCard;
