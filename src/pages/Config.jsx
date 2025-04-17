// src/pages/Config.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "@/context/LanguageContext"; 
import ExpansionContext from "@/context/ExpansionContext";
import { translations } from "@/i18n/translations";
import { EXPANSIONS } from "@/data/expansions";

const availableLanguages = ["es", "en"]; // se puede ampliar más adelante

export default function Config() {
  const navigate = useNavigate();
  
  const { language, setLanguage } = useContext(LanguageContext);
  const { selectedExpansions, toggleExpansion } = useContext(ExpansionContext);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{translations[language].config_title}</h1>

      {/* Selector de idioma */}
      <div className="mb-6">
        <label className="block mb-2">{translations[language].select_language}</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-black px-2 py-1 rounded"
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {translations[lang].language_name}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de expansiones */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{translations[language].select_expansions}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {EXPANSIONS.map((exp) => (
            <div key={exp.id} className="border rounded p-2 bg-zinc-800">
              <img src={exp.imagen} alt={exp.nombre} className="w-full h-32 object-cover rounded" />
              <div className="flex items-center justify-between mt-2">
                <span>{exp.nombre}</span>
                <input
                  type="checkbox"
                  checked={selectedExpansions.includes(exp.id)}
                  onChange={() => toggleExpansion(exp.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
       <button
        onClick={() => navigate('/')}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Volver al Menú Principal
      </button>
    </div>
  );
}
