// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget, GiDeathSkull } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import { MdAddCircleOutline } from 'react-icons/md';

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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={toggleMenu}
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-2 rounded-full shadow-md text-white hover:bg-opacity-90 transition"
      >
        <AiOutlineMenu size={28} />
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col gap-2 items-center text-white min-w-[280px]">
          <button className="menu-item" onClick={() => onAddEnemy('blanco')}>
            <GiSwordClash className="inline-block mr-2 text-blue-400" />
            {translations.addWhiteEnemies || 'Añadir Enemigos Blancos'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('gris')}>
            <GiSwordClash className="inline-block mr-2 text-gray-400" />
            {translations.addGrayEnemies || 'Añadir Enemigos Grises'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('negro')}>
            <GiSwordClash className="inline-block mr-2 text-black" />
            {translations.addBlackEnemies || 'Añadir Enemigos Negros'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('comandante')}>
            <BsPeopleFill className="inline-block mr-2 text-red-400" />
            {translations.addCommanders || 'Añadir Comandantes'}
          </button>
          <button className="menu-item" onClick={onSelectBoss}>
            <GiCrownedSkull className="inline-block mr-2 text-yellow-400" />
            {translations.selectBosses || 'Seleccionar Jefes'}
          </button>
          <button className="menu-item" onClick={onSelectOther}>
            <GiDiceTarget className="inline-block mr-2 text-green-400" />
            {translations.selectOther || 'Seleccionar Otros'}
          </button>
          <button className="menu-item" onClick={onAddManual}>
            <MdAddCircleOutline className="inline-block mr-2 text-purple-400" />
            {translations.addManualEnemy || 'Añadir Enemigos Manuales'}
          </button>

          {/* 🌐 Selector de idioma */}
          <div className="flex items-center gap-2 mt-3">
            <FaLanguage className="text-blue-300" />
            <label htmlFor="lang" className="text-sm">
              {translations.language || 'Idioma'}:
            </label>
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

          {/* Botón para cerrar el menú */}
          <button
            onClick={toggleMenu}
            className="mt-4 px-3 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
          >
            {translations.close || 'Cerrar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopMenu;

