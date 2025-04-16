import { createContext, useContext, useState, useEffect } from 'react';
import { EXPANSIONS } from '../data/expansions';

const ExpansionsContext = createContext();

export const ExpansionsProvider = ({ children }) => {
  const stored = localStorage.getItem('expansions');
  const [selectedExpansions, setSelectedExpansions] = useState(
    stored ? JSON.parse(stored) : EXPANSIONS.map(e => e.id)
  );

  useEffect(() => {
    localStorage.setItem('expansions', JSON.stringify(selectedExpansions));
  }, [selectedExpansions]);

  const toggleExpansion = (id) => {
    setSelectedExpansions((prev) =>
      prev.includes(id)
        ? prev.filter((expId) => expId !== id)
        : [...prev, id]
    );
  };

  return (
    <ExpansionsContext.Provider value={{ selectedExpansions, toggleExpansion }}>
      {children}
    </ExpansionsContext.Provider>
  );
};

export const useExpansions = () => useContext(ExpansionsContext);
