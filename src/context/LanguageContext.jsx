import { createContext, useContext, useState, useEffect } from 'react';
import { translationsByLang } from '../i18n/languageData';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLang = localStorage.getItem('lang') || 'es';
  const [language, setLanguage] = useState(storedLang);
  const [translations, setTranslations] = useState(languages[storedLang]);

  useEffect(() => {
    localStorage.setItem('lang', language);
    setTranslations(translationsByLang[language]);

    // Cambiar atributo lang del <html>
    document.documentElement.lang = language;

    // Cambiar el título del documento si está definido en los textos
    const newTitle = translationsByLang[language]?.home?.title || 'Drunagor Turn Tracker';
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
