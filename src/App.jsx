import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tracker from "./pages/Tracker.jsx";
import Config from './pages/Config.jsx';

function App() {
  return (
    <Router basename="/drunagor-turn-tracker/"> {/* Asegúrate de que esto esté configurado correctamente */}
      <div className="text-center mt-10">
        <img src="/logo.png" alt="Drunagor Logo" className="mx-auto w-40 mb-4" />
        <h1 className="text-4xl font-bold mb-6">Drunagor Turn Tracker</h1>
        
        {/* Rutas principales */}
        <Routes>
          <Route path="/" element={
            <div>
              <button
                onClick={() => window.location.href = '/tracker'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Iniciar Tracker
              </button>
              <button
                onClick={() => window.location.href = '/config'}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Configurar Entorno
              </button>
            </div>
          } />
          
          {/* Rutas para las páginas */}
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

