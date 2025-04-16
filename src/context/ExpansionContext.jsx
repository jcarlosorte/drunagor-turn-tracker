// src/context/ExpansionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { EXPANSIONS } from '../data/expansions';

const ExpansionContext = createContext();

export const ExpansionProvider = ({ children }) => {
  const stored = localStorage.getItem('expansions');
  const [selectedExpansions, setSelectedExpansions] = useState(
    stored ? JSON.parse(stored) : EXPANSIONS.map(e => e.id)
  );

  useEffect(() => {
    localStorage.setItem('expansions', JSON.stringify(selectedExpansions));
  }, [selectedExpansions]);

  const toggleExpansion = (id) => {
    setSelectedExpansions(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const clearExpansions = () => setSelectedExpansions([]);

  return (
    <ExpansionContext.Provider value={{ selectedExpansions, toggleExpansion, clearExpansions }}>
      {children}
    </ExpansionContext.Provider>
  );
};

export const useExpansions = () => useContext(ExpansionContext);
export { ExpansionContext };
