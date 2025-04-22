// src/pages/HomeMenu.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeMenu() {
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
