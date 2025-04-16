import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center text-white">
      <img src="/logo.png" alt="Logo Drunagor" className="mx-auto w-48 mb-4" />
      <h1 className="text-3xl font-bold mb-6">Chronicles of Drunagor - Turn Tracker</h1>
      <div className="flex flex-col gap-4 items-center">
        <Link to="/tracker">
          <button className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700">Iniciar el Tracker</button>
        </Link>
        <Link to="/config">
          <button className="bg-gray-600 px-6 py-2 rounded text-white hover:bg-gray-700">Configurar Entorno</button>
        </Link>
      </div>
    </div>
  );
}