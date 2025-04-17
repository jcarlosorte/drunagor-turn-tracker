// src/pages/Config.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useExpansions } from "@/context/ExpansionContext";
import { availableLanguages, languageNames } from "@/i18n";
import { EXPANSIONS } from "@/data/expansions";

export default function Config() {
  const navigate = useNavigate();
  const { language, setLanguage, translations } = useLanguage();
  const { selectedExpansions, toggleExpansion } = useExpansions();

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{translations.config.title}</h1>

      {/* Selector de idioma */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{translations.config.language_section_title}</h2>
        <label className="block mb-2">{translations.config.select_language}</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            {availableLanguages.map((l) => (
              <option key={l} value={l}>
                {languageNames[l]}
              </option>
            ))}
          </select>
      </div>

      {/* Selección de expansiones */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{translations.config.select_expansions}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {EXPANSIONS.map((exp) => (
            <div key={exp.id} className="border rounded p-2 bg-zinc-800">
              <img
                src={exp.imagen}
                alt={exp.nombre}
                className="w-full h-32 object-cover rounded"
              />
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
        onClick={() => navigate("/", { replace: true })}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        ← {translations.home}
      </button>
    </div>
  );
}
