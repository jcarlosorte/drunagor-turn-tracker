
import { useState } from 'react';
import Tracker from "./pages/Tracker.jsx";
import Config from './pages/Config.jsx';


function App() {
  const [view, setView] = useState('home');

  return (
    <div className="text-center mt-10">
      {view === 'home' && (
        <div>
          <img src="/logo.png" alt="Drunagor Logo" className="mx-auto w-40 mb-4" />
          <h1 className="text-4xl font-bold mb-6">Drunagor Turn Tracker</h1>
          <button
            onClick={() => setView('tracker')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            Iniciar Tracker
          </button>
          <button
            onClick={() => setView('config')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            Configurar Entorno
          </button>
        </div>
      )}
      {view === 'tracker' && <Tracker />}
      {view === 'config' && <Config />}
    </div>
  );
}

export default App;
