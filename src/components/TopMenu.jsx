// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { MdAddCircleOutline } from 'react-icons/md';

import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { useLanguage } from "@/context/LanguageContext";

const TopMenu = ({
  onAddEnemy,
  onSelectCommander,
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
    if (!value) return;
  
    if (value === 'comandante') {
      // Ejecuta selección aleatoria de comandante por color (puedes añadir un prompt o color fijo si quieres)
      onSelectCommander(); // 👈 aquí eliges el color que quieras por defecto o...
      // Mejor: podrías abrir otro select para que elija color del comandante.
    } else {
      onAddEnemy(value); // blanco, gris, negro normales van por categoría
    }
  
    e.target.value = '';
  };


  const handleManualSelect = (e) => {
    const value = e.target.value;
    if (value) {
      onAddManual(value);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto">
        <div className="w-196">
          <button
            onClick={toggleMenu}
            className="bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            <AiOutlineMenu size={24} />
          </button>
        </div>

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4 pt-2 flex flex-col gap-4 text-white"
          >
            {/* Aleatorios */}
            <div className="flex items-center gap-2">
              <GiSwordClash className="text-blue-400" />
              <label htmlFor="enemySelect">{t.addEnemies || 'Añadir enemigos'}:</label>
              <select
                id="enemySelect"
                onChange={handleEnemySelect}
                className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 font-fantasy"
                defaultValue=""
              >
                <option value="" disabled>{t.selectType || 'Selecciona tipo'}</option>
                <option value="blanco">⚪ {t.addWhiteEnemies || 'Enemigos Blancos'}</option>
                <option value="gris">⚙️ {t.addGrayEnemies || 'Enemigos Grises'}</option>
                <option value="negro">⚫ {t.addBlackEnemies || 'Enemigos Negros'}</option>
                <option value="comandante">🎖️ {t.addCommanders || 'Comandantes'}</option>
              </select>
            </div>

            {/* Manuales */}
            <div className="flex items-center gap-2">
              <MdAddCircleOutline className="text-purple-400" />
              <label htmlFor="manualSelect">{t.addManualEnemy || 'Enemigos Manuales'}:</label>
              <select
                id="manualSelect"
                onChange={handleManualSelect}
                className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 font-fantasy"
                defaultValue=""
              >
                <option value="" disabled>{t.selectType || 'Selecciona tipo'}</option>
                <option value="blanco">⚪ {t.addWhiteEnemies || 'Enemigos Blancos'}</option>
                <option value="gris">⚙️ {t.addGrayEnemies || 'Enemigos Grises'}</option>
                <option value="negro">⚫ {t.addBlackEnemies || 'Enemigos Negros'}</option>
                <option value="comandante">🎖️ {t.addCommanders || 'Comandantes'}</option>
                <option value="jefe"><GiCrownedSkull className="text-yellow-400" /> {t.selectBosses || 'Jefe'}</option>
                <option value="otros"><GiDiceTarget className="text-green-400" /> {t.selectOther || 'Otros'}</option>
                
              </select>
            </div>

            <button
              onClick={toggleMenu}
              className="mx-auto mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
            >
              {t.close || 'Cerrar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopMenu;
