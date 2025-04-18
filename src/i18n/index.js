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
