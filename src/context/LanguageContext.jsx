import { createContext, useContext, useState, useEffect } from 'react';
import es from '../i18n/es';

const languages = {
  es,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLang = localStorage.getItem('lang') || 'es';
  const [lang, setLang] = useState(storedLang);
  const [texts, setTexts] = useState(languages[storedLang]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    setTexts(languages[lang]);
    console.log('[LanguageContext] Idioma actual:', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, texts }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
