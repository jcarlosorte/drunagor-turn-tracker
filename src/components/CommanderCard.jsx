// src/components/CommanderCard.jsx
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';

const CommanderCard = ({ carta }) => {
  const { translations } = useLanguage();
  const { getRuneCount } = useGame();
  const ta = translations.cartas_ataque || {};

  const runa = carta.rune;
  const numRunasColor = getRuneCount(runa);
  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  let capacidad = ta.capacidad?.[carta.id] || carta.capacidad;

    // Reemplazar múltiples ocurrencias
  if (capacidad) {
    capacidad = capacidad
      .replaceAll('{X}', numRunasColor)
      .replaceAll('{2*X}', numRunasColor * 2)
  }
  
  return (
    <div className="relative w-full max-w-[140px] bg-orange-800 p-2 rounded-lg border-2 border-yellow-400 shadow-md" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }} >
      <div className="text-sm text-yellow-300 text-center mb-1">
        {nombre}
      </div>
      <div className="text-[0.6rem] text-white text-center whitespace-pre-line leading-tight"
        style={{ fontFamily: 'Impact, Charcoal, sans-serif' }} >
        {capacidad}
      </div>
    </div>
  );
};

export default CommanderCard;
