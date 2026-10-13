import { sanitizeForFirestore, MAX_SAVE_SLOTS } from './firestoreSaves';

const DB_NAME = 'drunagor-saves';
const STORE = 'saves';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('aborted'));
  });
}

export async function listLocalSaves() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const rows = (req.result || []).map((row) => ({
        id: row.id,
        name: row.name || 'Untitled',
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
        version: row.version || 1,
        route: row.route || '/init',
        snapshot: row.snapshot || null,
        storage: 'local',
      }));
      rows.sort((a, b) => (b.updatedAt?.getTime?.() || 0) - (a.updatedAt?.getTime?.() || 0));
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function createLocalSave({ name, snapshot, route }) {
  const existing = await listLocalSaves();
  if (existing.length >= MAX_SAVE_SLOTS) {
    const err = new Error('MAX_SLOTS');
    err.code = 'MAX_SLOTS';
    throw err;
  }
  const clean = sanitizeForFirestore(snapshot);
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const row = {
    id,
    name: (name || 'Untitled').trim().slice(0, 80),
    version: clean?.version || 1,
    route: route || clean?.route || '/init',
    snapshot: clean,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  };
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(row);
  await txDone(tx);
  return id;
}

export async function updateLocalSave(saveId, { name, snapshot, route }) {
  const db = await openDb();
  const existing = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(saveId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if (!existing) throw new Error('NOT_FOUND');

  const clean = snapshot != null ? sanitizeForFirestore(snapshot) : existing.snapshot;
  const row = {
    ...existing,
    name: name != null ? String(name).trim().slice(0, 80) : existing.name,
    snapshot: clean,
    version: clean?.version || existing.version || 1,
    route: route || clean?.route || existing.route || '/init',
    updatedAt: Date.now(),
  };
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(row);
  await txDone(tx);
}

export async function deleteLocalSave(saveId) {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).delete(saveId);
  await txDone(tx);
}
