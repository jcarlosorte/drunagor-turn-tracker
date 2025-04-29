// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import { MdAddCircleOutline } from 'react-icons/md';

import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { useLanguage } from "@/context/LanguageContext";

const TopMenu = ({
  onAddEnemy,
  onSelectBoss,
  onSelectOther,
  onAddManual,
  behaviors
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, translations } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-screen-xl">
      <div className="flex justify-center mt-2">
        <button
          onClick={toggleMenu}
          className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-2 rounded-full shadow-md text-white hover:bg-opacity-90 transition"
        >
          <AiOutlineMenu size={28} />
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 px-4 py-3 bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-b-2xl shadow-xl flex flex-row flex-wrap justify-center gap-4 items-center text-white">
          <button className="flex items-center gap-1 text-sm hover:text-blue-300" onClick={() => onAddEnemy('blanco')}>
            <GiSwordClash className="text-blue-400" />
            {translations.addWhiteEnemies || 'Enemigos Blancos'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-gray-300" onClick={() => onAddEnemy('gris')}>
            <GiSwordClash className="text-gray-400" />
            {translations.addGrayEnemies || 'Enemigos Grises'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-black" onClick={() => onAddEnemy('negro')}>
            <GiSwordClash className="text-black" />
            {translations.addBlackEnemies || 'Enemigos Negros'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-red-300" onClick={() => onAddEnemy('comandante')}>
            <BsPeopleFill className="text-red-400" />
            {translations.addCommanders || 'Comandantes'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-yellow-300" onClick={onSelectBoss}>
            <GiCrownedSkull className="text-yellow-400" />
            {translations.selectBosses || 'Jefes'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-green-300" onClick={onSelectOther}>
            <GiDiceTarget className="text-green-400" />
            {translations.selectOther || 'Otros'}
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-purple-300" onClick={onAddManual}>
            <MdAddCircleOutline className="text-purple-400" />
            {translations.addManualEnemy || 'Enemigos Manuales'}
          </button>

          {/* 🌐 Selector de idioma */}
          <div className="flex items-center gap-2 text-sm">
            <FaLanguage className="text-blue-300" />
            <label htmlFor="lang">{translations.language || 'Idioma'}:</label>
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

          {/* ❌ Botón para cerrar */}
          <button
            onClick={toggleMenu}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm ml-4"
          >
            {translations.close || 'Cerrar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopMenu;


