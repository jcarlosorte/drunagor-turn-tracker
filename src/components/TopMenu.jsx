// src/components/TopMenu.jsx
import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // <-- esta línea es necesaria


const TopMenu = ({ onAddEnemy, onSelectBoss, onSelectOther, onAddManual, translations }) => {
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
        </div>
      )}
    </div>
  );
};

export default TopMenu;
