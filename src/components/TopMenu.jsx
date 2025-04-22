// src/components/TopMenu.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function TopMenu({ onAddEnemy, onSelectBoss, onSelectOther, onAddManual }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition"
      >
        {showMenu ? "Ocultar menú" : "Mostrar menú"}
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md p-4 w-96">
          {/* Submenús */}
          <Dropdown label="Añadir enemigo por color">
            <MenuItem onClick={() => onAddEnemy("white")}>Enemigo Blanco</MenuItem>
            <MenuItem onClick={() => onAddEnemy("gray")}>Enemigo Gris</MenuItem>
            <MenuItem onClick={() => onAddEnemy("black")}>Enemigo Negro</MenuItem>
            <MenuItem onClick={() => onAddEnemy("commander")}>Comandante</MenuItem>
          </Dropdown>

          <Dropdown label="Seleccionar jefes">
            <MenuItem onClick={onSelectBoss}>Seleccionar Jefes</MenuItem>
          </Dropdown>

          <Dropdown label="Otros (héroes enemigos, compañeros...)">
            <MenuItem onClick={onSelectOther}>Seleccionar Otros</MenuItem>
          </Dropdown>

          <Dropdown label="Añadir enemigo manualmente">
            <MenuItem onClick={onAddManual}>Seleccionar de la lista</MenuItem>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-between w-full bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 transition"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="ml-2 mt-1">{children}</div>}
    </div>
  );
}

function MenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-3 py-1 hover:bg-gray-50 rounded"
    >
      {children}
    </button>
  );
}
