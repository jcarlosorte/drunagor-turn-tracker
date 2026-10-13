import { ENEMIES } from '@/data/enemies';
import { HEROES } from '@/data/heroes';
import { queueInitRestore, setInitSnapshot } from './initSnapshotBridge';

const SPECIAL_CATEGORIES = ['comandante', 'jefe', 'overlord', 'hero', 'esbirro', 'escenario'];

function findEnemyCatalog(enemy) {
  if (!enemy?.id) return null;
  const matches = ENEMIES.filter((e) => e.id === enemy.id);
  if (matches.length === 0) return null;
  if (SPECIAL_CATEGORIES.includes(enemy.categoria)) {
    return (
      matches.find((e) => e.categoria === enemy.categoria) ||
      matches[0]
    );
  }
  return (
    matches.find(
      (e) =>
        e.categoria === enemy.categoria &&
        e.comportamiento === enemy.comportamiento
    ) ||
    matches.find((e) => e.categoria === enemy.categoria) ||
    matches[0]
  );
}

function reattachEnemyImagen(entry) {
  if (!entry?.enemy) return entry;
  const catalog = findEnemyCatalog(entry.enemy);
  const heroFallback =
    !catalog && entry.enemy.categoria === 'hero'
      ? HEROES.find((h) => h.id === entry.enemy.id)
      : null;
  const imagen = catalog?.imagen || heroFallback?.image || entry.enemy.imagen;
  return {
    ...entry,
    enemy: { ...entry.enemy, imagen },
  };
}

function reattachScenarioMonster(monster) {
  if (!monster?.id) return monster;
  const catalog = findEnemyCatalog(monster);
  if (!catalog) return monster;
  return { ...monster, imagen: catalog.imagen };
}

/**
 * Apply a saved snapshot into existing context hydrators.
 * InitTracker local state is applied immediately if the bridge is ready,
 * otherwise queued until InitTracker mounts.
 */
export function hydrateSnapshot(snapshot, apis) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot');
  }

  const {
    setLanguage,
    hydrateExpansions,
    setTrackerData,
    hydrateGame,
    hydrateEnemies,
    setPlacedRunes,
    setExecutedRunes,
  } = apis;

  if (snapshot.language && setLanguage) setLanguage(snapshot.language);
  if (snapshot.selectedExpansions && hydrateExpansions) {
    hydrateExpansions(snapshot.selectedExpansions);
  }
  if (snapshot.trackerData && setTrackerData) {
    setTrackerData(snapshot.trackerData);
  }
  if (snapshot.game && hydrateGame) {
    hydrateGame({
      ...snapshot.game,
      scenarioMonster: reattachScenarioMonster(snapshot.game.scenarioMonster),
    });
  }
  if (snapshot.enemies && hydrateEnemies) {
    hydrateEnemies({
      ...snapshot.enemies,
      placedEnemies: (snapshot.enemies.placedEnemies || []).map(reattachEnemyImagen),
    });
  }
  if (snapshot.runes) {
    if (setPlacedRunes) setPlacedRunes(snapshot.runes.placedRunes || []);
    if (setExecutedRunes) setExecutedRunes(snapshot.runes.executedRunes || []);
  }

  if (snapshot.init) {
    // Apply if InitTracker is already mounted; also queue for fresh mount.
    setInitSnapshot(snapshot.init);
    queueInitRestore(snapshot.init);
  }

  return snapshot.route || '/init';
}
