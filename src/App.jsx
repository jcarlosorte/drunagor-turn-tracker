import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Tracker from "./pages/Tracker.jsx";
import Config from './pages/Config.jsx';

function Header() {
  const { translations } = useLanguage();
  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="Drunagor Logo"
        className="mx-auto w-40 mb-4"
      />
      <h1 className="text-4xl font-bold mb-6">
        {translations.home.title}
      </h1>
    </>
  );
}

function HomeMenu() {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  return (
    <div>
      <button
        onClick={() => navigate('/tracker')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        {translations.home.start_tracker}
      </button>
      <button
        onClick={() => navigate('/config')}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        {translations.home.configure_environment}
      </button>
    </div>
  );
}

function App() {
  return (
    <Router basename="/drunagor-turn-tracker/">
      <div className="text-center mt-10">
        <Header />

        <Routes>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

