// src/pages/Config.jsx
import { useState, useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { ExpansionContext } from "@/context/ExpansionContext";
import { translations } from "@/i18n/translations";

const availableLanguages = ["es", "en"]; // se puede ampliar más adelante

const expansions = [
  {
    id: "base",
    nombre: "Crónicas de Drunagor (Juego Base)",
    imagen: "/assets/expansions/base.jpg",
    añade: "ambos",
  },
  {
    id: "luccanor",
    nombre: "La Ruina de Luccanor",
    imagen: "/assets/expansions/luccanor.jpg",
    añade: "ambos",
  },
  {
    id: "dragon",
    nombre: "El ascenso del Dragón no muerto",
    imagen: "/assets/expansions/dragon.jpg",
    añade: "enemigos",
  },
  {
    id: "desierto",
    nombre: "Desierto Avernal",
    imagen: "/assets/expansions/desierto.jpg",
    añade: "ambos",
  },
  {
    id: "mundo-sombrio",
    nombre: "El Mundo Sombrío",
    imagen: "/assets/expansions/mundo-sombrio.jpg",
    añade: "ambos",
  },
  {
    id: "handuriel",
    nombre: "Handuriel",
    imagen: "/assets/expansions/handuriel.jpg",
    añade: "héroes",
  },
  {
    id: "Ira",
    nombre: "Señor de la Ira",
    imagen: "/assets/expansions/Ira.jpg",
    añade: "héroes",
  },
  {
    id: "monstruos1",
    nombre: "Pack de Monstruos Nº1",
    imagen: "/assets/expansions/monstruos1.jpg",
    añade: "enemigos",
  },
  {
    id: "botines",
    nombre: "Botines de Guerra",
    imagen: "/assets/expansions/botines.jpg",
    añade: "ambos",
  },
  {
    id: "apocalypse",
    nombre: "Apocalypse Adventures",
    imagen: "/assets/expansions/apocalypse.png",
    añade: "ambos",
  },
  {
    id: "hero-pack",
    nombre: "Hero Pack #1",
    imagen: "/assets/expansions/hero-pack.png",
    añade: "héroes",
  },
  {
    id: "Awakenings",
    nombre: "Apocalypse Awakenings",
    imagen: "/assets/expansions/awakenings.png",
    añade: "ambos",
  },
{
    id: "sisters",
    nombre: "Apocalypse - The Fallen Sisters",
    imagen: "/assets/expansions/sisters.png",
    añade: "enemigos",
  }
];

export default function Config() {
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
          {expansions.map((exp) => (
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
    </div>
  );
}

