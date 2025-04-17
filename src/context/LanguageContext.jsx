import { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  const translations = languages[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}
