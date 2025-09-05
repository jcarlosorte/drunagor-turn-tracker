// src/components/CommanderCardModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';

const CommanderCardModal = ({ carta, onClose }) => {
  const { translations } = useLanguage();
  const { getRuneCount } = useGame();
  const ta = translations.cartas_ataque || {};
  const ttr = translations.cartas_trad || {};

  const numRunasColor = getRuneCount(carta.rune);
  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  
  let capacidad = ta.capacidad?.[carta.id] || carta.capacidad;

  const estadoEscudo = capacidad.find(e => e.id === "ESCUDO");
  console.log(estadoEscudo.count);
  
  if (capacidad) {
    capacidad = capacidad
      .replaceAll('{X}', numRunasColor)
      .replaceAll('{2*X}', numRunasColor * 2)
      .replaceAll('{3*X}', numRunasColor * 3)
      .replaceAll('{4*X}', numRunasColor * 4)
      .replaceAll('{ESCUDO}', ttr.ESCUDO)
      .replaceAll('{SANA}', ttr.SANA);
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-orange-900 text-white p-6 rounded-lg max-w-sm border-2 border-yellow-400 shadow-xl relative" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-sm bg-red-500 hover:bg-red-600 px-2 rounded"
        >
          ✕
        </button>
        <div className="text-lg text-yellow-300 text-center mb-2">
          {nombre}
        </div>
        <div className="text-sm whitespace-pre-line text-center leading-tight">
          {capacidad}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommanderCardModal;
