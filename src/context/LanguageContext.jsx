import { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLang = localStorage.getItem('lang') || 'es';
  const [language, setLanguage] = useState(storedLang);
  const [translations, setTranslations] = useState(languages[storedLang]);

  useEffect(() => {
    localStorage.setItem('lang', language);
    setTranslations(languages[language]);

    // Cambiar atributo lang del <html>
    document.documentElement.lang = language;

    // Cambiar el título del documento si está definido en los textos
    const newTitle = languages[language]?.home?.title || 'Drunagor Turn Tracker';
    document.title = newTitle;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
