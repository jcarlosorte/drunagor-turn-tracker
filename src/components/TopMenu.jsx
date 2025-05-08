// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget, GiShield, GiDaemonSkull, GiBullyMinion } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { MdAddCircleOutline } from 'react-icons/md';
import { useInitEnemies } from "@/context/InitEnemiesContext";
import {  } from 'react-icons/gi';

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
  const { resetPlacedEnemies } = useInitEnemies();
  const [enemySelect, setEnemySelect] = useState('');
  const [manualSelect, setManualSelect] = useState('');
  
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
  
    setEnemySelect(''); // resetear
  };


  const handleManualSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
  
    if (value === 'jefe') {
      onSelectBoss();
    } else if (value === 'otros') {
      onSelectOther();
    } else {
      onAddManual(value);
    }
  
    setManualSelect('');
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
            <div className="bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <GiSwordClash className="text-blue-400 text-xl" />
                <span className="font-semibold">{t.addEnemies || 'Enemigos aleatorios'}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                  { key: 'gris', label: t.addGrayEnemies, color: 'text-gray-400' },
                  { key: 'negro', label: t.addBlackEnemies, color: 'text-black bg-white rounded' },
                  { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setEnemySelect(key);
                      handleEnemySelect({ target: { value: key } });
                    }}
                    className={`flex flex-col items-center gap-1 px-2 py-2 text-sm rounded-lg font-semibold hover:bg-blue-500 transition ${
                      enemySelect === key ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <GiBullyMinion className={`text-2xl ${color}`} />
                    <span className="text-xs text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manuales */}
            <div className="bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <MdAddCircleOutline className="text-purple-400 text-xl" />
                <span className="font-semibold">{t.addManualEnemy || 'Enemigos manuales'}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                  { key: 'gris', label: t.addGrayEnemies, color: 'text-gray-400' },
                  { key: 'negro', label: t.addBlackEnemies, color: 'text-black bg-white rounded' },
                  { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                  { key: 'jefe', label: t.selectBosses, color: 'text-red-500' },
                  { key: 'otros', label: t.selectOther, color: 'text-purple-500' },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setManualSelect(key);
                      handleManualSelect({ target: { value: key } });
                    }}
                    className={`flex flex-col items-center gap-1 px-2 py-2 text-sm rounded-lg font-semibold hover:bg-purple-500 transition ${
                      manualSelect === key ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                  >
                    <GiBullyMinion className={`text-2xl ${color}`} />
                    <span className="text-xs text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={resetPlacedEnemies}
                className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-full text-sm"
              >
                {t.resetEnemies || 'Resetear enemigos'}
              </button>
            
              <button
                onClick={toggleMenu}
                className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
              >
                {t.close || 'Cerrar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopMenu;

