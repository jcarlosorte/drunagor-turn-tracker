// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';
import { TrackerProvider } from '@/context/TrackerContext';
import { GameProvider } from './context/GameContext';
import { InitRunesProvider } from '@/context/InitRunesContext';
import { InitEnemiesProvider } from '@/context/InitEnemiesContext'; // MOVIDO AQUÍ


import AppWrapper from './AppWrapper'; // 👈 nuevo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ExpansionProvider>
        <TrackerProvider> 
          <GameProvider>
            <InitRunesProvider>
              <InitEnemiesProvider>
                <AppWrapper /> {/* 👈 nuevo componente que controla el inicio */}
              </InitEnemiesProvider>
            </InitRunesProvider>
          </GameProvider>
        </TrackerProvider>
      </ExpansionProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
