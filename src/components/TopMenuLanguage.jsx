import { useLanguage } from "@/context/LanguageContext";
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { FaLanguage } from 'react-icons/fa';

export default function TopMenuLanguage() {
  const { language, setLanguage, translations } = useLanguage();
  const t = translations?.trackerInit || {};
  

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto">
        <div className="text-white font-bold text-lg">
          {t.menu || 'Menú'}
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <FaLanguage className="text-blue-300" />
          <label htmlFor="lang">{t.language || 'Idioma'}:</label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {languageNames[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
