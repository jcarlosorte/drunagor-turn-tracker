import { Link } from "react-router-dom";
import logo from "./assets/logo-drunagor.png";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img src={logo} alt="Logo" className="w-64 mb-6" />
      <h1 className="text-4xl font-bold mb-6 text-center">
        Seguimiento de Turnos - Crónicas de Drunagor
      </h1>
      <div className="flex flex-col space-y-4">
        <Link
          to="/tracker"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg text-center"
        >
          Iniciar Tracker
        </Link>
        <Link
          to="/config"
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-lg text-center"
        >
          Configurar Entorno
        </Link>
      </div>
    </div>
  );
}

