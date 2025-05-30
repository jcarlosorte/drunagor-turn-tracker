import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from "@/context/LanguageContext";

const InitRunesContext = createContext();

export const InitRunesProvider = ({ children }) => { 
  const { translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const [placedRunes, setPlacedRunes] = useState([]);

  const placeRune = ({ rune }) => {
    // Verificar si ya existe una carta con el mismo id y cara
    const exists = placedRunes.some(
      (r) => r.rune.id === rune.id
    );
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
        },
      },
    ]);
  };
  
  
  const removeRuneByUUID = (uuid) => { setPlacedRunes(prev => prev.filter(r => r.rune.uuid !== uuid)); };
  
  const resetPlacedRunes = () => { setPlacedRunes([]); };
  
  return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes }}> {children} </InitRunesContext.Provider> ); 

};

export const useInitRunes = () => useContext(InitRunesContext);

