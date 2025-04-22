import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'; // <- inicializa i18next

import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';
import { TrackerProvider } from '@/context/TrackerContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ExpansionProvider>
        <TrackerProvider>
          <App />
        </TrackerProvider>
      </ExpansionProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
