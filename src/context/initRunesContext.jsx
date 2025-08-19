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
      alert(t.RuneRepeat || `Ya existe una carta de runa con ID ${rune.id}`);
      return;
    }
  
    const isDefensa = rune.tipo === "defensa";
    
    setPlacedRunes(prev => [
      ...prev,
      {
        rune: {
          uuid: uuidv4(),
          ...rune,
          colorIndex: 10, // siempre se colocan en índice 10
          applyEffect: isDefensa ? false : true,
          defenseCounter: isDefensa ? 2 : null, 
        },
      },
    ]);
  };
  
  const removeRuneByUUID = (uuid) => { setPlacedRunes(prev => prev.filter(r => r.rune.uuid !== uuid)); };
  
  const resetPlacedRunes = () => {
    setPlacedRunes([]);
    setExecutedRunes([]); // ✅ también resetear ejecuciones
  };

  const tickDefenseRune = (uuid) => {
    setPlacedRunes(prev =>
      prev.map(item => {
        if (item.rune.uuid !== uuid) return item;
  
        if (item.rune.defenseCounter > 0) {
          // Reducir el contador
          return {
            ...item,
            rune: {
              ...item.rune,
              defenseCounter: item.rune.defenseCounter - 1,
            }
          };
        } else {
          // Si llega a 0 → activar applyEffect
          return {
            ...item,
            rune: {
              ...item.rune,
              defenseCounter: 0,
              applyEffect: true,
            }
          };
        }
      })
    );
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
                                                    

  return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes, tickDefenseRune, toggleRuneEffect, executedRunes, setExecutedRunes }}> {children} </InitRunesContext.Provider> ); 

};

export const useInitRunes = () => useContext(InitRunesContext);

