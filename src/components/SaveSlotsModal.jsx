import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSaveGame } from '@/save/useSaveGame';
import {
  listSaves,
  createSave,
  updateSave,
  deleteSave,
  MAX_SAVE_SLOTS,
} from '@/save/firestoreSaves';
import {
  listLocalSaves,
  createLocalSave,
  updateLocalSave,
  deleteLocalSave,
} from '@/save/localSaves';

function formatDate(date, language) {
  if (!date) return '—';
  try {
    return date.toLocaleString(language === 'en' ? 'en-GB' : 'es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return String(date);
  }
}

export default function SaveSlotsModal({ open, onClose }) {
  const { user, configured, signInWithGoogle } = useAuth();
  const { language, translations } = useLanguage();
  const t = translations?.saves || {};
  const { collect, apply } = useSaveGame();

  const [tab, setTab] = useState('local'); // 'local' | 'cloud'
  const [saves, setSaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');

  const formatFirestoreError = (err) => {
    const code = err?.code || '';
    if (code === 'TIMEOUT') {
      return t.errorTimeout || 'Firestore no responde.';
    }
    if (code === 'permission-denied' || code === 'PERMISSION_DENIED') {
      return t.errorPermission || 'Sin permiso en Firestore.';
    }
    if (
      code === 'unavailable' ||
      code === 'failed-precondition' ||
      code === 'not-found'
    ) {
      return t.errorNoFirestore || 'Firestore no está listo.';
    }
    return `${t.errorLoad || 'Could not load saves'}${code ? ` (${code})` : ''}`;
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'local') {
        setSaves(await listLocalSaves());
      } else if (user) {
        const rows = await listSaves(user.uid);
        setSaves(rows.map((r) => ({ ...r, storage: 'cloud' })));
      } else {
        setSaves([]);
      }
    } catch (err) {
      console.error('[saves] refresh', err);
      setSaves([]);
      setError(tab === 'cloud' ? formatFirestoreError(err) : (t.errorLoad || 'Load failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab, user?.uid]);

  if (!open) return null;

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError(t.errorLogin || 'Sign-in failed');
    }
  };

  const handleSaveAs = async () => {
    const name = (newName || t.defaultName || 'Game').trim();
    if (!name) return;
    if (tab === 'cloud' && !user) return;
    setBusy(true);
    setError(null);
    try {
      const snapshot = collect();
      if (tab === 'local') {
        await createLocalSave({ name, snapshot, route: snapshot.route });
      } else {
        await createSave(user.uid, { name, snapshot, route: snapshot.route });
      }
      setNewName('');
      await refresh();
    } catch (err) {
      console.error('[saves] createSave', err);
      if (err?.code === 'MAX_SLOTS') {
        setError(
          (t.maxSlots || 'Maximum {n} saves').replace('{n}', String(MAX_SAVE_SLOTS))
        );
      } else if (err?.code === 'SAVE_TOO_LARGE') {
        setError(t.errorTooLarge || 'Save is too large');
      } else if (err?.code === 'SNAPSHOT_NOT_SERIALIZABLE') {
        setError(t.errorSerialize || 'Not serializable');
      } else if (err?.code === 'permission-denied') {
        setError(t.errorPermission || 'Permission denied');
      } else {
        const detail = err?.code || err?.message || '';
        setError(`${t.errorSave || 'Could not save'}${detail ? ` (${detail})` : ''}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleOverwrite = async (save) => {
    if (!window.confirm(t.confirmOverwrite || 'Overwrite this save?')) return;
    setBusy(true);
    setError(null);
    try {
      const snapshot = collect();
      if (tab === 'local') {
        await updateLocalSave(save.id, { name: save.name, snapshot, route: snapshot.route });
      } else {
        await updateSave(user.uid, save.id, {
          name: save.name,
          snapshot,
          route: snapshot.route,
        });
      }
      await refresh();
    } catch (err) {
      console.error(err);
      setError(t.errorSave || 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  const handleLoad = async (save) => {
    if (!save?.snapshot) {
      setError(t.errorLoad || 'Could not load saves');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      apply(save.snapshot);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(t.errorLoad || 'Could not load saves');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (save) => {
    if (!window.confirm(t.confirmDelete || 'Delete this save?')) return;
    setBusy(true);
    setError(null);
    try {
      if (tab === 'local') await deleteLocalSave(save.id);
      else await deleteSave(user.uid, save.id);
      await refresh();
    } catch (err) {
      console.error(err);
      setError(t.errorDelete || 'Could not delete');
    } finally {
      setBusy(false);
    }
  };

  const showEditor = tab === 'local' || (tab === 'cloud' && user);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      data-testid="saves-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg bg-zinc-900 border border-zinc-600 shadow-xl text-left text-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-bold">{t.title || 'Saved games'}</h2>
          <button type="button" onClick={onClose} className="text-zinc-300 hover:text-white px-2 py-1">
            ✕
          </button>
        </div>

        <div className="flex gap-2 px-4 pt-3">
          <button
            type="button"
            data-testid="saves-tab-local"
            onClick={() => setTab('local')}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              tab === 'local' ? 'bg-emerald-700' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {t.tabLocal || 'This device'}
          </button>
          <button
            type="button"
            data-testid="saves-tab-cloud"
            onClick={() => setTab('cloud')}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              tab === 'cloud' ? 'bg-emerald-700' : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {t.tabCloud || 'Cloud (Google)'}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {tab === 'local' && (
            <p className="text-xs text-zinc-400">
              {t.localHint || 'Saved in this browser only. No Google account required.'}
            </p>
          )}

          {tab === 'cloud' && !configured && (
            <p className="text-amber-300 text-sm">
              {t.notConfigured || 'Firebase is not configured.'}
            </p>
          )}

          {tab === 'cloud' && configured && !user && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                {t.loginRequired || 'Sign in with Google for cloud saves.'}
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="bg-emerald-700 hover:bg-emerald-600 font-semibold px-4 py-2 rounded"
              >
                {t.signInGoogle || 'Sign in with Google'}
              </button>
            </div>
          )}

          {showEditor && (
            <>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  data-testid="saves-name-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t.namePlaceholder || 'Save name'}
                  maxLength={80}
                  className="flex-1 text-black px-2 py-1 rounded"
                  disabled={busy}
                />
                <button
                  type="button"
                  data-testid="saves-save-as"
                  onClick={handleSaveAs}
                  disabled={busy || !newName.trim()}
                  className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 font-semibold px-3 py-1 rounded whitespace-nowrap"
                >
                  {t.saveAs || 'Save as'}
                </button>
              </div>

              <p className="text-xs text-zinc-400" data-testid="saves-slot-count">
                {(t.slotCount || '{used} / {max} slots')
                  .replace('{used}', String(saves.length))
                  .replace('{max}', String(MAX_SAVE_SLOTS))}
              </p>

              {loading && (
                <p className="text-sm text-zinc-400">{t.loading || 'Loading…'}</p>
              )}

              {!loading && saves.length === 0 && (
                <p className="text-sm text-zinc-400">{t.empty || 'No saved games yet.'}</p>
              )}

              <ul className="space-y-2" data-testid="saves-list">
                {saves.map((save) => (
                  <li
                    key={save.id}
                    className="border border-zinc-700 rounded p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    data-testid={`save-row-${save.id}`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{save.name}</div>
                      <div className="text-xs text-zinc-400">
                        {formatDate(save.updatedAt, language)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        data-testid={`save-load-${save.id}`}
                        disabled={busy}
                        onClick={() => handleLoad(save)}
                        className="bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-sm px-2 py-1 rounded"
                      >
                        {t.load || 'Load'}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleOverwrite(save)}
                        className="bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-sm px-2 py-1 rounded"
                      >
                        {t.overwrite || 'Overwrite'}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(save)}
                        className="bg-red-900 hover:bg-red-800 disabled:opacity-50 text-sm px-2 py-1 rounded"
                      >
                        {t.delete || 'Delete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {error && (
            <p className="text-sm text-red-400" data-testid="saves-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
