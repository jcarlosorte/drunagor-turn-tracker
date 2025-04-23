// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // <-- esta línea es necesaria

const TopMenu2 = ({ onAddEnemy, onSelectBoss, onSelectOther, onAddManual }) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex flex-wrap justify-around rounded-xl mb-4 shadow">
      <button onClick={() => onAddEnemy("white")} className="btn">➕ Enemigo Blanco</button>
      <button onClick={() => onAddEnemy("gray")} className="btn">➕ Enemigo Gris</button>
      <button onClick={() => onAddEnemy("black")} className="btn">➕ Enemigo Negro</button>
      <button onClick={() => onAddEnemy("commander")} className="btn">➕ Comandante</button>
      <button onClick={onSelectBoss} className="btn">👑 Jefes</button>
      <button onClick={onSelectOther} className="btn">🔄 Otros</button>
      <button onClick={onAddManual} className="btn">✍️ Manual</button>
    </div>
  );
};

const TopMenu = ({
  onAddEnemy,
  onSelectBoss,
  onSelectOther,
  onAddManual,
  translations,
  onLanguageChange,   // ⬅️ nueva prop
  currentLanguage,    // ⬅️ opcional, para mostrar el idioma actual
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="menu-container">
      <button onClick={toggleMenu} className="menu-toggle">
        {/* Icono del menú */}
        <AiOutlineMenu size={30} />
      </button>

      {isOpen && (
        <div className="menu">
          <button className="menu-item" onClick={() => onAddEnemy('white')}>
            {translations.addWhiteEnemies || 'Añadir Enemigos Blancos'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('gray')}>
            {translations.addGrayEnemies || 'Añadir Enemigos Grises'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('black')}>
            {translations.addBlackEnemies || 'Añadir Enemigos Negros'}
          </button>
          <button className="menu-item" onClick={() => onAddEnemy('commander')}>
            {translations.addCommanders || 'Añadir Comandantes'}
          </button>
          <button className="menu-item" onClick={onSelectBoss}>
            {translations.selectBosses || 'Seleccionar Jefes'}
          </button>
          <button className="menu-item" onClick={onSelectOther}>
            {translations.selectOther || 'Seleccionar Otros'}
          </button>
          <button className="menu-item" onClick={onAddManual}>
            {translations.addManualEnemy || 'Añadir Enemigos Manuales'}
          </button>

           {/* 🌐 Selector de idioma */}
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="lang" className="text-sm">
              {translations.language || 'Idioma'}:
            </label>
            <select
              id="lang"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default TopMenu;
