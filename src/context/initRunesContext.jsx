import React, { createContext, useContext, useState } from 'react'; import { v4 as uuidv4 } from 'uuid';

const InitRunesContext = createContext();

export const InitRunesProvider = ({ children }) => { const [placedRunes, setPlacedRunes] = useState([]);

const placeRune = ({ rune }) => { const colorIndex = parseInt(rune.id.replace('runa', '')); setPlacedRunes(prev => [ ...prev, { rune: { uuid: uuidv4(), ...rune, colorIndex, }, } ]); };

const removeRuneByUUID = (uuid) => { setPlacedRunes(prev => prev.filter(r => r.rune.uuid !== uuid)); };

const resetPlacedRunes = () => { setPlacedRunes([]); };

return ( <InitRunesContext.Provider value={{ placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes }}> {children} </InitRunesContext.Provider> ); };

export const useInitRunes = () => useContext(InitRunesContext);

