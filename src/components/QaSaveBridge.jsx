import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSaveGame } from '@/save/useSaveGame';
import { useInitEnemies } from '@/context/InitEnemiesContext';
import { useGame } from '@/context/GameContext';
import { useTracker } from '@/context/TrackerContext';
import { useInitRunes } from '@/context/InitRunesContext';
import { useExpansions } from '@/context/ExpansionContext';
import { getInitSnapshot, setInitSnapshot } from '@/save/initSnapshotBridge';
import { ENEMIES } from '@/data/enemies';
import { ESTADOS_ALTERADOS } from '@/data/estadosAlterados';
import { ENEMY_RING_COLORS } from '@/data/enemyRings';
import { RUNAS, ASALTO } from '@/data/runas';
import { FICHAS } from '@/data/fichas';
import { ALDEANO, ERRANTES } from '@/data/cartasEspeciales';
import {
  listLocalSaves,
  createLocalSave,
  deleteLocalSave,
} from '@/save/localSaves';

const STATUS_POOL = ESTADOS_ALTERADOS.map((e) => e.id);

function pickEnemy(id, categoria, comportamiento) {
  return ENEMIES.find((e) => {
    if (e.id !== id) return false;
    if (categoria && e.categoria !== categoria) return false;
    if (comportamiento && e.comportamiento !== comportamiento) return false;
    return e.cara !== 'B';
  });
}

function makeEstados(seed) {
  // Different mix of statuses per monster
  const picks = [
    STATUS_POOL[seed % STATUS_POOL.length],
    STATUS_POOL[(seed * 3 + 1) % STATUS_POOL.length],
    STATUS_POOL[(seed * 7 + 2) % STATUS_POOL.length],
  ];
  const unique = [...new Set(picks)];
  return ESTADOS_ALTERADOS.map((e) => {
    const idx = unique.indexOf(e.id);
    if (idx === -1) return { id: e.id, count: 0 };
    return { id: e.id, count: Math.min(e.max || 4, idx + 1 + (seed % 2)) };
  });
}

function enemyPayload(selected, overrides = {}) {
  const uuid = overrides.uuid || uuidv4();
  return {
    enemy: {
      uuid,
      name: selected.nombre,
      id: selected.id,
      rune: selected.rune,
      imagen: selected.imagen,
      runePosition: selected.runePosition,
      position: overrides.position ?? 5,
      categoria: selected.categoria,
      comportamiento: selected.comportamiento || selected.categoria,
      vida: overrides.vida ?? selected.vida,
      vidaMax: overrides.vidaMax ?? selected.vida,
      movimiento: selected.movimiento,
      ataque: selected.ataque,
      color: selected.color,
      inmunidad: selected.inmunidad,
      tipo_ataque: selected.tipo_ataque,
      capacidades: selected.capacidades,
      capacidadesOriginales: selected.capacidades,
      cara: selected.cara,
      estadosAlterados: overrides.estadosAlterados || makeEstados(0),
      ringColor: overrides.ringColor,
    },
  };
}

/** 15 monsters: mix of ids / ranks / behaviors / HP deltas */
const MEGA_MONSTER_SPECS = [
  { id: 'skeleton_archer', categoria: 'campeon', comportamiento: 'estandar', dmg: 4 },
  { id: 'skeleton_archer', categoria: 'veterano', comportamiento: 'alternativo', dmg: 2 },
  { id: 'skeleton_archer', categoria: 'soldado', comportamiento: 'estandar', dmg: 7 },
  { id: 'dark_vampire', categoria: 'campeon', comportamiento: 'alternativo', dmg: 5 },
  { id: 'dark_vampire', categoria: 'veterano', comportamiento: 'estandar', dmg: 9 },
  { id: 'dark_vampire', categoria: 'bisoño', comportamiento: 'alternativo', dmg: 1 },
  { id: 'rotten_flesh', categoria: 'campeon', comportamiento: 'estandar', dmg: 6 },
  { id: 'rotten_flesh', categoria: 'veterano', comportamiento: 'complejo', dmg: 3 },
  { id: 'rotten_flesh', categoria: 'soldado', comportamiento: 'alternativo', dmg: 8 },
  { id: 'shadow_cultist', categoria: 'campeon', comportamiento: 'complejo', dmg: 4 },
  { id: 'shadow_cultist', categoria: 'veterano', comportamiento: 'estandar', dmg: 2 },
  { id: 'executioner', categoria: 'soldado', comportamiento: 'alternativo', dmg: 5 },
  { id: 'executioner', categoria: 'bisoño', comportamiento: 'estandar', dmg: 1 },
  { id: 'shadow_knight', categoria: 'campeon', comportamiento: 'estandar', dmg: 10 },
  { id: 'abomination', categoria: 'veterano', comportamiento: 'alternativo', dmg: 6 },
];

