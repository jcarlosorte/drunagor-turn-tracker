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
  
  if (capacidad) {
    // 1. Sustituimos valores numéricos dinámicos
    capacidad = capacidad
      .replaceAll('{X}', numRunasColor)
      .replaceAll('{2*X}', numRunasColor * 2)
      .replaceAll('{3*X}', numRunasColor * 3)
      .replaceAll('{4*X}', numRunasColor * 4);
  
    // 2. Buscamos todas las palabras entre {}
    const regex = /\{([^}]+)\}/g;
    const partes = [];
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(capacidad)) !== null) {
      const [fullMatch, key] = match;
      const start = match.index;
  
      // Ignorar las que tienen X (ya procesadas antes)
      if (!key.includes('X')) {
        // Agregar texto antes de la llave
        if (start > lastIndex) {
          partes.push(capacidad.substring(lastIndex, start));
        }
  
        // Traducción desde ttr si existe, sino deja la original
        const traduccion = ttr[key] || key;
        
        // Agregar el span con estilo especial
        partes.push(
          <span key={start} className="text-blue-400 font-bold">
            { traduccion }
          </span>
        );
  
        lastIndex = start + fullMatch.length;
      }
    }
  
    // Agregar el resto del texto después de la última llave
    if (lastIndex < capacidad.length) {
      partes.push(capacidad.substring(lastIndex));
    }
  
    const finalPartes = [];
    partes.forEach((parte, i) => {
      if (typeof parte === 'string') {
        const frases = parte.split('.');
        frases.forEach((frase, idx) => {
          if (frase.trim() !== '.') {
            finalPartes.push(frase.trim());
          }
          if (idx < frases.length - 1) {
            finalPartes.push(<br key={`br-${i}-${idx}`} />);
          }
        });
      } else {
        // Si es un span, simplemente lo agregamos
        finalPartes.push(parte);
      }
    });
  
    capacidad = finalPartes;
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
        
      </div>
      <div className="text-sm whitespace-pre-line text-center leading-tight">
          {capacidad}
        </div>
    </div>,
    document.body
  );
};

export default CommanderCardModal;
