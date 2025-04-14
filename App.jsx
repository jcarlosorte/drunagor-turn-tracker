import { Link, Routes, Route } from 'react-router-dom'
import Tracker from './pages/Tracker'
import MenuEntorno from './pages/MenuEntorno'
import './index.css'

function Home() {
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-4">
      <img src="/logo-drunagor.png" alt="Logo Drunagor" className="w-40 h-40 mb-6" />
      <h1 className="text-4xl font-bold mb-8 text-center">Control de Turnos - Chronicles of Drunagor</h1>
      <div className="flex flex-col gap-4">
        <Link to="/tracker" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded text-center">
          Iniciar Tracker
        </Link>
        <Link to="/entorno" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-center">
          Configurar Entorno
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/entorno" element={<MenuEntorno />} />
    </Routes>
  )
}
