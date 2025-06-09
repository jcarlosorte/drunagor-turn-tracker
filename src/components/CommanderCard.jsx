// src/components/CommanderCard.jsx
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CommanderCardModal from '@/components/CommanderCardModal';
import { useGame } from '@/context/GameContext';

const CommanderCard = ({ carta }) => {
  const { translations } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const ta = translations.cartas_ataque || {};

  const nombre = ta.nombre?.[carta.id] || carta.nombre;
  
  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer relative w-full max-w-[140px] bg-orange-800 p-2 rounded-lg border-2 border-yellow-400 shadow-md hover:scale-105 transition"
      >
        <div
          className="text-sm text-yellow-300 font-bold text-center"
          style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}
        >
          {nombre}
        </div>
      </div>

      {showModal && (
        <CommanderCardModal carta={carta} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CommanderCard;
