import { createContext, useContext, useState, useEffect } from 'react';
import { availableLanguages } from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLang = localStorage.getItem('lang') || 'es';
  const [language, setLanguage] = useState(storedLang);
  const [translations, setTranslations] = useState(languages[storedLang]);

  useEffect(() => {
    localStorage.setItem('lang', language);
    setTranslations(languages[language]);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
