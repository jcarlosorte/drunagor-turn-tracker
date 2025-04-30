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
  const t = translations?.trackerInit || {};

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleEnemySelect = (e) => {
    const value = e.target.value;
    if (value) {
      onAddEnemy(value);
      e.target.value = ''; // Reinicia el select tras seleccionar
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto">
        <button
          onClick={toggleMenu}
          className="bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
        >
          <AiOutlineMenu size={24} />
        </button>

        <div className="text-white font-bold text-lg">
          Drunagor Tracker
        </div>

        <div className="flex items-center gap-2 text-white text-sm">
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
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 flex flex-wrap justify-center items-center gap-4 text-white">
          {/* 🔘 Selector combinado de enemigos */}
          <div className="flex items-center gap-2">
            <GiSwordClash className="text-blue-400" />
            <label htmlFor="enemySelect">{translations.addEnemies || 'Añadir enemigos'}:</label>
            <select
              id="enemySelect"
              onChange={handleEnemySelect}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
              defaultValue=""
            >
              <option value="" disabled>{translations.selectType || 'Selecciona tipo'}</option>
              <option value="blanco">{translations.addWhiteEnemies || 'Enemigos Blancos'}</option>
              <option value="gris">{translations.addGrayEnemies || 'Enemigos Grises'}</option>
              <option value="negro">{translations.addBlackEnemies || 'Enemigos Negros'}</option>
              <option value="comandante">{translations.addCommanders || 'Comandantes'}</option>
            </select>
          </div>

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

          <button
            onClick={toggleMenu}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
          >
            {translations.close || 'Cerrar'}
          </button>
        </div>
      )}
    </div>
  );
};


export default TopMenu;


