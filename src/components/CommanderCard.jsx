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
  const capacidad = ta.capacidad?.[carta.id]?.replace('{X}', numRunasColor) || carta.capacidad;

  return (
    <div className="relative w-full max-w-[140px] bg-orange-800 p-2 rounded-lg border-2 border-yellow-400 shadow-md">
      <div className="text-sm text-yellow-300 font-bold text-center mb-1">
        {nombre}
      </div>
      <div className="text-xs text-white text-center whitespace-pre-line">
        {capacidad}
      </div>
    </div>
  );
};

export default CommanderCard;
