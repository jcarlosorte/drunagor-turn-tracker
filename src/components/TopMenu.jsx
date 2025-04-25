// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai';
import { GiBattleAxe, GiBossKey, GiSpellBook, GiScrollUnfurled } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { useLanguage } from "@/context/LanguageContext";

const TopMenu = ({
  onAddEnemy,
  onSelectBoss,
  onSelectOther,
  onAddManual
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, translations } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMenu}
        className="p-2 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-full text-white shadow-lg hover:bg-opacity-90 transition"
        title={translations.toggleMenu || 'Abrir menú'}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 w-64 bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl flex flex-col gap-3 text-white border border-gray-700">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-white"
            onClick={() => onAddEnemy('blanco')}
          >
            <GiBattleAxe className="text-white" />
            {translations.addWhiteEnemies || 'Añadir Enemigos Blancos'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-gray-300"
            onClick={() => onAddEnemy('gris')}
          >
            <GiBattleAxe className="text-gray-300" />
            {translations.addGrayEnemies || 'Añadir Enemigos Grises'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-gray-500"
            onClick={() => onAddEnemy('negro')}
          >
            <GiBattleAxe className="text-gray-500" />
            {translations.addBlackEnemies || 'Añadir Enemigos Negros'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-red-400"
            onClick={() => onAddEnemy('comandante')}
          >
            <GiScrollUnfurled className="text-red-400" />
            {translations.addCommanders || 'Añadir Comandantes'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-yellow-400"
            onClick={onSelectBoss}
          >
            <GiBossKey className="text-yellow-400" />
            {translations.selectBosses || 'Seleccionar Jefes'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-purple-300"
            onClick={onSelectOther}
          >
            <GiSpellBook className="text-purple-300" />
            {translations.selectOther || 'Seleccionar Otros'}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-green-300"
            onClick={onAddManual}
          >
            <AiOutlinePlusCircle className="text-green-300" />
            {translations.addManualEnemy || 'Añadir Enemigos Manuales'}
          </button>

          {/* 🌐 Selector de idioma */}
          <div className="flex items-center gap-2 mt-3 text-sm">
            <FaLanguage className="text-blue-400" />
            <label htmlFor="lang" className="whitespace-nowrap">
              {translations.language || 'Idioma'}:
            </label>
            <select
              id="lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 ml-auto"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {languageNames[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopMenu;

