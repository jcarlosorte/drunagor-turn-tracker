// src/pages/InitTracker.jsx
import { useNavigate } from 'react-router-dom';
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState, useRef } from 'react';
import { GiAbstract065, GiWingedSword } from 'react-icons/gi';
import { RiArrowTurnBackLine, RiArrowTurnForwardLine } from "react-icons/ri";
import { MdScreenRotation } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HEROES } from '@/data/heroes';
import { ENEMIES } from '@/data/enemies';
import { RUNAS, ASALTO } from '@/data/runas';
import { INCURSION } from '@/data/incursion';
import { DEFENSA } from '@/data/defensa';
import { ESTADOS_ALTERADOS, CAPACIDADES_ACTIVADAS } from '@/data/estadosAlterados';
import { CARTAS_COMANDANTE, CARTAS_OVERLORD, ALDEANO, ERRANTES, CARTAS_GUSANO } from '@/data/cartasEspeciales';
import { TURN_ORDER } from '@/data/turnOrder';
import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { ENEMY_RING_COLORS_BIG } from '@/data/enemyRingsBig';
import { useTracker } from '@/context/TrackerContext';
import { useLanguage } from '@/context/LanguageContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useGame } from '@/context/GameContext';
import { useInitRunes } from '@/context/InitRunesContext';
import TopMenu from '@/components/TopMenu';
import classNames from 'classnames';
import AnimatedEnemyToast from '@/components/AnimatedEnemyToast';
import PageTransition from "@/components/PageTransition";
import ModalCommanderPC from '@/components/ModalCommanderPC';
import { ModalEnemyCard } from '@/components/ModalEnemyCard';
import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';
import { useRenderEnemyCapabilities } from '@/components/renderEnemyCapabilities';
import TileWarningModal from '@/components/TileWarningModal';
import TileToast from '@/components/TileToast';
import CommanderCard from '@/components/CommanderCard';
import { v4 as uuidv4 } from 'uuid';

const rolesPositionMap = {
  defensor: 0,
  apoyo: 2,
  lider: 4,
  agresor: 6,
  controlador: 8
};

const runesColorMap = {
  naranja: 1,
  verde: 3,
  azul: 5,
  rojo: 7,
  gris: 9
};

const allowedCategories = ['campeon', 'veterano', 'soldado', 'bisoño'];
const behaviorOptions = ['estandar', 'alternativo', 'complejo'];
const PROPIEDADES_ACTUALIZABLES = ['movimiento', 'ataque', 'capacidades', 'inmunidad', 'tipo_ataque'];