/**
 * window.__DRUNAGOR_QA__ — mega scenario (5 heroes vs 15 monsters) + save/load.
 */
export default function QaSaveBridge() {
  const { collect, apply } = useSaveGame();
  const enemiesApi = useInitEnemies();
  const gameApi = useGame();
  const { setTrackerData } = useTracker();
  const runesApi = useInitRunes();
  const { hydrateExpansions } = useExpansions();

  const ref = useRef({});
  ref.current = {
    collect,
    apply,
    enemiesApi,
    gameApi,
    setTrackerData,
    runesApi,
    hydrateExpansions,
  };

  useEffect(() => {
    const flush = (ms = 50) => new Promise((r) => setTimeout(r, ms));

    const deepFingerprint = () => {
      const { enemiesApi: e, gameApi: g, runesApi: r } = ref.current;
      const snap = ref.current.collect();
      const init = getInitSnapshot() || {};
      return {
        route: window.location.pathname,
        language: snap.language,
        expansions: [...(snap.selectedExpansions || [])].sort(),
        tracker: {
          heroes: [...(snap.trackerData?.heroes || [])].sort(),
          roles: snap.trackerData?.roles || {},
          enemies: [...(snap.trackerData?.enemies || [])].sort(),
          behaviors: [...(snap.trackerData?.behaviors || [])].sort(),
        },
        boardEnemies: (e.placedEnemies || [])
          .map((x) => ({
            uuid: x.enemy?.uuid,
            id: x.enemy?.id,
            categoria: x.enemy?.categoria,
            comportamiento: x.enemy?.comportamiento,
            vida: x.enemy?.vida,
            vidaMax: x.enemy?.vidaMax,
            estados: (x.enemy?.estadosAlterados || [])
              .filter((s) => s.count > 0)
              .map((s) => `${s.id}:${s.count}`)
              .sort(),
          }))
          .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid))),
        flags: {
          huesped: !!e.huespedActivo,
          acecho: !!e.acechoActivo,
          invadidos: !!e.invadidosActivo,
          oscuridad: !!e.oscuridadActivo,
          asalto: !!e.asaltoActivo,
        },
        colors: {
          mapSize: Object.keys(e.enemyColorMap || {}).length,
        },
        runes: { ...(g.runes || {}) },
        bags: {
          available: g.availableTiles?.length ?? 0,
          used: g.usedTiles?.length ?? 0,
          discarded: Object.values(g.discardedTiles || {}).reduce(
            (n, arr) => n + (arr?.length || 0),
            0
          ),
        },
        pilas: {
          normal: g.pilas?.length ?? 0,
          concentrada: g.pilasConcentrada?.length ?? 0,
          codigos: Object.keys(g.codigosPilas || {}).length,
          contador: g.contadorPilas,
          contadorConc: g.contadorPilasConcentradas,
        },
        points: {
          spawn: g.spawnPoints?.length ?? 0,
          control: g.controlPoints?.length ?? 0,
          runeKeys: g.runeKeys?.length ?? 0,
          rescue: g.rescue?.length ?? 0,
        },
        decks: {
          aldeano: g.aldeanoDeck?.length ?? 0,
          errantes: g.errantesDeck?.length ?? 0,
        },
        scenarioMonsterId: g.scenarioMonster?.id || null,
        placedRunes: (r.placedRunes || []).map((x) => ({
          id: x.rune?.id,
          tipo: x.rune?.tipo,
          cara: x.rune?.cara,
          applyEffect: x.rune?.applyEffect,
        })),
        executedRunes: [...(r.executedRunes || [])],
        init: {
          turnIndex: init.turnIndex,
          lastRealTurnIndex: init.lastRealTurnIndex,
          extraTurnsQueue: [...(init.extraTurnsQueue || [])],
          extraTurnIndex: init.extraTurnIndex,
          extraTurnTotal: init.extraTurnTotal,
          flippedCards: [...(init.flippedCards || [])].sort(),
          enemyEvolutions: [...(init.enemyEvolutions || [])],
          overhealed: [...(init.overhealedEnemies || [])].sort(),
          selectedRuneCards: init.selectedRuneCards?.length ?? 0,
        },
      };
    };

    const diffFp = (a, b, path = '') => {
      const diffs = [];
      if (JSON.stringify(a) === JSON.stringify(b)) return diffs;
      if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
        diffs.push(`${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
        return diffs;
      }
      if (Array.isArray(a) || Array.isArray(b)) {
        if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push(`${path}: array mismatch`);
        return diffs;
      }
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const k of keys) {
        diffs.push(...diffFp(a[k], b[k], path ? `${path}.${k}` : k));
      }
      return diffs;
    };

    const seedFiveHeroes = () => {
      const data = {
        heroes: ['lorelai', 'elros', 'jaheen', 'maya', 'vorn'],
        roles: {
          lorelai: 'defensor',
          elros: 'agresor',
          jaheen: 'apoyo',
          maya: 'controlador',
          vorn: 'lider',
        },
        enemies: [
          'skeleton_archer',
          'dark_vampire',
          'rotten_flesh',
          'shadow_cultist',
          'executioner',
          'shadow_knight',
          'abomination',
          'undead_king_boss',
        ],
        behaviors: ['estandar', 'alternativo', 'complejo'],
      };
      localStorage.setItem('trackerData', JSON.stringify(data));
      localStorage.setItem('expansions', JSON.stringify(['base', 'luccanor', 'undead_dragon']));
      ref.current.setTrackerData(data);
      ref.current.hydrateExpansions(['base', 'luccanor', 'undead_dragon']);
      return data;
    };

    /** Deterministic bag: track / discarded / pilas without racing React setters */
    const depleteBagHeavily = async () => {
      const all = FICHAS.map((f, i) => ({ ...f, uuid: `mega-tile-${i}` }));
      const byColor = (c) => all.filter((t) => t.runa === c);
      const take = (arr, n) => arr.splice(0, n);

      const pools = {
        rojo: byColor('rojo'),
        azul: byColor('azul'),
        verde: byColor('verde'),
        naranja: byColor('naranja'),
        gris: byColor('gris'),
      };

      const usedTiles = [
        ...take(pools.rojo, 4),
        ...take(pools.azul, 3),
        ...take(pools.verde, 3),
        ...take(pools.naranja, 2),
        ...take(pools.gris, 2),
      ];
      const discardedTiles = {
        rojo: take(pools.rojo, 2),
        azul: take(pools.azul, 2),
        verde: take(pools.verde, 2),
        naranja: take(pools.naranja, 2),
        gris: take(pools.gris, 2),
      };
      const pilaTiles = [
        take(pools.rojo, 1)[0],
        take(pools.azul, 1)[0],
        take(pools.verde, 1)[0],
        take(pools.naranja, 1)[0],
        take(pools.gris, 1)[0],
      ].filter(Boolean);
      const pila2Tiles = [
        take(pools.rojo, 1)[0],
        take(pools.azul, 1)[0],
        take(pools.verde, 1)[0],
        take(pools.naranja, 1)[0],
        take(pools.gris, 1)[0],
      ].filter(Boolean);
      const concTiles = [
        take(pools.rojo, 1)[0],
        take(pools.azul, 1)[0],
        take(pools.verde, 1)[0],
      ].filter(Boolean);

      const availableTiles = [
        ...pools.rojo,
        ...pools.azul,
        ...pools.verde,
        ...pools.naranja,
        ...pools.gris,
      ];
      const pila1Id = 'mega-pila-1';
      const pila2Id = 'mega-pila-2';
      const concId = 'mega-pila-conc-1';

      ref.current.gameApi.hydrateGame({
        runes: { rojo: 4, azul: 3, verde: 3, naranja: 2, gris: 2 },
        availableTiles,
        usedTiles,
        discardedTiles,
        pilas: [
          { id: pila1Id, tiles: pilaTiles, estado: 'activa', numPila: 1 },
          { id: pila2Id, tiles: pila2Tiles, estado: 'reserva', numPila: 2 },
        ],
        pilasConcentrada: [
          { id: concId, tiles: concTiles, estado: 'reserva', numPila: 1 },
        ],
        codigosPilas: { [pila1Id]: 'MEGA1', [pila2Id]: 'MEGA2' },
        contadorPilas: 3,
        contadorPilasConcentradas: 2,
        spawnPoints: [
          { id: 'sp1', tipo: 'runa', runa: 'rojo' },
          { id: 'sp2', tipo: 'runa', runa: 'azul' },
        ],
        controlPoints: [{ id: 'cp1' }, { id: 'cp2' }],
        runeKeys: [{ id: 'rk1' }],
        rescue: [{ id: 'rs1' }],
        scenarioMonster: { id: 'undead_king_boss_1', nombre: 'Undead King Boss' },
        aldeanoDeck: ALDEANO.slice(1).map((c, i) => ({ ...c, uuid: `al-${i}` })),
        errantesDeck: ERRANTES.slice(1).map((c, i) => ({ ...c, uuid: `er-${i}` })),
      });
      await flush(80);
    };

    window.__DRUNAGOR_QA__ = {
      deepFingerprint,
      diffFp,
      collect: () => ref.current.collect(),
      apply: (snap) => ref.current.apply(snap),
      listLocal: listLocalSaves,
      deleteLocal: deleteLocalSave,
      seedTracker: seedFiveHeroes,

      buildMegaScenario: async () => {
        const { enemiesApi: e, gameApi: g, runesApi: r } = ref.current;
        seedFiveHeroes();
        await flush(40);
        e.resetPlacedEnemies();
        r.resetPlacedRunes();
        g.resetTiles();
        await flush(80);

        const placedMeta = [];
        const colorMap = {};
        const usedColors = [];

        for (let i = 0; i < MEGA_MONSTER_SPECS.length; i++) {
          const spec = MEGA_MONSTER_SPECS[i];
          const selected = pickEnemy(spec.id, spec.categoria, spec.comportamiento);
          if (!selected || selected.vida == null) {
            placedMeta.push({ i, id: spec.id, error: 'not found' });
            continue;
          }
          const uuid = uuidv4();
          const ring = ENEMY_RING_COLORS[i % ENEMY_RING_COLORS.length].id;
          colorMap[uuid] = ring;
          usedColors.push(ring);
          const vidaMax = selected.vida;
          const vida = Math.max(1, vidaMax - (spec.dmg || 0));
          e.placeEnemy(
            enemyPayload(selected, {
              uuid,
              vida,
              vidaMax,
              position: i % 10,
              ringColor: ring,
              estadosAlterados: makeEstados(i + 1),
            })
          );
          placedMeta.push({
            uuid,
            id: selected.id,
            categoria: selected.categoria,
            comportamiento: selected.comportamiento,
            vida,
            vidaMax,
            estados: makeEstados(i + 1)
              .filter((s) => s.count > 0)
              .map((s) => `${s.id}:${s.count}`),
          });
          await flush(25);
        }

        // Boss #15 already in list as abomination; add real boss as 16th? user asked 15 — we have 15 specs.
        e.setUsedColors([...new Set(usedColors)]);
        e.setEnemyColorMap(colorMap);

        e.activaHuesped();
        e.activaAcecho();
        e.activaInvadidos();
        e.activaOscuridad();
        e.activaAsalto();

        await depleteBagHeavily();

        // Direct setters avoid placeRune's stale "exists" check + alert
        r.setPlacedRunes([
          {
            rune: {
              uuid: uuidv4(),
              ...RUNAS[0],
              colorIndex: 10,
              applyEffect: true,
              estadosAlterados: [{ id: 'TIEMPO', count: 3 }],
            },
          },
          {
            rune: {
              uuid: uuidv4(),
              ...ASALTO[0],
              colorIndex: 10,
              applyEffect: false,
              estadosAlterados: [],
            },
          },
        ]);
        r.setExecutedRunes([RUNAS[0].id, 'mega-exec']);
        await flush(80);

        const uuids = placedMeta.map((p) => p.uuid).filter(Boolean);
        setInitSnapshot({
          turnIndex: 5,
          currentTurnEntity: uuids[0]
            ? { uuid: uuids[0], type: 'enemy' }
            : null,
          groupTurnTracker: { group: uuids.slice(0, 5), index: 2 },
          lastRealTurnIndex: 4,
          extraTurnsQueue: uuids.slice(0, 3),
          extraTurnIndex: 1,
          extraTurnTotal: 3,
          selectedRuneCards: [RUNAS[0], ASALTO[0]],
          flippedCards: uuids.slice(0, 4),
          enemyEvolutions: ['evo-a', 'evo-b', 'evo-c'],
          overhealedEnemies: uuids.slice(2, 6),
        });
        // Fingerprint immediately — InitTracker may advance turns after the guard
        await flush(80);
        const fp = deepFingerprint();
        return {
          placedCount: placedMeta.filter((p) => p.uuid).length,
          heroes: 5,
          placedMeta,
          fingerprint: fp,
          bag: fp.bags,
        };
      },

      saveLocal: async (name) => {
        await flush(40);
        const snapshot = ref.current.collect();
        const id = await createLocalSave({
          name: name || `qa-mega-${Date.now()}`,
          snapshot,
          route: snapshot.route,
        });
        return { id, fingerprint: deepFingerprint(), bytes: JSON.stringify(snapshot).length };
      },

      loadLocal: async (id) => {
        const list = await listLocalSaves();
        const row = list.find((s) => s.id === id);
        if (!row?.snapshot) throw new Error('save not found');
        ref.current.apply(row.snapshot);
        await flush(250);
        return { id, fingerprint: deepFingerprint() };
      },

      runMegaRoundtrip: async (name = 'qa-mega-5v15') => {
        const built = await window.__DRUNAGOR_QA__.buildMegaScenario();
        if (built.placedCount < 15) {
          return {
            pass: false,
            error: `only placed ${built.placedCount}/15 monsters`,
            placedMeta: built.placedMeta,
          };
        }
        const saved = await window.__DRUNAGOR_QA__.saveLocal(name);
        // Re-fingerprint right after save (same React commit as persisted data)
        const before = deepFingerprint();
        ref.current.enemiesApi.resetPlacedEnemies();
        ref.current.runesApi.resetPlacedRunes();
        ref.current.gameApi.hydrateGame({
          runes: { rojo: 0, azul: 0, verde: 0, naranja: 0, gris: 0 },
          availableTiles: [],
          usedTiles: [],
          discardedTiles: { rojo: [], azul: [], verde: [], naranja: [], gris: [] },
          pilas: [],
          pilasConcentrada: [],
          codigosPilas: {},
          spawnPoints: [],
          controlPoints: [],
          runeKeys: [],
          rescue: [],
          scenarioMonster: null,
          aldeanoDeck: [],
          errantesDeck: [],
        });
        setInitSnapshot({
          turnIndex: -1,
          currentTurnEntity: null,
          groupTurnTracker: { group: [], index: 0 },
          lastRealTurnIndex: null,
          extraTurnsQueue: [],
          extraTurnIndex: 0,
          extraTurnTotal: 0,
          selectedRuneCards: [],
          flippedCards: [],
          enemyEvolutions: [],
          overhealedEnemies: [],
        });
        await flush(120);
        const loaded = await window.__DRUNAGOR_QA__.loadLocal(saved.id);
        // Under hydrate guard (~3s) — sample before InitTracker mutates turns
        await flush(400);
        const after = deepFingerprint();
        const diffs = diffFp(before, after);
        return {
          pass: diffs.length === 0,
          diffs: diffs.slice(0, 50),
          saveId: saved.id,
          bytes: saved.bytes,
          placedCount: built.placedCount,
          bagBefore: before.bags,
          bagAfter: after.bags,
          summary: {
            heroes: after.tracker.heroes.length,
            monsters: after.boardEnemies.length,
            uniqueVidas: [...new Set(after.boardEnemies.map((e) => e.vida))].length,
            monstersWithStatuses: after.boardEnemies.filter((e) => e.estados.length > 0)
              .length,
            runes: after.runes,
            flags: after.flags,
            pilas: after.pilas,
            points: after.points,
            init: after.init,
            placedRunes: after.placedRunes.length,
          },
        };
      },

      /** Soft wipe roundtrip kept for smaller tests */
      runComplexRoundtrip: async (name = 'qa-complex-1') =>
        window.__DRUNAGOR_QA__.runMegaRoundtrip(name),

      /** Prepare hard reload: save + stash fingerprint in sessionStorage */
      prepareHardReload: async (name = 'qa-mega-hard-5v15') => {
        const built = await window.__DRUNAGOR_QA__.buildMegaScenario();
        if (built.placedCount < 15) {
          return { ok: false, error: `placed ${built.placedCount}/15` };
        }
        const saved = await window.__DRUNAGOR_QA__.saveLocal(name);
        const before = deepFingerprint();
        sessionStorage.setItem(
          '__QA_HARD__',
          JSON.stringify({ saveId: saved.id, before, bytes: saved.bytes })
        );
        return { ok: true, saveId: saved.id, bytes: saved.bytes, monsters: before.boardEnemies.length };
      },

      /** After hard reload: load stashed save and diff */
      finishHardReload: async () => {
        const raw = sessionStorage.getItem('__QA_HARD__');
        if (!raw) return { pass: false, error: 'no __QA_HARD__ stash' };
        const { saveId, before, bytes } = JSON.parse(raw);
        await flush(200);
        await window.__DRUNAGOR_QA__.loadLocal(saveId);
        await flush(400);
        const after = deepFingerprint();
        const diffs = diffFp(before, after);
        sessionStorage.removeItem('__QA_HARD__');
        return {
          pass: diffs.length === 0,
          diffs: diffs.slice(0, 50),
          saveId,
          bytes,
          bagBefore: before.bags,
          bagAfter: after.bags,
          summary: {
            heroes: after.tracker.heroes.length,
            monsters: after.boardEnemies.length,
            uniqueVidas: [...new Set(after.boardEnemies.map((e) => e.vida))].length,
            monstersWithStatuses: after.boardEnemies.filter((e) => e.estados.length > 0)
              .length,
            flags: after.flags,
            runes: after.runes,
            pilas: after.pilas,
            init: after.init,
            placedRunes: after.placedRunes.length,
          },
        };
      },
    };

    return () => {
      delete window.__DRUNAGOR_QA__;
    };
  }, []);

  return null;
}
