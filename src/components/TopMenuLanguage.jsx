import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { languages as availableLanguages, languageNames } from '@/i18n/languageData';
import { FaLanguage } from 'react-icons/fa';
import SaveSlotsModal from '@/components/SaveSlotsModal';

export const OPEN_SAVES_EVENT = 'drunagor:open-saves';

export default function TopMenuLanguage() {
  const { language, setLanguage, translations } = useLanguage();
  const t = translations?.trackerInit || {};
  const ts = translations?.saves || {};
  const ta = translations?.auth || {};
  const { user, loading, configured, signInWithGoogle, signOut } = useAuth();
  const [savesOpen, setSavesOpen] = useState(false);

  useEffect(() => {
    const open = () => setSavesOpen(true);
    window.addEventListener(OPEN_SAVES_EVENT, open);
    return () => window.removeEventListener(OPEN_SAVES_EVENT, open);
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert(ta.errorLogin || 'Sign-in failed');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg">
        <div className="flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto gap-2 flex-wrap">
          <div className="text-white font-bold text-lg">{t.menu || 'Menú'}</div>

          <div className="flex items-center gap-2 text-white text-sm flex-wrap justify-end">
            <button
              type="button"
              onClick={() => setSavesOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-700 border border-emerald-500 rounded px-2 py-1 font-semibold"
            >
              {ts.openButton || 'Saves'}
            </button>

            {configured && !loading && !user && (
              <button
                type="button"
                onClick={handleSignIn}
                className="bg-blue-800 hover:bg-blue-700 border border-blue-500 rounded px-2 py-1"
              >
                {ta.signInGoogle || 'Sign in with Google'}
              </button>
            )}

            {user && (
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-7 h-7 rounded-full border border-zinc-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="max-w-[120px] truncate text-xs text-zinc-200" title={user.email || ''}>
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="bg-zinc-700 hover:bg-zinc-600 border border-zinc-500 rounded px-2 py-1"
                >
                  {ta.signOut || 'Sign out'}
                </button>
              </div>
            )}

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
      </div>

      <SaveSlotsModal open={savesOpen} onClose={() => setSavesOpen(false)} />
    </>
  );
}
