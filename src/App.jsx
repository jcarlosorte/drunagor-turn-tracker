import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracker from "./pages/Tracker.jsx";
import Config from './pages/Config.jsx';

function Home() {
  return (
    <div>
      <img src="/drunagor-turn-tracker/logo.png" alt="Drunagor Logo" className="mx-auto w-40 mb-4" />
      <h1 className="text-4xl font-bold mb-6">Drunagor Turn Tracker</h1>
      <Link
        to="/tracker"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 inline-block"
      >
        Iniciar Tracker
      </Link>
      <Link
        to="/config"
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2 inline-block"
      >
        Configurar Entorno
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router basename="/drunagor-turn-tracker">
      <div className="text-center mt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
