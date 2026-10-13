import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase';

export const MAX_SAVE_SLOTS = 20;
/** Soft warning; Firestore hard limit is ~1 MiB per document. */
export const MAX_SAVE_BYTES = 900_000;

function savesCol(uid) {
  if (!db) throw new Error('Firebase is not configured');
  return collection(db, 'users', uid, 'saves');
}

/**
 * Firestore rejects `undefined` and non-JSON values.
 * Round-trip through JSON to get a plain, writable payload.
 */
export function sanitizeForFirestore(value) {
  try {
    return JSON.parse(
      JSON.stringify(value, (_key, v) => {
        if (typeof v === 'function') return undefined;
        if (typeof v === 'number' && !Number.isFinite(v)) return null;
        return v;
      })
    );
  } catch (err) {
    const e = new Error('SNAPSHOT_NOT_SERIALIZABLE');
    e.code = 'SNAPSHOT_NOT_SERIALIZABLE';
    e.cause = err;
    throw e;
  }
}

function withTimeout(promise, ms, code = 'TIMEOUT') {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      const err = new Error(code);
      err.code = code;
      reject(err);
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

export async function listSaves(uid) {
  // No orderBy: avoids index waits; sort client-side.
  const snap = await withTimeout(getDocs(savesCol(uid)), 15000);
  const rows = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || 'Untitled',
      updatedAt: data.updatedAt?.toDate?.() || null,
      version: data.version || 1,
      route: data.route || '/init',
      snapshot: data.snapshot || null,
    };
  });
  rows.sort((a, b) => {
    const ta = a.updatedAt?.getTime?.() || 0;
    const tb = b.updatedAt?.getTime?.() || 0;
    return tb - ta;
  });
  return rows;
}

export async function createSave(uid, { name, snapshot, route }) {
  const existing = await listSaves(uid);
  if (existing.length >= MAX_SAVE_SLOTS) {
    const err = new Error('MAX_SLOTS');
    err.code = 'MAX_SLOTS';
    throw err;
  }
  const cleanSnapshot = sanitizeForFirestore(snapshot);
  const payload = sanitizeForFirestore({
    name: (name || 'Untitled').trim().slice(0, 80),
    version: cleanSnapshot?.version || 1,
    route: route || cleanSnapshot?.route || '/init',
    snapshot: cleanSnapshot,
  });
  const approxBytes = new Blob([JSON.stringify(payload)]).size;
  if (approxBytes > MAX_SAVE_BYTES) {
    const err = new Error('SAVE_TOO_LARGE');
    err.code = 'SAVE_TOO_LARGE';
    err.bytes = approxBytes;
    throw err;
  }
  const ref = await withTimeout(
    addDoc(savesCol(uid), {
      ...payload,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }),
    20000
  );
  return ref.id;
}

export async function updateSave(uid, saveId, { name, snapshot, route }) {
  const ref = doc(db, 'users', uid, 'saves', saveId);
  const payload = {
    updatedAt: serverTimestamp(),
  };
  if (name != null) payload.name = String(name).trim().slice(0, 80);
  if (snapshot != null) {
    const cleanSnapshot = sanitizeForFirestore(snapshot);
    payload.snapshot = cleanSnapshot;
    payload.version = cleanSnapshot.version || 1;
    payload.route = route || cleanSnapshot.route || '/init';
    const approxBytes = new Blob([JSON.stringify(payload)]).size;
    if (approxBytes > MAX_SAVE_BYTES) {
      const err = new Error('SAVE_TOO_LARGE');
      err.code = 'SAVE_TOO_LARGE';
      err.bytes = approxBytes;
      throw err;
    }
  }
  await withTimeout(setDoc(ref, payload, { merge: true }), 20000);
}

export async function deleteSave(uid, saveId) {
  await deleteDoc(doc(db, 'users', uid, 'saves', saveId));
}