const InitTracker = () => {
  const { trackerData, setTrackerData } = useTracker();
  const { placedEnemies, setPlacedEnemies, placeEnemy, removeEnemyAt, removeEnemyByUUID, resetPlacedEnemies, assignColorToEnemy, releaseColor, usedColors, setUsedColors, usedColorsBig, setUsedColorsBig, enemyColorMap, setEnemyColorMap } = useInitEnemies();
  const { language, translations } = useLanguage();
  const { selectedExpansions } = useExpansions();
  const navigate = useNavigate();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const tc = translations.enemies?.categoria || {};
  const tee = translations.enemies || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const ta = translations.cartas_ataque || {};
  const ts = translations.scenarioCard || {};
  const td = translations.defensaCard || {};
  const tea = translations.estadosAlterados || {};
  const behaviors = trackerData.behaviors;
  const enemies = trackerData.enemies;
  const selectedHeroes = trackerData.heroes;
  const numHeroes = selectedHeroes.length;
  const [categorySelector, setCategorySelector] = useState({ open: false, color: null });
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);
  const [manualSelector, setManualSelector] = useState({ open: false, color: null });
  const [toastMessage, setToastMessage] = useState('');
  const [selectedEnemyUuid, setSelectedEnemyUuid] = useState(null);
  const specialCategories = ['comandante', 'jefe', 'overlord', 'hero', 'esbirro', 'escenario'];
  const { manifestTile, tileToasts, setTileToasts, showTileToast, drawTilePreviewByColor, runes, addRune, removeRune, getRuneCount, clearRunes, drawMultipleTiles, tileWarning, setTileWarning, scenarioMonster, 
         spawnPoints, removeSpawnPoint, controlPoints, removeControlPoint, runeKeys, removeRuneKey, rescue, removeRescue, pilas, pilasConcentrada, activarPilaConcentrada, activarPila, codigosPilas, setCodigosPilas, handleCodigoChange,
         initializeDecks, drawCardFromDeck, removeTileFromPila, removeTileFromPilaConcentrada } = useGame();
  const [selectedRuneCards, setSelectedRuneCards] = useState([]);
  const { placedRunes, placeRune, removeRuneByUUID, resetPlacedRunes, setPlacedRunes, tickDefenseRune } = useInitRunes();
  const { executedRunes, setExecutedRunes } = useInitRunes();
  const [warningMessage, setWarningMessage] = useState(null);
  const [overhealedEnemies, setOverhealedEnemies] = useState(new Set());
  const [rotatingUUIDs, setRotatingUUIDs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [scenarioToasts, setScenarioToasts] = useState([]);
  const [showPCModal, setShowPCModal] = useState(false);
  const [onPCConfirm, setOnPCConfirm] = useState(null);
  
  const getHeroName = (id) => translations.heroes?.[id] || id;
  const getEnemyName = (id, color = null) => {
    if (color === 'escenario') {
      return translations.enemies?.escenario?.[id] || id;
    }
    return translations.enemies?.[id] || id;
  };

  const openCategorySelector = (color) => setCategorySelector({ open: true, color });
  const openManualSelector = (color) => setManualSelector({ open: true, color });

  const getRuneColorFromIndex = (index) => {
    return Object.entries(runesColorMap).find(([color, idx]) => idx === index)?.[0];
  };

  const handleTileDraw = (tile) => {
    if (!tile) return;
    showTileToast(tile, 'add');
  };

  const handleCloseToast = (tile) => {
    const uuid = tile?.uuid ?? tile;
    setTileToasts(prev => prev.filter(t => t.uuid !== uuid));
  };

  const formatTextWithBraces = (text) => {
    const parts = text.split(/(\{.*?\})/g);
    let manifestedTile = null;
  
    const content = parts.map((part, idx) => {
      const match = part.match(/^\{(.*?)\}$/);
  
      if (match) {
        const key = match[1];
        const translated = td.cartas_trad?.[key] || key;
  
        if (key === "MANIFIESTA") {
          manifestedTile = manifestTile(); // ejecuta manifiesta
        }
  
        return (
          <span key={`brace-${idx}`} className="text-blue-400 font-semibold">
            {translated}
          </span>
        );
      }
  
      return <span key={`text-${idx}`}>{part}</span>;
    });
  
    // Añadir al final si hubo MANIFIESTA y una runa válida
    if (manifestedTile?.runa) {
      const label = ti.runaManifestada || "Runa manifestada";
      const colorName = ti.colores[manifestedTile.runa];
  
      content.push(
        <span key="manifested-color" className="block text-blue-400 mt-2">
          {label} {colorName}
        </span>
      );
    }
  
    return content;
  };
  
  const showCardToast = (card, deckType) => {
    const id = uuidv4();
    const translationsDeck = td[`cartas_${deckType}`];
    const message = translationsDeck.nombre?.[card.id] || card.id;
    const action_ori = translationsDeck.accion?.[card.id] || '';
    const action2_ori = translationsDeck.accion2?.[card.id] || '';
    let extra_ori = '\n';
  
    if (deckType === 'errantes') {
      for (let i = 1; i <= numHeroes; i++) {
        const line = translationsDeck.texto?.[`${card.id}${i}`];
        if (line) extra_ori += `${line}\n`;
        const enemyData = translationsDeck.texto2?.[`${card.id}${i}`];
        if (enemyData) {
          const [count, color, category] = enemyData;
          for (let j = 0; j < count; j++) {
            // 1️⃣ Filtrar enemigos disponibles según expansiones, color y categoría
            const candidates = ENEMIES.filter(
              e =>
                enemies.includes(e.id) &&   // está en expansiones activas
                e.color === color &&
                e.categoria === category &&
                e.cara !== 'B'
            );
    
            if (candidates.length === 0) {
              console.warn(`❌ No hay enemigos disponibles para ${color} - ${category}`);
              continue;
            }
    
            // 2️⃣ Elegir uno aleatorio
            const selectedEnemy = candidates[Math.floor(Math.random() * candidates.length)];
    
            // 3️⃣ Elegir comportamiento aleatorio de entre los que tenga definidos
            let behaviorType = 'estandar';
            if (Array.isArray(selectedEnemy.comportamientos)) {
              behaviorType = selectedEnemy.comportamientos[
                Math.floor(Math.random() * selectedEnemy.comportamientos.length)
              ];
            } else if (selectedEnemy.comportamiento) {
              behaviorType = selectedEnemy.comportamiento;
            }
    
            // 4️⃣ Llamar a handleManualEnemyAdd con el id y datos encontrados
            handleManualEnemyAdd(
              selectedEnemy.id,
              behaviorType,
              category,
              'NoShow',
              color,
              null,
              2
            );
          }
        }
      }
    } else {
      extra_ori = translationsDeck.texto?.[card.id] || '';
    }
    
    const action = formatTextWithBraces(action_ori);
    const action2 = formatTextWithBraces(action2_ori);
    const extra = formatTextWithBraces(extra_ori);
    setScenarioToasts(prev => [...prev, { id, message, action, action2, extra }]);
  };

  
  const openCommanderPCModal = (callback) => {
    setOnPCConfirm(() => callback);
    setShowPCModal(true);
  };

  const closePCModal = () => {
    setShowPCModal(false);
    setOnPCConfirm(null);
  };

  const enemiesInSelectedExpansions = ENEMIES.filter(e => 
    selectedExpansions.includes(e.expansionId) &&
    e.color !== "jefe"
  );

  const clearCardHighlight = (uuid) => {
    setPlacedEnemies(prev =>
      prev.map(item =>
        item.enemy.uuid === uuid
          ? { ...item, enemy: { ...item.enemy, highlight: false } }
          : item
      )
    );
  };
  
  const getNextAvailableColorSimulated = (isBig, simulatedSmall, simulatedBig) => {
    const used = new Set(isBig ? simulatedBig : simulatedSmall);
    const source = isBig ? ENEMY_RING_COLORS_BIG : ENEMY_RING_COLORS;
    return source.find(c => !used.has(c.id)) || null;
  };
    
  const spawnBatchEnemies = (count, scenarioMonster) => {
    if (!scenarioMonster) return;
  
    const isBig = scenarioMonster.size === 'grande';
  
    let simulatedUsedSmall = [...usedColors];
    let simulatedUsedBig = [...usedColorsBig];
    const generatedColors = [];
  
    for (let i = 0; i < count; i++) {
      // obtenemos el siguiente color disponible
      const nextColorId = getNextAvailableColorSimulated(isBig, simulatedUsedSmall, simulatedUsedBig);
      
      if (!nextColorId.id) {
        alert(ti.noColorsAvailable || "No hay más colores disponibles para asignar");
        return undefined; // paramos si ya no hay colores
      }
      // guardamos el color en la simulación
      if (isBig) simulatedUsedBig.push(nextColorId.id);
      else simulatedUsedSmall.push(nextColorId.id);
      generatedColors.push(nextColorId.id);
      
    }

    // ✅ Ahora llamamos al add original, pasándole cada color preasignado
    generatedColors.forEach((forcedColor) => {
      handleManualEnemyAdd(scenarioMonster.id, scenarioMonster.comportamiento, scenarioMonster.categoria, 'NoShow', forcedColor);
    });
  };

  const handleCategorySelect = (categoryKey) => {
    const color = categorySelector.color;
    setCategorySelector({ open: false, color: null });
    const filtered = ENEMIES.filter(e => e.color === color && e.categoria === categoryKey && enemies.includes(e.id) && e.cara !=="B" && e.id !== scenarioMonster?.id);
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
    const uuid = uuidv4();
    const isBig = selected.size === 'grande';
    const colorId = assignColorToEnemy(uuid, isBig);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    showToast(selected);
    placeEnemy({
      enemy: {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento, 
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      }
    });
  };

  
  const handleManualEnemyAdd = (enemyId, behaviorType, category, ver = 'show', forcedColorId = null, forcedUUID = null, forcedPcValue = null ) => {
    setManualSelector({ open: false, color: null });
    const selected = ENEMIES.find(e => {
      if (e.id !== enemyId) return false;
      if (e.categoria !== category) return false;
      if (!enemies.includes(e.id)) return false;
      if (e.cara === 'B') return false;
      if (category === 'comandante') return true;          // ignoramos comportamiento
      return e.comportamiento === behaviorType;            // para el resto sí exigimos match
    });
    if (!selected) return;
    const uuid = forcedUUID || uuidv4();
    const isBig = selected.size === 'grande';
    const colorId = assignColorToEnemy(uuid, isBig, forcedColorId);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    if (selected.categoria === 'comandante') {
      const createAndPlaceCommander = (pcValue) => {
        const totalVida = selected.vida * (pcValue + numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };  
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del comandante:
        placeCommanderCards(selected, uuid);
      };
      // 👉 Si viene forzado, no abrimos modal
      if (typeof forcedPcValue === 'number') {
        createAndPlaceCommander(forcedPcValue);
      } else {
        openCommanderPCModal((pcValue) => createAndPlaceCommander(pcValue));
      }
      return;
    } else if (selected.categoria === 'overlord') {
      
        const totalVida = selected.vida * (numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const colorId = null;
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del señor supremo:
        placeOverlordCards(selected, uuid);
        return;
    } else if (selected.categoria === 'hero') {
      
        const totalVida = selected.vida * (numHeroes);
        const runeIndex = runesColorMap[selected.rune];
        const runePosition = selected.runePosition;
        const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
        const enemy = {
          uuid: uuid,
          name: selected.nombre,
          id: selected.id,
          rune: selected.rune,
          imagen: selected.imagen,
          runePosition,
          position: runeIndex,
          categoria: category,
          comportamiento: behaviorType,
          vida: totalVida,
          vidaMax: totalVida,
          movimiento: selected.movimiento,
          ataque: selected.ataque,
          color: selected.color,
          inmunidad: selected.inmunidad,
          tipo_ataque: selected.tipo_ataque,
          capacidades: adjustedCaps,
          capacidadesOriginales: selected.capacidades,
          ringColor: colorId,
          cara: selected.cara,
          estadosAlterados: initialStates
        };
        if (ver === 'show') showToast(selected);
        placeEnemy({ enemy });
        // 👉 Añadir cartas de ataque del comandante:
        placeCommanderCards(selected, uuid);
        return;
    }
    
    const runeIndex = runesColorMap[selected.rune];
    const runePosition = selected.runePosition;
    const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
    
    placeEnemy({
      enemy: {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: category,
        comportamiento: behaviorType,
        vida: selected.vida,
        vidaMax: selected.vida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      }
    });
    if (ver === 'show') showToast(selected);
  };
  
  const handleRandomCommander = () => {
    const filtered = ENEMIES.filter(e => e.categoria === 'comandante');
    if (filtered.length === 0) return;
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    const uuid = uuidv4();
    const isBig = selected.size === 'grande';
    const colorId = assignColorToEnemy(uuid, isBig);
    const initialStates = ESTADOS_ALTERADOS.map(estado => ({ id: estado.id, count: 0 }));
    openCommanderPCModal((pcValue) => {
      const totalVida = selected.vida * (pcValue + numHeroes);
      const runeIndex = runesColorMap[selected.rune];
      const runePosition = selected.runePosition;
      const adjustedCaps = adjustCapabilitiesByRunes(selected.capacidades, selected.rune, getRuneCount);
      const enemy = {
        uuid: uuid,
        name: selected.nombre,
        id: selected.id,
        rune: selected.rune,
        imagen: selected.imagen,
        runePosition,
        position: runeIndex,
        categoria: selected.categoria,
        comportamiento: selected.comportamiento,
        vida: totalVida,
        vidaMax: totalVida,
        movimiento: selected.movimiento,
        ataque: selected.ataque,
        color: selected.color,
        inmunidad: selected.inmunidad,
        tipo_ataque: selected.tipo_ataque,
        capacidades: adjustedCaps,
        capacidadesOriginales: selected.capacidades,
        ringColor: colorId,
        cara: selected.cara,
        estadosAlterados: initialStates
      };
      showToast(enemy);
      placeEnemy({ enemy });
      // 👉 Añadir cartas de ataque del comandante:
      placeCommanderCards(selected, uuid);
    });
  };

  const placeCommanderCards = (enemy, commanderUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const shuffled = [...CARTAS_COMANDANTE].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numHeroes);
    const nombreCommander = getEnemyName(enemyId, enemyColor);
    const nuevas = selected.map(carta => ({
      enemy: {
        uuid: uuidv4(),
        id: carta.id,
        nombre: carta.nombre,
        capacidades: carta.capacidades,
        rune: carta.rune,
        runePosition: carta.runePosition,
        position: runesColorMap[carta.rune],
        tipo: 'especial',
        sourceCommanderId: commanderUUID,
        nombreEnemy: nombreCommander,
        highlight: true,
      },
    }));
    const msgWar = ti.voragineWarning.replace('{name}', nombreCommander);
    if (isTurnActivation) {
      setWarningMessage(msgWar);
      setTimeout(() => setWarningMessage(null), 3000);
    }
    setPlacedEnemies(prev => [...prev, ...nuevas]);
    nuevas.forEach(carta => {
      setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
    });
  };

  const placeOverlordCards = (enemy, overlordUUID, isTurnActivation = false) => {
    const enemyId = enemy.id;
    const enemyColor = enemy.color;
    const shuffled = [...CARTAS_OVERLORD].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numHeroes);
    const nombreOverlord = getEnemyName(enemyId, enemyColor);
    const nuevas = selected.map(carta => ({
      enemy: {
        uuid: uuidv4(),
        id: carta.id,
        nombre: carta.nombre,
        capacidades: carta.capacidades,
        rune: carta.rune,
        runePosition: carta.runePosition,
        position: runesColorMap[carta.rune],
        tipo: 'especial',
        sourceOverlordId: overlordUUID,
        nombreEnemy: nombreOverlord,
        highlight: true,
      },
    }));

     // 1. Mostrar mensaje visual temporal
      // ✅ Mostrar mensaje SOLO si viene de un turno (reinvocación)
    const msgWar = ti.voragineWarning.replace('{name}', nombreOverlord);
    if (isTurnActivation) {
      setWarningMessage(msgWar);
      setTimeout(() => setWarningMessage(null), 3000);
    }
    // 2. Añadir nuevas cartas
    setPlacedEnemies(prev => [...prev, ...nuevas]);
    nuevas.forEach(carta => {
      setTimeout(() => clearCardHighlight(carta.enemy.uuid), 1500);
    });
  };

  const handleAddRuneCard = (runeCard, timeToken) => {
    const newRune = {
      uuid: uuidv4(),
      id: runeCard.id,
      nombre: runeCard.nombre,
      cara: runeCard.cara,
      posicion: runeCard.posicion, // 'arriba' o 'abajo'
      accion: runeCard.accion,
      numRunas: runeCard.numRunas,
      tipo: runeCard.tipo,
      carta: runeCard.carta,
      counter: timeToken,
      colorIndex: 10
    };
    placeRune({ rune: newRune });
    if (newRune.tipo === 'defensa'){
      initializeDecks();
    };
    
  };

  const onRemove = (uuid) => {
    removeEnemyByUUID(uuid);
    releaseColor(uuid);
  };
  const openEnemyModal = (uuid) => {
    setSelectedEnemyUuid(uuid);
  };

  const updateEnemyVida = (uuid, nuevaVida, nuevoMax) => {
    setPlacedEnemies(prev =>
      prev.map(e => {
        if (e.enemy.uuid === uuid) {
          const actualMax = e.enemy.vidaMax;
          const nuevoVidaMax = nuevoMax !== undefined && nuevoMax !== null
            ? nuevoMax
            : Math.max(nuevaVida, actualMax); // 👈 si nueva vida > actualMax, lo eleva
  
          return {
            ...e,
            enemy: {
              ...e.enemy,
              vida: nuevaVida,
              vidaMax: nuevoVidaMax
            }
          };
        }
        return e;
      })
    );
  };

  const updateEnemyEstados = (uuid, updatedStates) => {
    setPlacedEnemies(prev =>
      prev.map(e =>
        e.enemy?.uuid === uuid
          ? { ...e, enemy: { ...e.enemy, estadosAlterados: updatedStates } }
          : e
      )
    );
  };

  const aplicarEfectosEstados = (enemy, faseTurno) => {
    if (!enemy.estadosAlterados || enemy.estadosAlterados.length === 0) return { enemy, logs: [] };
  
    let vidaRestante = enemy.vida;
    let estados = [...enemy.estadosAlterados];
    const logs = [];
  
    // ✅ Buscar ESCUDO antes de aplicar daño
    const estadoEscudo = estados.find(e => e.id === "ESCUDO");
    let escudosDisponibles = estadoEscudo ? estadoEscudo.count : 0;
  
    const nuevosEstados = estados.map(estado => {
      const config = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
      if (!config || estado.count <= 0) return estado;
  
      // ¿Debe ejecutarse en esta fase?
      if ((faseTurno === "inicio" && config.turno === "principio") ||
          (faseTurno === "fin" && config.turno === "final")) {
  
        let logMsg = `${tea[config.texto]}`;
  
        // 🔹 Daño
        if (config.daño > 0) {
          let daño = config.daño * estado.count;
  
          if (daño > 0) {
            // ✅ Restar primero a ESCUDO si hay
            let escudosReducidos = 0;
            if (escudosDisponibles > 0) {
              const usados = Math.min(daño, escudosDisponibles);
              escudosReducidos = usados;
              escudosDisponibles -= usados;
              daño -= usados;
            }
  
            if (escudosReducidos > 0) {
              logMsg += ` ${ti.consume} ${escudosReducidos} ${ti.escudos}`;
            }
  
            if (daño > 0) {
              vidaRestante -= daño;
              logMsg += ` ${ti.inflige} ${daño} ${ti.daño_i}`;
            }
          }
        }
  
        // 🔹 Reducir cantidad si reduce = "si"
        let nuevoCount = estado.count;
        if (config.reduce === "si") {
          const reducir = config.numReduce;
          nuevoCount = Math.max(0, estado.count - reducir);
          const reducir_cal = estado.count - nuevoCount;
          if (reducir_cal > 0) {
            logMsg += ` (${ti.reduce} ${reducir_cal})`;
          }
        }
  
        logs.push(logMsg);
  
        return { ...estado, count: nuevoCount };
      }
  
      return estado;
    });
  
    // ✅ Actualizar ESCUDO si se consumieron
    if (estadoEscudo) {
      const consumidos = estadoEscudo.count - escudosDisponibles;
      if (consumidos > 0) {
        //logs.push(`${ti.escudosConsumidos} ${consumidos}`);
      }
      nuevosEstados.forEach(e => {
        if (e.id === "ESCUDO") e.count = escudosDisponibles;
      });
    }
    console.log(logs);
    return {
      enemy: {
        ...enemy,
        vida: Math.max(0, vidaRestante),
        estadosAlterados: nuevosEstados
      },
      logs: logs.length > 0 ? logs : []
    };
  };


  const aplicarCapacidadesActivadas = (enemy, placedEnemies) => {
    let vida = enemy.vida;
    let estados = [...(enemy.estadosAlterados || [])];
    const logs = [];
  
    // ⚡ Obtenemos las capacidades ajustadas
    const capacidades = adjustCapabilitiesByRunes(enemy.capacidadesOriginales || [], enemy.rune, getRuneCount);
    capacidades.forEach(cap => {
      // ✅ REGENERACIÓN X
      if (cap.startsWith("REGENERACION")) {
        const partes = cap.split(" ");
        const cantidad = parseInt(partes[1]) || 0;
  
        if (cantidad > 0) {
          const vidaAntes = vida;
          const vidaNueva = Math.min(enemy.vidaMax, vida + cantidad);
  
          if (vidaNueva > vidaAntes) {
            vida = vidaNueva;
            logs.push(`${ti.regenera} ${vidaNueva - vidaAntes} ${ti.vida_i}`);
          }
        }
      }
  
      // ✅ ESCUDO X
      if (cap.startsWith("ESCUDO")) {
        const partes = cap.split(" ");
        const cantidad = parseInt(partes[1]) || 0;
  
        if (cantidad > 0) {
          // buscamos el estado ESCUDO
          const idx = estados.findIndex(e => e.id === "ESCUDO");
          const configEscudo = ESTADOS_ALTERADOS.find(e => e.id === "ESCUDO");
          const maxEscudo = configEscudo?.max || Infinity;
  
          if (idx >= 0) {
            const actual = estados[idx].count;
            const nuevo = Math.min(maxEscudo, actual + cantidad);
  
            if (nuevo > actual) {
              estados[idx] = { ...estados[idx], count: nuevo };
              logs.push(`${ti.gana} ${nuevo - actual} ${ti.escudos}`);
            }
          } else {
            const nuevo = Math.min(maxEscudo, cantidad);
            estados.push({ id: "ESCUDO", count: nuevo });
            if (nuevo > 0) logs.push(`${ti.gana} ${nuevo} ${ti.escudos}`);
          }
        }
      }
  
      // ✅ MANIFESTAR
      if (cap === "MANIFESTAR") {
        // Ejecutamos manifestación
        const tile = manifestTile();
        if (tile) {
          logs.push(`${ti.Manifiesta} ${ti.colores[tile.runa]}`);
        }
      }
      
      // ✅ HASTA + SANAR (pendiente)
      if (cap.startsWith("HASTA")) {
        
        const partes = cap.split(" ");
        const cantidadObjetivos = parseInt(partes[1]) || 0;
      
        // 🔍 Buscamos la siguiente capacidad que empiece por SANAR
        const idxCap = capacidades.indexOf(cap);
        const capSanar = capacidades[idxCap + 2] || "";
        if (capSanar.startsWith("SANAR")) {
          const sanarPartes = capSanar.split(" ");
          const cantidadSanar = parseInt(sanarPartes[1]) || 0;
      
          if (cantidadObjetivos > 0 && cantidadSanar > 0) {
            // ✅ Localizamos TODOS los enemigos (incluyendo al actual)
            const todosEnemigos = placedEnemies
              .map(e => e.enemy)
              .filter(e => e.vida > 0);
           
            // Ordenamos por vida ascendente
            const ordenados = [...todosEnemigos].sort((a, b) => a.vida - b.vida);
      
            // Tomamos los N más débiles
            const objetivos = ordenados.slice(0, cantidadObjetivos);
      
            objetivos.forEach(objetivo => {
              const vidaAntes = objetivo.vida;
              const vidaNueva = Math.min(objetivo.vidaMax, vidaAntes + cantidadSanar);
      
              if (vidaNueva > vidaAntes) {
                logs.push(
                  `${ti.sanaA} ${tee[objetivo.id]} ${vidaNueva - vidaAntes} ${ti.vida_i}`
                );
      
                // ✅ Actualizamos vida del objetivo en placedEnemies
                if (objetivo.uuid != enemy.uuid){
                  updateEnemyVida(objetivo.uuid, vidaNueva, objetivo.vidaMax);
                } else {
                  vida = vidaNueva;
                }

              }
            });
          }
        }
      }

      
    });
    console.log(logs);
    return {
      vida: enemy.vida,
      estados: enemy.estadosAlterados || [],
      logs: logs.length > 0 ? logs : []
    };
  };

  const getEnemiesByColor = (trackerEnemies, color, behaviorType = null) => {
    const validEnemies = Array.from(new Set(trackerEnemies.map(e => e.id)));
    return ENEMIES.filter(e =>
      validEnemies.includes(e.id) &&
      e.color === color &&
      (behaviorType ? e.comportamiento === behaviorType : true)
    );
  };

  const handleSelectBoss = () => console.log("Seleccionar jefes");

  const categoryGlowMap = {
    bisoño: 'drop-shadow-[0_0_6px_rgba(59,130,246,1)]',    // azul
    soldado: 'drop-shadow-[0_0_6px_rgba(234,179,8,1)]',     // amarillo
    veterano: 'drop-shadow-[0_0_6px_rgba(251,146,60,1)]',   // naranja
    campeon: 'drop-shadow-[0_0_6px_rgba(239,68,68,1)]'      // rojo
  };

  const categoryTextGlowMap = {
    bisoño: 'glow-bisono',
    soldado: 'glow-soldado',
    veterano: 'glow-veterano',
    campeon: 'glow-campeon',
    comandante: 'glow-commander',
    overlord: 'glow-commander',
    esbirro: 'glow-escenario',
    escenario: 'glow-escenario',
  };

  const borderColorMap = {
    esbirro: 'border-cyan',
    escenario: 'border-blue',
    blanco: 'border-blanco',
    gris: 'border-gris',
    negro: 'border-negro',
    comandante: 'border-dorado',
    overlord: 'border-morado',
    jefe: 'border-morado',
  };

  const textBgColorMap = {
    esbirro: 'bg-cyan-300',
    escenario: 'bg-cyan-600',
    blanco: 'bg-white',
    gris: 'bg-gray-500',
    negro: 'bg-black',
    comandante: 'bg-orange-400 ',
    overlord: 'bg-purple-800',
    jefe: 'bg-purple-700',
  };
  
  const colorMap = {
    rojo: 'bg-red-700 hover:bg-red-600',
    azul: 'bg-blue-700 hover:bg-blue-600',
    verde: 'bg-green-700 hover:bg-green-600',
    naranja: 'bg-orange-700 hover:bg-orange-600',
    gris: 'bg-gray-700 hover:bg-gray-600',
  };
  useEffect(() => {
    const initialHeroes = trackerData.heroes.map(id => {
      const role = trackerData.roles[id];
      const image = HEROES.find(h => h.id === id)?.image;
      return { id, role, image, position: rolesPositionMap[role] };
    });
    const handleResize = () => setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    setTrackerData(prev => ({ ...prev, placedHeroes: initialHeroes }));
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  
  const [turnIndex, setTurnIndex] = useState(-1);
  const [currentTurnEntity, setCurrentTurnEntity] = useState(null);
  const [groupTurnTracker, setGroupTurnTracker] = useState({ group: [], index: 0 });
  const processedVoragineRef = useRef(new Set());
  const processedDefenseTurnRef = useRef(new Set());
  const [lastRealTurnIndex, setLastRealTurnIndex] = useState(null); 
  const placedHeroes = trackerData.placedHeroes;
  const groupIndex = groupTurnTracker.index;
  const roundRef = useRef(0);
  const previousIndexRef = useRef(null);
  const processedStartEffectsRef = useRef(new Set());
  const processedEndEffectsRef = useRef(new Set());
  
  useEffect(() => {
    if (turnIndex < 0 || turnIndex >= TURN_ORDER.length) return;
    const step = TURN_ORDER[turnIndex];
  
    // 🔁 Detectar nueva ronda
    if (
      previousIndexRef.current !== null &&
      turnIndex !== -1 &&
      turnIndex < previousIndexRef.current
    ) {
      // Solo cuando damos la vuelta al ciclo completo
      processedVoragineRef.current = new Set();
      processedDefenseTurnRef.current = new Set();
      processedStartEffectsRef.current.clear();
      processedEndEffectsRef.current.clear();
      setExecutedRunes([]);
      roundRef.current += 1;
      console.log("🔁 Nueva ronda", roundRef.current);
    }
    
    previousIndexRef.current = turnIndex;
  
    // 🔍 ENEMIES
    if (step.type === 'enemy') {
      const group = placedEnemies
        .filter(e => e.enemy.rune === step.rune && e.enemy.position === step.index && e.enemy.runePosition === step.position)
        .map(e => e.enemy);
  
      if (group.length > 0) {
        const current = group[groupTurnTracker.index];
        if (!current) {
          //console.warn("Enemigo eliminado. Buscando siguiente entidad...");
          handleNextTurn();
          return;
        }
        setCurrentTurnEntity({ ...current, type: 'enemy', group });
        // ✅ Aplicar efectos al inicio
        if (!processedStartEffectsRef.current.has(current.uuid)) {
          processedStartEffectsRef.current.add(current.uuid);
          // 🔹 Efectos de estados (fase inicio)
          const { enemy: actualizadoEstados, logsEstados } = aplicarEfectosEstados(current, "inicio");

          // ✅ Aplicar efectos de capacidades activadas
          const { vida, estados, logs: logsCapacidades } = aplicarCapacidadesActivadas(actualizadoEstados, placedEnemies);
          
          // 🔹 Actualizamos enemigo con ambos cambios
          const enemigoFinal = { ...actualizadoEstados, vida, estadosAlterados: estados };
    
          // ✅ Mostrar logs (estados + capacidades)
          console.log(logsEstados);
          console.log(logsCapacidades);
          [...logsEstados, ...logsCapacidades].forEach(log =>
            showScenarioToast(`🌀 ${tee[enemigoFinal.id]}: ${log}`)
          );
        
          // 🔹 Guardar en placedEnemies
          setPlacedEnemies(prev =>
            prev.map(e =>
              e.enemy.uuid === enemigoFinal.uuid ? { ...e, enemy: enemigoFinal } : e
            )
          );
        
          // ❌ Si muere tras aplicar efectos → saltar turno
          if (enemigoFinal.vida <= 0) {
            showScenarioToast(`☠ ${tee[enemigoFinal.id]} ${ti.muere_1}`);
            setPlacedEnemies(prev => prev.filter(e => e.enemy.uuid !== enemigoFinal.uuid));
            handleNextTurn();
            return;
          }
        }
        setGroupTurnTracker({ group, index: groupTurnTracker.index });
    
        // ✅ Ejecutar VORÁGINE solo si no está ya procesado
        if (
          Array.isArray(current.capacidades) &&
          current.capacidades.includes('VORAGINE') &&
          !processedVoragineRef.current.has(current.uuid)
        ) {
          // 🔁 Marcar como procesado
          processedVoragineRef.current.add(current.uuid);
          if (current.categoria === 'overlord') {
            setPlacedEnemies(prev => prev.filter(e => !(e.enemy.tipo === 'especial' && e.enemy.sourceOverlordId === current.uuid)));
            placeOverlordCards(current, current.uuid, true);
          } else if (['comandante', 'hero'].includes(current.categoria)) {
            setPlacedEnemies(prev => prev.filter(e => !(e.enemy.tipo === 'especial' && e.enemy.sourceCommanderId === current.uuid)));
            placeCommanderCards(current, current.uuid, true);
          }
        }
    
        return;
      }
    }
  
    // 🔍 RUNES
    if (step.type === 'rune') {
      const runes = placedRunes
        .filter(r => r.rune.colorIndex === step.index && r.rune.posicion === step.position)
        .map(r => r.rune);
  
      if (runes.length > 0) {
        const currentRune = runes[groupTurnTracker.index];
        if (!currentRune) {
          //console.warn("Carta runa eliminada. Buscando siguiente entidad...");
          handleNextTurn();
          return;
        }
        setCurrentTurnEntity({ ...currentRune, type: 'rune', group: runes });
        setGroupTurnTracker({ group: runes, index: groupTurnTracker.index });

        if (currentRune.tipo === "defensa" && !currentRune.applyEffect) {
          if (!processedDefenseTurnRef.current.has(currentRune.uuid)) {
            tickDefenseRune(currentRune.uuid); // 🔻 baja contador SOLO una vez por turno
            processedDefenseTurnRef.current.add(currentRune.uuid);
            //console.log("🛡 Reducimos defensa en su turno:", currentRune.defenseCounter - 1);
          }
          return; // no ejecutamos el efecto todavía
        }
         // ✅ Evitar ejecución duplicada
        if (currentRune.applyEffect !== false && !executedRunes.includes(currentRune.uuid)) {
    
          if (currentRune.tipo === 'runa') {
            // 🔹 Lógica clásica de runa: roba fichas de runa
            if (currentRune.numRunas) {
              const tiles = drawMultipleTiles(currentRune.numRunas);
              tiles?.forEach(tile => handleTileDraw(tile));
              if (!tiles) setTileWarning(ti.aviso);
            }
    
          } else if (currentRune.tipo === 'asalto') {

            if (currentRune.numRunas) {
              const tiles = drawMultipleTiles(currentRune.numRunas);
              tiles?.forEach(tile => handleTileDraw(tile));
              if (!tiles) setTileWarning(ti.aviso);
            }
            
          } else if (currentRune.tipo === 'defensa') {
            // 🔹 Defensa → roba cartas de aldeano o errantes
            const numCartas = currentRune.numRunas || 1;
            const mazo = currentRune.carta; // "aldeano" o "errantes"
    
            for (let i = 0; i < numCartas; i++) {
              // TODO: Lógica para robar del mazo correspondiente (cuando tengamos datos)
              const cartaRobada = drawCardFromDeck(mazo);
              if (cartaRobada) {
                showCardToast(cartaRobada, mazo); 
              } else {
                console.warn(`${ti.mazo_1} ${mazo}`);
              }
            }
    
          } else if (currentRune.tipo === 'incursion') {
            const isCaraB = currentRune.cara === 'B';
            const noEnemies = placedEnemies.length === 0;
            const totalHeroes = trackerData.placedHeroes?.length || 0;
            const maxMonstruos = totalHeroes <= 2 ? 2 : totalHeroes <= 4 ? 3 : 4;
            const placedScenarioMonsters = placedEnemies.filter(e => e.enemy.id === scenarioMonster?.id);
            const alreadyPlaced = placedScenarioMonsters.length;
            const faltan = Math.max(0, maxMonstruos - alreadyPlaced);
            const totalFinal = alreadyPlaced + maxMonstruos;
            // ✅ Se ejecuta si es cara B o si es cara A y no hay enemigos
            if (isCaraB || (!isCaraB && noEnemies)) {
              const tile = manifestTile();
             
              // ✅ Comprobar spawnPoints
              const spawnExists = spawnPoints.some(sp => sp.runa === tile.runa);
              
              // ✅ Buscar pilas activas con esa loseta
              const pilasActivas = [
                ...pilas.filter(p => p.estado === 'activa'),
                ...pilasConcentrada.filter(p => p.estado === 'activa')
              ];
              
              const pilasQueContienen = pilasActivas.filter(pila =>
                pila.tiles.some(t => t.runa === tile.runa)
              );
                            
              if (!spawnExists && pilasQueContienen.length === 0) {
                // ❌ No hay punto de aparición para ese color
                showScenarioToast(
                  `${ti.incursionFail} ${ti.colores[tile.runa]} ${ti.noExiste}`
                );
                return; // No seguimos con la invocación
              }

              // ✅ Si hay pilas que la contienen → avisar
              if (pilasQueContienen.length > 0) {
                 const nombresPilas = pilasQueContienen
                    .map(p => `Nº ${p.numPila}  `)
                    .join(', ');
                 showScenarioToast(`${ti.encontradaEn} -> ${ti.colores[tile.runa]}. ${ti.enPilas}: ${nombresPilas}`);
              }
              
              if (faltan > 0 && scenarioMonster) {
                spawnBatchEnemies(faltan, scenarioMonster);
                showScenarioToast(`${ti.added} ${faltan} ${ti.Enemies} ${ti.invocaran}: ${ti.colores[tile.runa]}`);
              }
              if (totalFinal > 4) {
                const exceso = totalFinal - 4;
                const damage = 3;
                showScenarioToast(`${ti.excesoIncursion} ${exceso} ${ti.attackes} ${damage} ${ti.daño}.`);
              }
            } else {
              showScenarioToast(`${ti.noManifestamos}`);
            }
          }
    
          // ✅ Marcar como ejecutada
          setExecutedRunes(prev => [...prev, currentRune.uuid]);
        }
        
        return;
      }
    }
  
    // 🧩 Fallback
    const entity = getNextActiveEntity(turnIndex);
    setCurrentTurnEntity(entity);
    setGroupTurnTracker({ group: [], index: 0 });
  //}, [turnIndex, placedEnemies, placedRunes, groupTurnTracker.index]);
  }, [turnIndex, placedEnemies, placedRunes]);


  
  const getNextActiveEntity = (startIndex) => {
    for (let i = 0; i < TURN_ORDER.length; i++) {
      const idx = (startIndex + i) % TURN_ORDER.length;
      const step = TURN_ORDER[idx];
  
      if (step.type === 'hero') {
        const hero = trackerData.placedHeroes?.find(h =>
          h.role === step.role && h.position === step.index);
        if (hero) return { ...hero, type: 'hero' };
      } else if (step.type === 'enemy') {
        const enemies = placedEnemies
          .filter(e =>
            e.enemy.rune === step.rune &&
            e.enemy.position === step.index &&
            e.enemy.runePosition === step.position)
          .map(e => e.enemy);
        if (enemies.length > 0) return { ...enemies[0], type: 'enemy', group: enemies };
      } else if (step.type === 'rune') {
        const runes = placedRunes
          .filter(r =>
            r.rune.colorIndex === step.index &&
            r.rune.posicion === step.position)
          .map(r => r.rune);
        if (runes.length > 0) return { ...runes[0], type: 'rune', group: runes };
      }
    }
    return null;
  };


  const handleNextTurn = () => {
    if (turnIndex === -1) {
      const next = getNextActiveEntity(0);
      if (next) {
        const idx = TURN_ORDER.findIndex(step =>
          step.type === next.type &&
          ((step.type === 'hero' && step.role === next.role && step.index === next.position) ||
           (step.type === 'enemy' && step.rune === next.rune && step.index === next.position && step.position === next.runePosition) ||
           (step.type === 'rune' && step.index === next.colorIndex && step.position === next.posicion))
        );
        if (idx !== -1) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
        }
      }
      return;
    }

    if (currentTurnEntity?.type === "enemy" && !processedEndEffectsRef.current.has(currentTurnEntity.uuid)) {
      processedEndEffectsRef.current.add(currentTurnEntity.uuid);
    
      const { enemy: actualizado, logs } = aplicarEfectosEstados(currentTurnEntity, "fin");
    
      if (logs.length > 0) {
        logs.forEach(log => showScenarioToast(`🌀 ${tee[actualizado.id]}: ${log}`));
      }
    
      setPlacedEnemies(prev => prev.map(e =>
        e.enemy.uuid === actualizado.uuid ? { ...e, enemy: actualizado } : e
      ));
    
      if (actualizado.vida <= 0) {
        showScenarioToast(`☠ ${tee[actualizado.id]} ${ti.muere_2}`);
        setPlacedEnemies(prev => prev.filter(e => e.enemy.uuid !== actualizado.uuid));
      }
    }

    
        
    // 🔄 Si hay carta con cara, rotarla
    if (currentTurnEntity?.cara) {
      const nuevaCara = currentTurnEntity.cara === 'A' ? 'B' : 'A';
  
      if (currentTurnEntity.type === 'enemy') {
        const nuevo = ENEMIES.find(e => e.id === currentTurnEntity.id && e.cara === nuevaCara);
        if (nuevo) {
          setPlacedEnemies(prev => prev.map(item => {
            if (item.enemy.uuid === currentTurnEntity.uuid) {
              const nuevasProps = {};
              for (const key of PROPIEDADES_ACTUALIZABLES) {
                if (nuevo[key] !== undefined) nuevasProps[key] = nuevo[key];
              }
              return {
                ...item,
                enemy: {
                  ...item.enemy,
                  ...nuevasProps,
                  cara: nuevaCara,
                  capacidades: adjustCapabilitiesByRunes(nuevo.capacidades, nuevo.rune, getRuneCount),
                  capacidadesOriginales: nuevo.capacidades,
                },
              };
            }
            return item;
          }));
          setFlippedCards(prev => [...prev, currentTurnEntity.uuid]);
          setTimeout(() => {
            setFlippedCards(prev => prev.filter(id => id !== currentTurnEntity.uuid));
          }, 700);
        }
      }
  
      if (currentTurnEntity.type === 'rune') {
        // Detectamos la lista de origen según su tipo
        let dataSource = RUNAS;
        if (currentTurnEntity.tipo === 'defensa') dataSource = DEFENSA;
        if (currentTurnEntity.tipo === 'incursion') dataSource = INCURSION;
        if (currentTurnEntity.tipo === 'asalto') dataSource = ASALTO;
        // Buscar la misma carta pero en la cara opuesta
        const nueva = dataSource.find(r => r.id === currentTurnEntity.id && r.cara === nuevaCara);
        
        if (nueva) {
          setPlacedRunes(prev => prev.map(item =>
            item.rune.uuid === currentTurnEntity.uuid
              ? { rune: { ...item.rune, ...nueva, cara: nuevaCara } }
              : item
          ));
          setFlippedCards(prev => [...prev, currentTurnEntity.uuid]);
          setTimeout(() => {
            setFlippedCards(prev => prev.filter(id => id !== currentTurnEntity.uuid));
          }, 700);
        }
      }
    }
  
    // ➡️ Avanzar dentro del grupo si hay más
    if (
      currentTurnEntity?.group?.length > 1 &&
      groupTurnTracker.index < currentTurnEntity.group.length - 1
    ) {
      const nextIndex = groupTurnTracker.index + 1;
      const nextEntity = currentTurnEntity.group[nextIndex];
      setGroupTurnTracker({ group: currentTurnEntity.group, index: nextIndex });
      setCurrentTurnEntity({ ...nextEntity, type: currentTurnEntity.type, group: currentTurnEntity.group });
      return;
    }
  
    // 🔁 Buscar siguiente entidad
    for (let i = 1; i <= TURN_ORDER.length; i++) {
      const idx = (turnIndex + i) % TURN_ORDER.length;
      const step = TURN_ORDER[idx];
  
      if (step.type === 'hero') {
        const hero = trackerData.placedHeroes?.find(h =>
          h.role === step.role && h.position === step.index);
        if (hero) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...hero, type: 'hero' });
          setGroupTurnTracker({ group: [], index: 0 });
          return;
        }
      } else if (step.type === 'enemy') {
        const enemies = placedEnemies
          .filter(e =>
            e.enemy.rune === step.rune &&
            e.enemy.position === step.index &&
            e.enemy.runePosition === step.position)
          .map(e => e.enemy);
  
        if (enemies.length > 0) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...enemies[0], type: 'enemy', group: enemies });
          setGroupTurnTracker({ group: enemies, index: 0 });
          return;
        }
      } else if (step.type === 'rune') {
        const runes = placedRunes
          .filter(r => r.rune.colorIndex === step.index && r.rune.posicion === step.position)
          .map(r => r.rune);
  
        if (runes.length > 0) {
          setTurnIndex(idx);
          setLastRealTurnIndex(idx);
          setCurrentTurnEntity({ ...runes[0], type: 'rune', group: runes });
          setGroupTurnTracker({ group: runes, index: 0 });
          return;
        }
      }
    }
  
    console.warn("No se encontró siguiente entidad disponible para el turno.");
  };

  const showToast = (enemyData) => {
    const translatedName = translations?.enemies?.[enemyData.id];
  
    toast(
      <AnimatedEnemyToast
        enemyData={enemyData}
        t={translations}

      />,
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastClassName: '!max-w-[800px] w-auto overflow-visible',
        bodyClassName: '!p-0 !m-0',
      }
    );
  };

  const showScenarioToast = (message, action = null, action2 = null, extra = null) => {
    const id = uuidv4();
    setScenarioToasts(prev => [...prev, { id, message, action, action2, extra }]);
  };

  if (!isLandscape) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in">
          <MdScreenRotation className="text-6xl mb-4 animate-spin-slow" />
          <p className="text-xl font-semibold">{ti.movil1}</p>
          <p className="text-sm mt-2 text-gray-300">{ti.movil2}</p>
        </div>
      </div>
    );
  }

  const rolesOnTop = ['defensor', 'lider', 'controlador'];
  const rolesOnBottom = ['apoyo', 'agresor'];

  const countsPerIndex = Array(11).fill(0).map((_, index) => {
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');
    return Math.max(heroesAbove.length + enemiesAbove.length, heroesBelow.length + enemiesBelow.length);
  });

  const maxCharactersInAnySlot = Math.max(...countsPerIndex);

  let slotHeightClass = 'h-[34rem]'; // Base height (ej. 192px o 48rem)
    if (maxCharactersInAnySlot >= 5) {
        slotHeightClass = 'h-[40rem]'; // Taller height (ej. 256px o 64rem)
    } else if (maxCharactersInAnySlot >= 3) {
        slotHeightClass = 'h-[40rem]'; // Intermediate height (ej. 224px o 56rem) - puedes añadir más granularidad
    } else if (maxCharactersInAnySlot >= 2) {
        slotHeightClass = 'h-[34rem]'; // Intermediate height (ej. 224px o 56rem) - puedes añadir más granularidad
    }

  const RuneCard = ({ rune, onRemove, flipped }) => {
    const tipo = rune.tipo;
    const defenseCounter = rune.defenseCounter;
    const { toggleRuneEffect } = useInitRunes();
    const applyEffect = rune.applyEffect !== false;
    const totalEnemies = placedEnemies.length;
    const totalHeroes = trackerData.placedHeroes?.length || 0;
    const replacementValue = totalHeroes <= 2 ? '2' : totalHeroes <= 4 ? '3' : '4';
  
    const bgColorMap = {
      runa: 'bg-indigo-700',
      asalto: 'bg-indigo-600',
      defensa: 'bg-green-700',
      incursion: 'bg-red-700'
    };
  
    const borderColorMap = {
      runa: 'border-indigo-400',
      asalto: 'border-indigo-300',
      defensa: 'border-green-400',
      incursion: 'border-red-400'
    };
  
    const renderSide = (caraB = false) => {
      const isCaraB = rune.cara === 'B';
      const isCaraA = rune.cara === 'A';
      const bgColor = bgColorMap[tipo] || 'bg-indigo-700';
      const borderColor = borderColorMap[tipo] || 'border-indigo-400';
      const title = ts[rune.id] || rune.id;
      const accion = ts[rune.accion] || rune.accion;
      const accion2 = ts[rune.accion2] || null;
      const y = ts.Y;
      const nombre = ts[rune.nombre]?.replace('{x}', replacementValue) || rune.nombre;
      const cartas = ts[rune.cartas] || rune.cartas;
      const posicion = rune.posicion;
      const isIncursion = tipo === 'incursion';
      const shouldHideContentIncursion = isIncursion && !caraB && totalEnemies > 0;
      return (
        <div className={`${posicion === 'abajo' ? 'absolute top-0 left-0 right-0' : 'absolute bottom-0 left-0 right-0'} backface-hidden ${ caraB ? 'rotate-y-180' : '' }`} >
          <div className={`p-0 rounded-lg border-2 shadow-md ${bgColor} ${borderColor} max-w-[90%] mx-auto sm:max-w-[140px]`} >
            {/* Título */}
            <div className="flex justify-center mb-1 text-white font-bold text-xs sm:text-sm text-center">
              {title}
            </div>
        
            {/* ✅ Contenido según tipo */}
            {(tipo === 'runa' || tipo === 'defensa') && (
              <>
                <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                  {accion} {rune.numRunas || ''}
                </div>
                <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                  {nombre}
                </div>
              </>
            )}
        
            {tipo === 'asalto' && (
              <>
                {isCaraA ? (
                  <>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {accion}
                    </div>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {accion2} {y}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {y} {accion2}
                    </div>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {accion}
                    </div>
                  </>
                )}
              </>
            )}
        
            {tipo === 'incursion' && (
              <>
                {isCaraB ? (
                  <>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                      {accion} {rune.numRunas}
                    </div>
                    <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                      {nombre}
                    </div>
                  </>
                ) : (
                  totalEnemies === 0 && (
                    <>
                      <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold">
                        {accion} {rune.numRunas}
                      </div>
                      <div className="text-[0.55rem] sm:text-[0.65rem] text-white text-center">
                        {nombre}
                      </div>
                    </>
                  )
                )}
              </>
            )}
        
            {/* Cara */}
            <div className="flex justify-center text-[0.55rem] sm:text-[0.65rem] italic text-indigo-100 text-center font-bold">
              {caraB ? (
                <RiArrowTurnForwardLine className="text-white text-xs sm:text-xs" />
              ) : (
                <RiArrowTurnBackLine className="text-white text-xs sm:text-xs" />
              )} {ti.cara} {rune.cara} {caraB ? (
                <RiArrowTurnForwardLine className="text-white text-xs sm:text-xs" />
              ) : (
                <RiArrowTurnBackLine className="text-white text-xs sm:text-xs" />
              )}
            </div>
        
            {/* Checkbox */}
            <div className="flex items-center justify-center mt-1 text-white text-[0.55rem] sm:text-[0.65rem]">
              <input
                type="checkbox"
                checked={applyEffect}
                onChange={() => toggleRuneEffect(rune.uuid)}
                className="mr-1"
              />
              <label>{ti.applyEffect}</label>
            </div>

            {/* Badge contador */}
            {tipo === 'defensa' && defenseCounter > 0 && (
              <div className="flex justify-center mt-1 ">
                <div className="text-center bg-red-600 text-white text-[0.55rem] sm:text-[0.65rem] font-bold px-1 py-1 rounded-full shadow">
                  {ti.contador} {defenseCounter}
                </div>
              </div>
            )}
            <div className="flex items-center justify-end mt-1 text-white text-[0.55rem] sm:text-[0.65rem]">
              <button
                onClick={() => onRemove(rune.uuid)}
                className="top-1 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center z-10"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <div className={`w-full perspective hover:scale-105`}>
        
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style preserve-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {renderSide(false)}
          {renderSide(true)}

        </div>
      </div>
    );
  };


 const CharacterCard = ({ name, image, position }) => (
    <div className="flex flex-col items-center mx-1">
      <div className="relative w-full max-w-[140px] hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-full h-auto object-cover rounded-lg border-2 border-[#800020]/70"
        />
        <div
          className="absolute w-full bottom-0 left-1/2 transform -translate-x-1/2 px-1 rounded-lg text-white text-xs text-center bg-[#800020]/70 leading-tight"
          style={{
            textShadow: '0 0 4px #b87333aa',
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
  
  const EnemyCard = ({ id, name, comportamiento, categoria, image, position, uuid, color, onRemove, vida, vidaMax, movimiento, ataque, openEnemyModal, ringColor, isFlipping, estadosAlterados }) => {
    const [flipped, setFlipped] = useState(false);
    const ringClass =
      ENEMY_RING_COLORS.find(r => r.id === ringColor)?.className ||
      ENEMY_RING_COLORS_BIG.find(r => r.id === ringColor)?.className ||
      '';

    useEffect(() => {
      if (isFlipping) {
        setFlipped(true);
        const timer = setTimeout(() => setFlipped(false), 900); // duración de flip
        return () => clearTimeout(timer);
      }
    }, [isFlipping]);
  
    return (
      <div
        key={uuid}
        className={classNames(
          "flex flex-col items-center mx-1 relative z-10 transition-transform duration-600",
          flipped ? "rotate-y-180" : ""
        )}
        style={{ perspective: "1000px" }}
      >
        <div className={classNames(
          "relative w-full max-w-[140px] hover:scale-105 rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.5)] transition-transform transform-style-preserve-3d",
          ringClass  // 👈 Aquí aplicas el anillo de color
        )}>
          <img
            src={image}
            alt={name}
            className={`w-full h-auto object-cover rounded-lg border-2 ${borderColorMap[color] || ''}`}
          />
          {/* ✅ Estados Alterados sobre la imagen */}
          <div className="absolute top-1 left-1 grid grid-rows-3 grid-flow-col gap-1">
            {estadosAlterados
              .filter(estado => estado.count > 0)
              .map((estado) => {
                const estadoConfig = ESTADOS_ALTERADOS.find(e => e.id === estado.id);
                if (!estadoConfig) return null;
                return (
                  <div key={estado.id} className="relative">
                    <img
                      src={estadoConfig.imagen}
                      alt={estadoConfig.texto}
                      className="w-5 h-5 border border-white rounded-full shadow-md"
                    />
                    {estado.count > 1 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.6rem] font-bold px-1 rounded-full">
                        {estado.count}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
            
          <div
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 px-1 py-0.5 border-2 rounded-lg text-white text-xs
              ${borderColorMap[color] || ''} 
              ${textBgColorMap[color] || 'bg-black/60'} 
              ${categoryTextGlowMap[categoria] || ''} 
              enemy-text-wrapper`}
          >
            <div className="flex flex-col w-full items-center leading-none" onClick={() => { openEnemyModal(uuid); }}>
              <span className="enemy-text leading-none">{name}</span>
              {comportamiento && (
                <span className="text-[0.50rem] italic leading-none mt-0.5 opacity-90">
                  {tb?.[comportamiento] || comportamiento}
                </span>
              )}
              <div className="w-full relative h-2 mt-2">
                <div className="absolute inset-0 flex items-center justify-center text-white text-[0.6rem] font-bold z-10">
                  {vida} / {vidaMax}
                </div>
                <div className="w-full h-full bg-red-900 rounded">
                  <div
                    className="h-full bg-red-500 rounded"
                    style={{ width: `${(vida / vidaMax) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSlot = (index) => {
    const isRune = Object.values(runesColorMap).includes(index);
    const isRuneTextSlot = index === 10;
    const runeColor = getRuneColorFromIndex(index);
    const heroesAbove = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnTop.includes(h.role));
    const heroesBelow = (trackerData.placedHeroes || []).filter(h => h.position === index && rolesOnBottom.includes(h.role));
    const enemiesAbove = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'arriba');
    const enemiesBelow = placedEnemies.filter(e => e.enemy.position === index && e.enemy.runePosition === 'abajo');
    const runesAbove = placedRunes.filter(r => r.rune.colorIndex === index && r.rune.posicion === 'arriba');
    const runesBelow = placedRunes.filter(r => r.rune.colorIndex === index && r.rune.posicion === 'abajo');

    const renderStack = (items, isTop, type = 'hero') => {
      const spacing = items.length <= 2 ? 90 : items.length === 3 ? 70 : items.length === 4 ? 40 : 30;
      const reversed = isTop ? [...items].reverse() : items;
      
      return reversed.map((item, i) => {
        const zIndex = isTop ? items.length + i : items.length - i;
        const offset = i * spacing;
        const style = isTop ? { bottom: `${offset}px`, zIndex } : { top: `${offset}px`, zIndex };
    
        const isCurrentTurn = currentTurnEntity && (
          (type === 'enemy' && item.enemy.uuid === currentTurnEntity.uuid) ||
          (type === 'rune' && item.uuid === currentTurnEntity.uuid) ||
          (type === 'hero' && item.id === currentTurnEntity.id)
        );
        const isEntityFlipping = type === 'enemy' && flippedCards.includes(item.enemy.uuid);
        return (
          <div key={ type === 'enemy' ? item.enemy.uuid : type === 'rune' ? item.uuid : item.id } className="absolute w-full transition-transform duration-300"
              style={{
              ...style,
              zIndex: isCurrentTurn ? 40 : style.zIndex ?? 100,
              transform: isCurrentTurn ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s ease-in-out'
            }}>
            <div className="relative items-center">
              {isCurrentTurn && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 rounded-full border-2 border-white bg-purple-600">
                  <GiWingedSword className="text-white animate-bounce" size={40} />
                </div>
              )}
              {type === 'enemy' && item.enemy.tipo === 'especial' ? (
                <CommanderCard carta={item.enemy} highlight={item.enemy.highlight} />
              ) : type === 'enemy' ? (
                <EnemyCard
                  uuid={item.enemy.uuid}
                  id={item.enemy.id}
                  name={getEnemyName(item.enemy.id, item.enemy.color)}
                  image={item.enemy.imagen}
                  comportamiento={item.enemy.comportamiento}
                  categoria={item.enemy.categoria}
                  position={isTop ? "top" : "bottom"}
                  color={item.enemy.color}
                  onRemove={onRemove}
                  vida={item.enemy.vida}
                  vidaMax={item.enemy.vidaMax}
                  movimiento={item.enemy.movimiento}
                  ataque={item.enemy.ataque}
                  openEnemyModal={openEnemyModal}
                  inmunidad={item.enemy.inmunidad}
                  tipo_ataque={item.enemy.tipo_ataque}
                  capacidades={item.enemy.capacidades}
                  ringColor={item.enemy.ringColor}
                  isFlipping={isEntityFlipping}
                  estadosAlterados={item.enemy.estadosAlterados}
                />
              ) : type === 'rune' ? (
                <RuneCard rune={item} onRemove={removeRuneByUUID} flipped={flippedCards.includes(item.uuid)} />
              ) : (
                <CharacterCard
                  name={getHeroName(item.id)}
                  image={item.image}
                  position={isTop ? "top" : "bottom"}
                />
              )}
            </div>
          </div>
        );   
      });
    };
    
    return (
      <div key={index} className={`flex flex-col w-full ${slotHeightClass} py-2`}>
        
        {/* Escalonado arriba */}
        <div className="relative flex justify-center h-1/2 w-full mb-5">
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            {renderStack(heroesAbove, true, 'hero')}
            {isRune && renderStack(enemiesAbove, true, 'enemy')}
            {isRuneTextSlot && renderStack(runesAbove.map(r => r.rune), true, 'rune')}
          </div>
        </div>
  
        {/* Centro del slot */}
        <div className="flex items-center justify-center h-8 shrink-0 bg-gray-300">
          <div className={classNames(
            'flex items-center justify-center font-fantasy',
            {
              'w-12 h-12 rotate-45 border-4 gem-orange': index === 1,
              'w-12 h-12 rotate-45 border-4 gem-green': index === 3,
              'w-12 h-12 rotate-45 border-4 gem-blue': index === 5,
              'w-12 h-12 rotate-45 border-4 gem-red': index === 7,
              'w-12 h-12 rotate-45 border-4 gem-gray': index === 9,
              'w-full h-10 bg-gray-300 text-black text-center shadow': index % 2 === 0
            })}>
            <span
              className={classNames(
                'block text-[0.6rem] sm:text-xs md:text-sm lg:text-base leading-none text-center whitespace-nowrap max-w-full overflow-hidden text-ellipsis'
              )}
              style={{ width: 'fit-content', maxWidth: '100%' }}
            >
              {index === 0 && tr.defensor ||
                index === 2 && tr.apoyo ||
                index === 4 && tr.lider ||
                index === 6 && tr.agresor ||
                index === 8 && tr.controlador ||
                index === 10 && ti.rune}
            </span>
            {/* Icono y contador si es runa */}
            {isRune && (
              <div className="absolute rotate-[-45deg] flex items-center gap-1 z-20">
                <GiAbstract065 className="text-white text-sm" />
                <span className="text-white text-xs font-bold">
                  {runes[runeColor] || 0}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Escalonado abajo */}
        <div className="relative flex justify-center h-1/2 w-full mt-5">
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            {renderStack(heroesBelow, false, 'hero')}
            {isRune && renderStack(enemiesBelow, false, 'enemy')}
            {isRuneTextSlot && renderStack(runesBelow.map(r => r.rune), false, 'rune')}
          </div>
        </div>
  
      </div>
    );
    

  };

  return ( 
      <PageTransition>
       
        <div className={isLandscape ? "" : "portrait-lock"}>
          <div className="p-4 text-gray-200 bg-gradient-to-b from-gray-900 to-black min-h-screen">
            <div className="no-header" />
            
            
            <TopMenu
              onAddEnemy={openCategorySelector}
              onSelectCommander={handleRandomCommander}
              onSelectBoss={handleSelectBoss}
              onAddManual={openManualSelector}
              behaviors={behaviors}
              onSelectRuneCard={handleAddRuneCard}
              onTileDraw={handleTileDraw}
            />
            {/* Puntos de aparición visibles encima del track */}
            {pilas.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2">{ti.gestionPilas || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {pilas.map(pila => (
                          <div key={pila.id} className="bg-gray-800 p-2 rounded text-center text-white border border-yellow-500">
                            
                            {pila.estado === 'reserva' ? (
                              <>
                                <div className="font-bold mb-2">{ti.pila} 🗃️</div>
                                <button
                                  className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => activarPila(pila.id)}
                                >
                                  ✅ {ti.activaPila || 'Activar Pila'}
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="font-bold mb-1">
                                  <span>{ti.pila} 🗃️</span>
                                  <input
                                    type="text"
                                    maxLength={5}
                                    value={codigosPilas[pila.id] || ''}
                                    onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                    className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                    placeholder="ABC12"
                                    title={ti.codigoPila}
                                  />
                                </div>
                                <div className="text-xs text-gray-300 mb-2">
                                  {ti.tamano}: {pila.tiles.length}
                                </div>
                                <div className="flex justify-center">
                                  <button
                                    className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => {
                                      const tile = removeTileFromPila(pila.id);
                                      if (tile) showTileToast(tile, 'retira');
                                      else alert(ti.emptyPila);
                                    }}
                                  >
                                    {ti.devolver}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                </div>
              </div>
            )}
            {pilasConcentrada.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2">{ti.gestionPilas2 || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {pilasConcentrada.map(pila => (
                        <div key={pila.id} className="bg-gray-800 p-2 rounded text-center text-white border border-yellow-500">
                          {pila.estado === 'reserva' ? (
                            <>
                              <div className="font-bold mb-2">{ti.nodo || 'Nodo'} 🗃️</div>
                              <button
                                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                onClick={() => activarPilaConcentrada(pila.id)}
                              >
                                ✅ {ti.activaNodo || 'Activar Nodo'}
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="font-bold mb-1">
                                <span>{ti.nodo || 'Nodo'} 🗃️</span>
                                <input
                                  type="text"
                                  maxLength={5}
                                  value={codigosPilas[pila.id] || ''}
                                  onChange={(e) => handleCodigoChange(pila.id, e.target.value)}
                                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center"
                                  placeholder="ABC12"
                                  title={ti.codigoPila}
                                />
                              </div>
                              <div className="text-xs text-gray-300 mb-2">
                                {ti.tamano}: {pila.tiles.length}
                              </div>
                              <div className="flex justify-center">
                                <button
                                  className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => {
                                    const tile = removeTileFromPilaConcentrada(pila.id);
                                    if (tile) showTileToast(tile, 'retira');
                                    else alert(ti.emptyPila);
                                  }}
                                >
                                  {ti.devolverNodo}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                 </div>
              </div>
            )}  
            {spawnPoints.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2">{ti.activeSpawnPoints || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {spawnPoints.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
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

            {/* Puntos de control de area visibles encima del track */}
            {controlPoints.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2cursor-help" title={ti.infoCA || ''}>{ti.activeBarricade || ''}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {controlPoints.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
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
            
              {/* LLaves rúnicas visibles encima del track */}
              {runeKeys.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2">{ti.activeRuneKeys}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {runeKeys.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
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

            {/* Aldeanos visibles encima del track */}
              {rescue.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-2">{ti.activeRescue}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {rescue.map(point => (
                      <div
                        key={point.uuid}
                        className={`px-3 py-1 rounded text-white ${colorMap[point.runa]} flex items-center gap-2`}
                      >
                        <span>{ti.colores[point.runa]}</span>
                        <button
                          onClick={() => removeRescue(point.uuid)}
                          className="bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            
            <div className="grid grid-cols-11 gap-0 auto-rows-auto bg-slate-700">
              {[...Array(11)].map((_, idx) => (
                <React.Fragment key={`${idx}-${currentTurnEntity?.uuid || currentTurnEntity?.id || 'none'}`}>
                  {renderSlot(idx)}
                </React.Fragment>
              ))}
            </div>

            {categorySelector.open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-4 rounded-xl shadow-lg text-white text-center">
                  <h2 className="text-lg mb-4">{ti.selectCategory}</h2>
                    {allowedCategories.map(cat => (
                      <button key={cat} onClick={() => handleCategorySelect(cat)} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded m-1">
                        {tc[cat] || cat}
                      </button>
                    ))}
                  <div className="mt-4 text-center">
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setCategorySelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Manual Selector Modal */}
            {manualSelector.open && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl text-yellow-300 mb-4">{ti.manualTitle || 'Seleccionar enemigo manualmente'}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(
                      getEnemiesByColor(enemiesInSelectedExpansions, manualSelector.color).reduce((acc, enemy) => {
                        if (!acc[enemy.id]) acc[enemy.id] = {};
                        if (!acc[enemy.id][enemy.categoria]) acc[enemy.id][enemy.categoria] = [];
                        acc[enemy.id][enemy.categoria].push(enemy);
                        return acc;
                      }, {})
                    ).map(([enemyId, categories]) => {
                      const sampleEnemy = Object.values(categories)[0][0]; // Para imagen y nombre
                    
                      return (
                        <div key={enemyId} className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
                          <img src={sampleEnemy.imagen} alt={enemyId} className="w-20 h-20 object-cover mb-2 rounded" />
                          <div className="text-sm text-white text-center mb-2">{getEnemyName(enemyId, manualSelector.color)}</div>
                    
                          {Object.entries(categories).map(([categoria, variants]) => (
                            <div key={categoria} className="w-full mb-2">
                              {specialCategories.includes(categoria) ? (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {variants
                                    .filter((variant, index, self) =>
                                      index === self.findIndex(v =>
                                        v.id === variant.id &&
                                        v.categoria === variant.categoria &&
                                        v.comportamiento === variant.comportamiento &&
                                        (v.cara === 'A' || !v.cara)
                                      )
                                    )
                                    .filter(v => v.cara === 'A' || !v.cara)
                                    .map(variant => (
                                      <button
                                        key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                      >
                                        {ti.addEnemy}
                                      </button>
                                    ))}
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs text-yellow-300 mb-1 text-center">{tc?.[categoria] || categoria}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {variants
                                      .filter((variant, index, self) =>
                                        index === self.findIndex(v =>
                                          v.id === variant.id &&
                                          v.categoria === variant.categoria &&
                                          v.comportamiento === variant.comportamiento &&
                                          (v.cara === 'A' || !v.cara) // si tiene cara, preferimos la A
                                        )
                                      )
                                      .filter(v => v.cara === 'A' || !v.cara) // segunda seguridad: solo mostramos cara A o sin cara
                                      .map(variant => (
                                        <button
                                          key={`${variant.id}-${variant.categoria}-${variant.comportamiento}`}
                                          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                                          onClick={() => handleManualEnemyAdd(variant.id, variant.comportamiento, variant.categoria)}
                                        >
                                          {tb?.[variant.comportamiento] || variant.comportamiento}
                                        </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => setManualSelector({ open: false, color: null })}
                    >
                      {ti.close || 'Cerrar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNextTurn}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full shadow-lg"
              >
                {ti.nextTurn || 'Siguiente turno'}
              </button>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow">
                {ti.goHome || 'Ir al inicio'}
              </button>
              <button onClick={() => navigate('/tracker')} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow">
                {ti.backToConfig || 'Volver a configuración'}
              </button>
            </div>
          </div>
        </div>
        <ToastContainer toastClassName="toast-expand" bodyClassName="" />
        {selectedEnemyUuid && (
          <ModalEnemyCard
            key={selectedEnemyUuid}
            uuid={selectedEnemyUuid}
            enemy={placedEnemies.find(e => e.enemy.uuid === selectedEnemyUuid)?.enemy}
            onClose={() => setSelectedEnemyUuid(null)}
            onDelete={onRemove}
            onVidaChange={updateEnemyVida}
            overhealedEnemies={overhealedEnemies}
            setOverhealedEnemies={setOverhealedEnemies}
            onEstadoChange={updateEnemyEstados}
          />
          )}
        {showPCModal && (
          <ModalCommanderPC
              onConfirm={(pcValue) => {
                onPCConfirm?.(pcValue);
                closePCModal();
              }}
            />
        )}
       
        <TileWarningModal
          message={tileWarning}
          onClose={() => setTileWarning(null)}
        />
        
        {warningMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
            {warningMessage}
          </div>
        )}

        <AnimatePresence>
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            {tileToasts.map(tile => (
              <motion.div
                key={tile.uuid}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                <TileToast
                  tile={tile}
                  tipo={tile.tipo}
                  onClose={() => handleCloseToast(tile)}
                />
              </motion.div>
            ))}
            {/* Contenedor de Toasts de Cartas de Defensa de la Aldea */}
          {scenarioToasts.map(toast => (
            <div
              key={toast.id}
              className="relative bg-purple-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-3"
            >
              <div className="flex flex-col">
                {/* ✅ Mensaje del toast */}
                {toast.message && (
                  <div className="font-semibold mt-1 uppercase text-yellow-300">{toast.message}</div> // nombre de la carta
                )}
  
                {toast.action && (
                  <div className="text-sm mt-1 whitespace-pre-line">{toast.action}</div> // acción principal
                )}
  
                 {toast.action2 && (
                  <div className="text-sm mt-1 whitespace-pre-line">{toast.action2}</div> // acción principal
                )}
                
                {toast.extra && (
                  <div className="text-xs mt-1 text-gray-300 whitespace-pre-line">
                    {toast.extra}
                  </div>
                )}
              </div>
              {/* ✅ Botón para cerrar manualmente */}
              <button
                onClick={() => {
                  setScenarioToasts(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="ml-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          ))}
          </div>
        </AnimatePresence>
      </PageTransition>
  );
};

export default InitTracker;
