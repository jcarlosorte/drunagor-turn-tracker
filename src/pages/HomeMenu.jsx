// src/pages/HomeMenu.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import PageTransition from "@/components/PageTransition";

export default function HomeMenu() {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  return (
    <PageTransition>
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-green-900 to-green-950">
        <div className="flex gap-6 p-6 rounded-lg shadow-lg">
          <button
            onClick={() => navigate("/tracker")}
            className="py-2 px-5 rounded-md font-bold text-sm text-white 
                       bg-emerald-700 border border-emerald-500 
                       hover:bg-emerald-600 hover:border-emerald-300 
                       hover:shadow-[0_0_12px_rgba(16,185,129,0.7)] 
                       transition-all duration-300"
          >
            {translations.home.start_tracker}
          </button>

          <button
            onClick={() => navigate("/config")}
            className="py-2 px-5 rounded-md font-bold text-sm text-white 
                       bg-teal-700 border border-teal-500 
                       hover:bg-teal-600 hover:border-teal-300 
                       hover:shadow-[0_0_12px_rgba(45,212,191,0.7)] 
                       transition-all duration-300"
          >
            {translations.home.configure_environment}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
