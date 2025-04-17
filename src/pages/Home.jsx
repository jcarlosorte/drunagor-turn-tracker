import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ajusta según tu estructura real

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-10">
      <img src={logo} alt="Drunagor Logo" className="mx-auto w-40 mb-4" />
      <h1 className="text-4xl font-bold mb-6">Drunagor Turn Tracker</h1>
      <button
        onClick={() => navigate('/tracker')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Iniciar Tracker
      </button>
      <button
        onClick={() => navigate('/config')}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Configurar Entorno
      </button>
    </div>
  );
}
