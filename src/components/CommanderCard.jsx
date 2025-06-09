// src/components/CommanderCard.jsx
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CommanderCardModal from '@/components/CommanderCardModal';

const CommanderCard = ({ carta }) => {
  const { translations } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const ta = translations.cartas_ataque || {};

  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  
  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer relative w-full bg-black p-2 rounded-lg border-2 border-yellow-400 shadow-md hover:scale-105 transition"
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
    </>
  );
};

export default CommanderCard;
