import { createContext, useState } from "react";

export const ExpansionContext = createContext();

export function ExpansionProvider({ children }) {
  const [selectedExpansions, setSelectedExpansions] = useState([]);

  const toggleExpansion = (id) => {
    setSelectedExpansions(prev =>
      prev.includes(id) ? prev.filter(exp => exp !== id) : [...prev, id]
    );
  };

  return (
    <ExpansionContext.Provider value={{ selectedExpansions, toggleExpansion }}>
      {children}
    </ExpansionContext.Provider>
  );
}
