import React, { createContext, useContext, useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { v4 as uuidv4 } from 'uuid';

const InitRunesContext = createContext();

export const InitRunesProvider = ({ children }) => {
  const [placedRunes, setPlacedRunes] = useState([]);
  const [executedRunes, setExecutedRunes] = useState([]);
  const { translations } = useLanguage();
  const t = translations?.trackerInit || {};

  const placeRune = ({ rune }) => {
    // Verificar si ya existe una carta con el mismo id
    const exists = placedRunes.some((r) => r.rune.id === rune.id);
    if (exists) {
      alert(t.RuneRepeat);
      return;
    }

    setPlacedRunes(prev => [
      ...prev,
      {
        rune: {
          uuid: uuidv4(),
          ...rune,
          colorIndex: 10, // siempre se colocan en índice 10
          applyEffect: true,
        },
      },
    ]);
  };
  
  const removeRuneByUUID = (uuid) => { setPlacedRunes(prev => prev.filter(r => r.rune.uuid !== uuid)); };
  
  const resetPlacedRunes = () => {
    setPlacedRunes([]);
    setExecutedRunes([]); // ✅ también resetear ejecuciones
  };

  const toggleRuneEffect = (uuid) => {
    setPlacedRunes(prev =>
      prev.map(item =>
        item.rune.uuid === uuid
          ? {
              ...item,
              rune: {
                ...item.rune,
                applyEffect: !item.rune.applyEffect
              }
            }
          : item
      )
    );
  };
                                                    

  return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes, toggleRuneEffect, executedRunes, setExecutedRunes }}> {children} </InitRunesContext.Provider> ); 

};

export const useInitRunes = () => useContext(InitRunesContext);

