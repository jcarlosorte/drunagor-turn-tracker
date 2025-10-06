// src/pages/HomeMenu.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import PageTransition from "@/components/PageTransition";

export default function HomeMenu() {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-950 via-green-900 to-black">
          <div className="flex flex-col gap-6 w-full max-w-sm text-center">
            <button
              onClick={() => navigate("/tracker")}
              className="py-3 px-6 rounded-lg font-bold text-lg text-green-100 
                         bg-green-800/60 border border-green-600 shadow-lg 
                         hover:bg-green-700 hover:border-green-400 
                         hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] 
                         transition-all duration-300"
            >
              {translations.home.start_tracker}
            </button>
  
            <button
              onClick={() => navigate("/config")}
              className="py-3 px-6 rounded-lg font-bold text-lg text-green-100 
                         bg-green-800/60 border border-green-600 shadow-lg 
                         hover:bg-green-700 hover:border-green-400 
                         hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] 
                         transition-all duration-300"
            >
              {translations.home.configure_environment}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }
