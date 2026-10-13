import { getInitSnapshot } from './initSnapshotBridge';

const SNAPSHOT_VERSION = 1;

/** Strip Vite asset URLs; keep catalog id so hydrate can reattach. */
function stripEnemyImagen(entry) {
  if (!entry?.enemy) return entry;
  const { imagen, image, ...rest } = entry.enemy;
  return { ...entry, enemy: rest };
}

function stripScenarioMonster(monster) {
  if (!monster || typeof monster !== 'object') return monster;
  const { imagen, image, ...rest } = monster;
  return rest;
}

/** Recursively drop asset-like keys that bloat Firestore docs. */
function stripAssetFields(value) {
  if (Array.isArray(value)) return value.map(stripAssetFields);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (k === 'imagen' || k === 'image' || k === 'imagenSin') continue;
    out[k] = stripAssetFields(v);
  }
  return out;
}

/**
 * Build a plain JSON snapshot from live context values + InitTracker bridge.
 * @param {object} parts - data collected from React contexts
 */
export function collectSnapshot(parts) {
  const {
    language,
    selectedExpansions,
    trackerData,
    game,
    enemies,
    runes,
    route = '/init',
  } = parts;

  const initLocal = getInitSnapshot();

  const raw = {
    version: SNAPSHOT_VERSION,
    language,
    selectedExpansions: selectedExpansions || [],
    trackerData: trackerData || { heroes: [], roles: {}, enemies: [], behaviors: [] },
    game: {
      runes: game?.runes || {},
      availableTiles: game?.availableTiles || [],
      usedTiles: game?.usedTiles || [],
      discardedTiles: game?.discardedTiles || {},
      pilas: game?.pilas || [],
      pilasConcentrada: game?.pilasConcentrada || [],
      codigosPilas: game?.codigosPilas || {},
      contadorPilas: game?.contadorPilas ?? 1,
      contadorPilasConcentradas: game?.contadorPilasConcentradas ?? 1,
      spawnPoints: game?.spawnPoints || [],
      controlPoints: game?.controlPoints || [],
      runeKeys: game?.runeKeys || [],
      rescue: game?.rescue || [],
      scenarioMonster: stripScenarioMonster(game?.scenarioMonster),
      aldeanoDeck: game?.aldeanoDeck || [],
      errantesDeck: game?.errantesDeck || [],
      pilaDeRunas: game?.pilaDeRunas || [],
    },
    enemies: {
      placedEnemies: (enemies?.placedEnemies || []).map(stripEnemyImagen),
      usedColors: enemies?.usedColors || [],
      usedColorsBig: enemies?.usedColorsBig || [],
      enemyColorMap: enemies?.enemyColorMap || {},
      huespedActivo: !!enemies?.huespedActivo,
      acechoActivo: !!enemies?.acechoActivo,
      invadidosActivo: !!enemies?.invadidosActivo,
      oscuridadActivo: !!enemies?.oscuridadActivo,
      asaltoActivo: !!enemies?.asaltoActivo,
    },
    runes: {
      placedRunes: runes?.placedRunes || [],
      executedRunes: runes?.executedRunes || [],
    },
    init: initLocal,
    route,
  };

  return stripAssetFields(raw);
}

export { SNAPSHOT_VERSION };
