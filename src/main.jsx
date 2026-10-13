import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';
import { TrackerProvider } from './context/TrackerContext';
import { GameProvider } from './context/GameContext';
import { InitRunesProvider } from './context/InitRunesContext';
import { InitEnemiesProvider } from './context/InitEnemiesContext';

import AppWrapper from './AppWrapper';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <ExpansionProvider>
          <TrackerProvider>
            <InitRunesProvider>
              <GameProvider>
                <InitEnemiesProvider>
                  <AppWrapper />
                </InitEnemiesProvider>
              </GameProvider>
            </InitRunesProvider>
          </TrackerProvider>
        </ExpansionProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
);
