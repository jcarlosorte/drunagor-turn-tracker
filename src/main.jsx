import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ExpansionProvider>
        <App />
      </ExpansionProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
