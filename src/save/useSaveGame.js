import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useExpansions } from '@/context/ExpansionContext';
import { useTracker } from '@/context/TrackerContext';
import { useGame } from '@/context/GameContext';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { useInitRunes } from '@/context/InitRunesContext';
import { collectSnapshot } from './snapshot';
import { hydrateSnapshot } from './hydrate';

/** Collect / apply save snapshots using live contexts. */
export function useSaveGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { selectedExpansions, hydrateExpansions } = useExpansions();
  const { trackerData, setTrackerData } = useTracker();
  const game = useGame();
  const enemies = useInitEnemies();
  const runesCtx = useInitRunes();

  const collect = useCallback(() => {
    return collectSnapshot({
      language,
      selectedExpansions,
      trackerData,
      game: {
        runes: game.runes,
        availableTiles: game.availableTiles,
        usedTiles: game.usedTiles,
        discardedTiles: game.discardedTiles,
        pilas: game.pilas,
        pilasConcentrada: game.pilasConcentrada,
        codigosPilas: game.codigosPilas,
        contadorPilas: game.contadorPilas,
        contadorPilasConcentradas: game.contadorPilasConcentradas,
        spawnPoints: game.spawnPoints,
        controlPoints: game.controlPoints,
        runeKeys: game.runeKeys,
        rescue: game.rescue,
        scenarioMonster: game.scenarioMonster,
        aldeanoDeck: game.aldeanoDeck,
        errantesDeck: game.errantesDeck,
        pilaDeRunas: game.pilaDeRunas,
      },
      enemies: {
        placedEnemies: enemies.placedEnemies,
        usedColors: enemies.usedColors,
        usedColorsBig: enemies.usedColorsBig,
        enemyColorMap: enemies.enemyColorMap,
        huespedActivo: enemies.huespedActivo,
        acechoActivo: enemies.acechoActivo,
        invadidosActivo: enemies.invadidosActivo,
        oscuridadActivo: enemies.oscuridadActivo,
        asaltoActivo: enemies.asaltoActivo,
      },
      runes: {
        placedRunes: runesCtx.placedRunes,
        executedRunes: runesCtx.executedRunes,
      },
      route: location.pathname || '/init',
    });
  }, [
    language,
    selectedExpansions,
    trackerData,
    game,
    enemies,
    runesCtx.placedRunes,
    runesCtx.executedRunes,
    location.pathname,
  ]);

  const apply = useCallback(
    (snapshot) => {
      const route = hydrateSnapshot(snapshot, {
        setLanguage,
        hydrateExpansions,
        setTrackerData,
        hydrateGame: game.hydrateGame,
        hydrateEnemies: enemies.hydrateEnemies,
        setPlacedRunes: runesCtx.setPlacedRunes,
        setExecutedRunes: runesCtx.setExecutedRunes,
      });
      const target = route || '/init';
      if (location.pathname !== target) {
        navigate(target, { replace: true });
      } else if (target === '/init') {
        // Force remount-friendly refresh of init bridge consumer
        navigate('/init', { replace: true });
      }
    },
    [
      setLanguage,
      hydrateExpansions,
      setTrackerData,
      game.hydrateGame,
      enemies.hydrateEnemies,
      runesCtx.setPlacedRunes,
      runesCtx.setExecutedRunes,
      navigate,
      location.pathname,
    ]
  );

  return { collect, apply };
}
