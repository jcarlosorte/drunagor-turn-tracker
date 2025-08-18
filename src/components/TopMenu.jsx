// src/components/TopMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiSwordClash, GiCrownedSkull, GiDiceTarget, GiShield, GiDaemonSkull, GiBullyMinion, GiRuneStone, GiMinions, GiBrickWall, GiCardPlay, GiVillage, GiUprising, GiStoneTower, GiCardDraw, GiCardPick, GiSwapBag, GiTrashCan } from 'react-icons/gi';
import { FaLanguage } from 'react-icons/fa';
import { MdAddCircleOutline } from 'react-icons/md';
import { RUNAS } from '@/data/runas';
import { ENEMIES } from '@/data/enemies';
import { INCURSION } from '@/data/incursion';
import { DEFENSA } from '@/data/defensa';
import { useInitEnemies } from "@/context/InitEnemiesContext";
import { languages as availableLanguages, languageNames } from "@/i18n/languageData";
import { useLanguage } from "@/context/LanguageContext";
import { useGame } from '@/context/GameContext';
import { useInitRunes } from "@/context/InitRunesContext";
import TileToast from '@/components/TileToast';
import { v4 as uuidv4 } from 'uuid';

const TopMenu = ({
  onAddEnemy,
  onSelectCommander,
  onSelectBoss,
  onAddManual,
  behaviors,
  onSelectRuneCard,
  onTileDraw
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const { resetPlacedEnemies } = useInitEnemies();
  const [enemySelect, setEnemySelect] = useState('');
  const [manualSelect, setManualSelect] = useState('');
  const [showRuneFaceOptions, setShowRuneFaceOptions] = useState(false);
  const [isRunesOpen, setIsRunesOpen] = useState(false);
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [showScenarioFaceOptions, setShowScenarioFaceOptions] = useState(false);
  const { runes, addRune, removeRune, getRuneCount, clearRunes, availableTiles, usedTiles, 
         drawTileByColor, drawTilePreviewByColor, drawMultipleTiles, discardedTiles, discardTileByColor, discardTileRandom, restoreDiscardedTile, 
         pilas, setPilas, addNewPila, removeTileFromPila, addRunesCascade,
         pilasConcentrada, setPilasConcentrada, addNewPilaConcentrada, removeTileFromPilaConcentrada, 
         resetTiles, tileWarning, setTileWarning, deleteAvailableTileByColor, deleteAvailableTileRandom, scenarioMonster, 
         setScenarioMonster, setSpawnPoints, spawnPoints, initializeSpawnPoints, removeSpawnPoint, controlPoints, setControlPoints, initializeControlPoints, removeControlPoint, 
         setRuneKeys, runeKeys, initializeRuneKeys, removeRuneKey,
         initializeDecks, drawCardFromDeck, showCardToast } = useGame();
  const { placedRunes, resetPlacedRunes } = useInitRunes();
  const [activeMenu, setActiveMenu] = useState(null); // 'runes' | 'enemies' | 'scenario' | null
  const containerRef = useRef(null);
  const menuRefEnemies = useRef(null);
  const menuRefRunes = useRef(null);
  const menuRefScenario = useRef(null);
  const [tileToasts, setTileToasts] = useState([]);
  const [codigosPilas, setCodigosPilas] = useState({});
  
  const colorMap = {
    rojo: 'bg-red-700 hover:bg-red-600',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'bg-green-700 hover:bg-green-600',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-gray-600 hover:bg-gray-500',
  };

  const toggleMenu = (name) => {
    setActiveMenu(prev => (prev === name ? null : name));
  };

  const showTileToast = (tile, tipo = 'remove') => {
    const uuid = uuidv4();
    const tileWithId = { ...tile, tipo, uuid };
    setTileToasts(prev => [...prev, tileWithId]);
    setTimeout(() => {
      setTileToasts(prev => prev.filter(t => t.uuid !== uuid));
    }, 3000);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
    
  const handleEnemySelect = (e) => {
    const value = e.target.value;
    if (!value) return;
  
    if (value === 'comandante') {
      onSelectCommander(); 
    } else {
      onAddEnemy(value);
    }
  
    setEnemySelect(''); // resetear
  };


  const handleManualSelect = (e) => {
    const value = e.target.value;
    if (!value) return;
  
    if (value === 'jefe') {
      onSelectBoss();
    } else {
      onAddManual(value);
    }
  
    setManualSelect(value);
  };

  const handleCodigoChange = (pilaId, nuevoCodigo) => {
    setCodigosPilas(prev => ({
      ...prev,
      [pilaId]: nuevoCodigo.slice(0, 5)
    }));
  };

  const monstruosUnicos = Array.from(
    new Map(
      ENEMIES
        .filter(e => e.scenario === "escenario")
        .map(m => [m.id, m])
    ).values()
  );

  const handleSelectUniqueCard = (card) => {
    const tipo = card.tipo;
  
    // ✅ Comprobar si ya existe una carta de este tipo
    const yaExiste = placedRunes.some(r => r.rune.tipo === tipo);
  
    if (yaExiste) {
      alert(`Ya hay una carta de tipo ${tipo} en juego. Solo puede haber una.`);
      return;
    }
  
    // ✅ Si no existe, la añadimos
    onSelectRuneCard(card);
  };
    
  return (
    <>
    <div ref={containerRef} className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleMenu('enemies')} aria-expanded={activeMenu === 'enemies'}
            className="bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            <GiMinions size={24} />
          </button>
          <button
            onClick={() => toggleMenu('runes')} aria-expanded={activeMenu === 'runes'}
            className="bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            <GiRuneStone size={24} />
          </button>
          <button
            onClick={() => toggleMenu('scenario')} aria-expanded={activeMenu === 'scenario'}
            className="bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            <GiVillage size={24} />
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
        {activeMenu === 'enemies' && (
          <motion.div
            ref={menuRefEnemies}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4 pt-2 flex flex-col gap-4 text-white"
          >
            {/* Aleatorios */}
            <div className="bg-gray-800 rounded-lg p-3 shadow-md justify-center">
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
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {[
                  { key: 'esbirro', label: t.addMinionEnemies, color: 'text-cyan-300' },
                  { key: 'blanco', label: t.addWhiteEnemies, color: 'text-white' },
                  { key: 'gris', label: t.addGrayEnemies, color: 'text-gray-400' },
                  { key: 'negro', label: t.addBlackEnemies, color: 'text-black bg-white rounded' },
                  { key: 'comandante', label: t.addCommanders, color: 'text-yellow-500' },
                  { key: 'overlord', label: t.selectOverlord, color: 'text-red-400' },
                  { key: 'jefe', label: t.selectBosses, color: 'text-purple-400' },
                  { key: 'hero', label: t.selectHeroFall, color: 'text-orange-400' },
                  { key: 'escenario', label: t.selectScenario, color: 'text-cyan-600' },
                ].map(({ key, label, color }) => (
                  <React.Fragment key={key}>
                    <button
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
    
                  </React.Fragment>
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
      
      <AnimatePresence>
        {activeMenu === 'runes' && (
          <motion.div
            ref={menuRefRunes}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4 pt-2 flex flex-col gap-4 text-white"
          >
            <div className="flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
             
              <div className="flex flex-col md:flex-row gap-4">
                {/* Añadir Cartas de Runa */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md ">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiCardPlay className="text-indigo-400 text-xl" />
                    <span className="font-semibold">{t.cartas}</span>
                  </div>
          
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        const defaultRunes = RUNAS.filter(r => r.cara === 'A');
                        defaultRunes.forEach(r => handleSelectUniqueCard(r));
                      }}
                      className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                    >
                      {t.addRunes} ({t.caraA})
                    </button>
          
                    <button
                      onClick={() => setShowRuneFaceOptions(prev => !prev)}
                      className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                    >
                      {t.addRunesCara}
                    </button>
                  </div>
          
                  {showRuneFaceOptions && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {RUNAS.map((card, index) => (
                        <button
                          key={`${card.id}-${card.cara}-${index}`}
                          onClick={() => handleSelectUniqueCard(card)}
                          className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                        >
                          {t.cara} ({card.cara})
                        </button>
                      ))}
                    </div>
                  )}
                </div>


                {/* 📦 Estado de la bolsa */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiSwapBag className="text-yellow-300 text-xl" />
                    <span className="font-semibold text-white">
                      {t.estadoBolsa || 'Estado de la Bolsa de Runas'}
                    </span>
                  </div>
                  {/* Estado general */}
                  <div className="text-sm text-white justify-center">
                    {t.extraidas}: <b>{usedTiles.length}</b><br />
                    {t.total}: <b>{availableTiles.length + usedTiles.length}</b>
                  </div>
                  {/* Estado por colores en línea */}
                  <div className="flex items-center gap-2 text-xs justify-center">
                    {[
                      { id: 'naranja', color: '#ff8c00' },
                      { id: 'verde', color: '#00aa00' },
                      { id: 'azul', color: '#0077cc' },
                      { id: 'rojo', color: '#cc0000' },
                      { id: 'gris', color: '#999999' }
                    ].map(({ id, color }) => {
                      const usadasColor = usedTiles.filter(tile => tile.runa === id).length;
                      const disponiblesColor = availableTiles.filter(tile => tile.runa === id).length;
                      return (
                        <div
                          key={id}
                          className="px-2 py-1 rounded font-semibold"
                          style={{ backgroundColor: color, color: 'white' }}
                        >
                          {t.colores[id] || id}: {usadasColor}/{usadasColor + disponiblesColor}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Manifestar Runa */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex flex-row items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-blue-400 text-xl inline-block" />
                    <span className="font-semibold whitespace-nowrap">{t.manifestarTitulo || 'Manifestar Runa'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        const allColors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
                        const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
                        const tile = drawTilePreviewByColor(randomColor);
                    
                        if (tile) {
                          showTileToast(tile, 'show');
                        } else {
                          alert(`${t.aviso2} ${t.colores[randomColor]}`);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      {t.manifestar || 'Manifestar'}
                    </button>
                  </div>
                </div>

              {/* FIN PRIMER BLOQUE */}
              </div>
                
              <div className="flex flex-col md:flex-row gap-4">
                {/* Añadir ficha */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiBrickWall className="text-green-300 text-xl" />
                    <span className="font-semibold">{t.fichas}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const tile = drawTileByColor(color);
                          if (tile && onTileDraw) {
                            //addRune(color); // del GameContext
                            onTileDraw(tile);
                          } else {
                            alert(`${t.aviso2} ${t.colores[color]}`);
                          }
                        }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
    
                    {/* 🟣 Botón de ficha aleatoria */}
                    <button
                      onClick={() => {
                        const allColors = ['naranja', 'verde', 'azul', 'rojo', 'gris'];
                        const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
                        const tile = drawTileByColor(randomColor);
                        if (tile && onTileDraw) {
                          onTileDraw(tile);
                        } else {
                          alert(`${t.aviso2} ${t.colores[randomColor]}`);
                        }
                      }}
                      className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.fichaAleatoria || 'Aleatoria'}
                    </button>
                  </div>
                </div>

                {/* Añadir oscuridad en cascada */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-purple-400 text-xl" />
                    <span className="font-semibold">{t.oscuridadCascada}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[1,2,3,4].map(num => (
                      <button
                        key={num}
                        onClick={() => addRunesCascade(num)}
                        className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-full"
                      >
                        ➕ {num}
                      </button>
                    ))}
                  </div>
                </div>
        
                
                {/* Eliminar ficha */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiBrickWall className="text-red-400 text-xl" />
                    <span className="font-semibold">{t.removeTiles || 'Eliminar fichas de runa'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                            const removed = removeRune(color);
                            if (removed) showTileToast(removed, 'remove');
                            else alert(`${t.noTilesToRemove}`);
                          }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
                
                    {/* ❌ Botón para eliminar una ficha de runa aleatoria */}
                    <button
                      onClick={() => {
                        const colors = ['naranja', 'verde', 'azul', 'rojo', 'gris'].filter(c => runes[c] > 0);
                        if (colors.length === 0) {
                          alert(t.noTilesToRemove || "No hay fichas para eliminar.");
                          return;
                        }
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        const removed = removeRune(randomColor);
                        if (removed && removed.runa) {
                          showTileToast(removed, 'remove');
                        }
                        else {alert(t.noTilesToRemove);}
                        //alert(`${t.removeOneRandom || "Eliminada una ficha de"} ${t.colores[randomColor]}`);
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.removeRandom || 'Aleatoria'}
                    </button>
                  </div>
                </div>

                {/* ❌ Eliminación directa */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiTrashCan className="text-red-400 text-xl" />
                    <span className="font-semibold text-white">
                      {t.eliminarDirecto}
                    </span>
                  </div>
              
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['naranja', 'verde', 'azul', 'rojo', 'gris'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const tile = deleteAvailableTileByColor(color);
                          if (tile) showTileToast(tile, 'remove');
                          else alert(`${t.noTilesToRemove} ${t.colores[color]}`);
                        }}
                        className={`${colorMap[color]} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {t.colores[color]}
                      </button>
                    ))}
              
                     <button
                      onClick={() => {
                        const tile = deleteAvailableTileRandom();
                        if (tile) showTileToast(tile, 'remove');
                        else alert(t.noTilesToRemove || "No hay fichas para eliminar.");
                      }}
                      className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      🎲 {t.removeRandom || 'Aleatoria'}
                    </button>
                  </div>
                </div>
                
              {/* FIN SEGUNDO BLOQUE */}
              </div>

              
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {/* Sub-bloque: Pilas */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiCardDraw className="text-purple-500 text-xl" />
                    <span className="font-semibold text-white">{t.gestionPila}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {/* Sub-bloque: Pila Oscuridad Inquieta */}
                    <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <GiCardDraw className="text-purple-400 text-xl" />
                        <span className="font-semibold text-white">{t.gestionPilas}</span>
                      </div>
        
                      <button
                        disabled={!['rojo', 'azul', 'verde', 'naranja', 'gris'].every(c => availableTiles.some(t => t.runa === c))}
                        onClick={addNewPila}
                        className="mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        ➕ {t.addPila}
                      </button>
                  
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center">
                        {pilas.map(pila => (
                          <div key={pila.id} className="bg-gray-800 p-2 rounded text-center text-white border border-yellow-500">
                            <div className="font-bold mb-1">
                              <span>{t.pila || 'Pila'} 🗃️</span>
                              <input
                                type="text"
                                maxLength={5}
                                value={codigosPilas[pila.id] || ''}
                                onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                placeholder="ABC12"
                                title={t.codigoPila}
                              />
                            </div>
                            <div className="text-xs text-gray-300 mb-2">
                              {t.tamano}: {pila.tiles.length}
                            </div>
                            <div className="flex justify-center">
                              <button
                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => {
                                  const tile = removeTileFromPila(pila.id);
                                  if (tile) showTileToast(tile, 'show');
                                  else alert(t.emptyPila);
                                }}
                              >
                                {t.devolver}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
              
                    {/* Sub-bloque: Pila Oscuridad Concentrada */}
                    <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <GiCardDraw className="text-purple-400 text-xl" />
                        <span className="font-semibold text-white">{t.gestionPilas2}</span>
                      </div>
                
                      <button
                        onClick={addNewPilaConcentrada}
                        className="mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        ➕ {t.addNodo}
                      </button>
                
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center">
                        {pilasConcentrada.map(pila => (
                          <div key={pila.id} className="bg-gray-800 p-2 rounded text-center text-white border border-yellow-500">
                            <div className="font-bold mb-1">
                              <span>{t.pila || 'Pila'} 🗃️</span>
                              <input
                                type="text"
                                maxLength={5}
                                value={codigosPilas[pila.id] || ''}
                                onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                placeholder="ABC12"
                                title={t.codigoPila}
                              />
                            </div>
                            <div className="text-xs text-gray-300 mb-2">
                              {t.tamano}: {pila.tiles.length}
                            </div>
                            <div className="flex justify-center">
                              <button
                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => {
                                  const tile = removeTileFromPilaConcentrada(pila.id);
                                  if (tile) showTileToast(tile, 'show');
                                  else alert(t.emptyPila);
                                }}
                              >
                                {t.devolverNodo}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              
                {/* Bloque 2: Control de áreas y puntos de aparición */}
                <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <GiRuneStone className="text-cyan-500 text-xl" />
                    <span className="font-semibold">{t.controlAreas}</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {/* Sub-bloque: Barricadas */}
                    <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <GiRuneStone className="text-cyan-400 text-xl" />
                        <span className="font-semibold">{t.barricadas}</span>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => initializeControlPoints()}
                          className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ➕ {t.addControlAreas}
                        </button>
                        <button
                          onClick={() => setControlPoints([])}
                          className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ✕ {t.removeCA}
                        </button>
                      </div>
                  
                      
                    </div>
              
                    {/* Sub-bloque: Puntos de aparición */}
                    <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <GiRuneStone className="text-cyan-400 text-xl" />
                        <span className="font-semibold">{t.spawnPoints}</span>
                      </div>
                
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => initializeSpawnPoints()}
                          className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ➕ {t.addSpawnPoints}
                        </button>
                        <button
                          onClick={() => setSpawnPoints([])}
                          className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ✕ {t.removeSP}
                        </button>
                      </div>  
                    </div>

                    {/* Sub-bloque: LLaves Rúnicas */}
                    <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <GiRuneStone className="text-cyan-400 text-xl" />
                        <span className="font-semibold">{t.runeKey}</span>
                      </div>
                
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => initializeRuneKeys()}
                          className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ➕ {t.addRuneKeys}
                        </button>
                        <button
                          onClick={() => setRuneKeys([])}
                          className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                        >
                          ✕ {t.removeRK}
                        </button>
                      </div>  
                    </div>

                    <div className="flex items-center gap-2 mb-2 justify-center">
                    {controlPoints.length > 0 && (
                        <div className="mt-3 p-2 bg-gray-700 rounded-lg">
                          <div className="text-xs text-yellow-300 mb-2">{t.activeBarricade}</div>
                          <div className="flex gap-2 flex-wrap justify-center">
                            {controlPoints.map(point => (
                              <div
                                key={point.uuid}
                                className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                              >
                                <span>{t.colores[point.runa]}</span>
                                <button
                                  onClick={() => removeControlPoint(point.uuid)}
                                  className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {spawnPoints.length > 0 && (
                        <div className="mt-3 p-2 bg-gray-700 rounded-lg">
                          <div className="text-xs text-yellow-300 mb-2">{t.activeSpawnPoints}</div>
                          <div className="flex gap-2 flex-wrap justify-center">
                            {spawnPoints.map(point => (
                              <div
                                key={point.uuid}
                                className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                              >
                                <span>{t.colores[point.runa]}</span>
                                <button
                                  onClick={() => removeSpawnPoint(point.uuid)}
                                  className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {runeKeys.length > 0 && (
                        <div className="mt-3 p-2 bg-gray-700 rounded-lg">
                          <div className="text-xs text-yellow-300 mb-2">{t.activeRuneKeys}</div>
                          <div className="flex gap-2 flex-wrap justify-center">
                            {runeKeys.map(point => (
                              <div
                                key={point.uuid}
                                className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                              >
                                <span>{t.colores[point.runa]}</span>
                                <button
                                  onClick={() => removeRuneKey(point.uuid)}
                                  className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              {/* FIN BLOQUE */}
              </div>
              
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => {
                    resetPlacedRunes(); // Borra las cartas de runa
                    resetTiles();        // Borra las fichas de runa
                  }}
                  className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm"
                >
                  {t.resetRunes}
                </button>
                <button
                  onClick={toggleMenu}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
                >
                  {t.close}
                </button>                      
                
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activeMenu === 'scenario' && (
          <motion.div
            ref={menuRefScenario}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4 pt-2 flex flex-col gap-4 text-white"
          >
            <div className="flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">

              
              <div className="bg-gray-800 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <GiDaemonSkull className="text-red-400 text-xl" />
                  <span className="font-semibold">{t.monstruoEscenario}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-start">
                  {monstruosUnicos.map(monstruo => {
                    const selected = scenarioMonster?.id === monstruo.id;
                    return (
                      <div
                        key={monstruo.id}
                        onClick={() => setScenarioMonster(prev => prev?.id === monstruo.id ? null : monstruo)}
                        className={`relative w-24 h-24 rounded border-2 cursor-pointer transition-transform transform hover:scale-105
                          ${selected ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-600'}
                        `}
                      >
                        <img
                          src={monstruo.imagen}
                          alt={monstruo.id}
                          className="object-cover w-full h-full rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white text-center px-1 py-0.5">
                          {translations.enemies.escenario?.[monstruo.id] || monstruo.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              
                {scenarioMonster && (
                  <div className="mt-2 text-xs text-gray-300">
                    ✅ {t.monstruoSeleccionado}: <strong>{translations.enemies.escenario?.[scenarioMonster.id] || scenarioMonster.id}</strong>
                  </div>
                )}
              </div>
  
              
                  
              <div className="bg-gray-800 rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <GiVillage className="text-yellow-300 text-xl" />
                  <span className="font-semibold">{t.escenario || 'Cartas de Escenario'}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  {/* Incursión */}
                  <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                    <div className="flex text-orange font-semibold p-2 mb-2">
                      <GiUprising className="text-blue text-xl" />
                       <span className="font-semibold"> {t.incru1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={!scenarioMonster}
                        onClick={() => {
                          const carta = INCURSION.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta);
                        }}
                        className={`bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded 
                          ${!scenarioMonster ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {t.addScenario} ({t.caraA})
                      </button>
          
                      <button
                        disabled={!scenarioMonster}
                        onClick={() => setShowScenarioFaceOptions(prev => ({ ...prev, incursion: !prev.incursion }))}
                        className={`bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded 
                          ${!scenarioMonster ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {t.addScenarioCara}
                      </button>
                    </div>
                    {showScenarioFaceOptions.incursion && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {INCURSION.map((card, index) => (
                          <button
                            key={`${card.id}-${card.cara}-${index}`}
                            onClick={() => handleSelectUniqueCard(card)}
                            className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                          >
                           {t.cara} ({card.cara})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
    
          
                  {/* Defensa */}
                  <div className="flex-1 bg-gray-700 rounded-lg p-3 shadow-md">
                    <div className="flex text-white font-semibold p-2 mb-2">
                      <GiStoneTower className="text-blue text-xl" />
                       <span className="font-semibold"> {t.defen1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const carta = DEFENSA.find(c => c.cara === 'A');
                          if (carta) handleSelectUniqueCard(carta);
                        }}
                        className={`bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded`}
                      >
                        {t.addScenario} ({t.caraA})
                      </button>
          
                      <button
                        onClick={() => setShowScenarioFaceOptions(prev => ({ ...prev, defensa: !prev.defensa }))}
                        className={`bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded`}
                      >
                        {t.addScenarioCara}
                      </button>
                    </div>
                    {showScenarioFaceOptions.defensa && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {DEFENSA.map((card, index) => (
                          <button
                            key={`${card.id}-${card.cara}-${index}`}
                            onClick={() => handleSelectUniqueCard(card)}
                            className="bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {t.cara} ({card.cara})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                </div>
                
              </div>

              
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={toggleMenu}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
                >
                  {t.close || 'Cerrar'}
                </button>
              </div>
            
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

    </div>


    {/* Toast visual para eliminación */}
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2 pointer-events-none">
        {tileToasts.map(tile => (
          <TileToast key={tile.uuid} tile={tile} tipo={tile.tipo} />
        ))}
      </div>
    </>
  );
};

export default TopMenu;
