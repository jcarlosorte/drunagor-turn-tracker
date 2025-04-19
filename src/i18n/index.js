import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './es.json';
import en from './en.json';

export const languages = {
  es,
  en
};

export const availableLanguages = Object.keys(languages);

export const languageNames = {
  es: es.language_name,
  en: en.language_name,
};

// Inicialización de i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;