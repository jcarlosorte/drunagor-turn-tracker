// App.jsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { InitEnemiesProvider } from '@/context/InitEnemiesContext';
import AnimatedRoutes from "@/components/AnimatedRoutes";

function Header() {
  const { translations } = useLanguage();
  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}Corebox_Logo-1536x864.png`}
        alt="Drunagor Logo"
        className="mx-auto mb-4 w-1/2 "
      />
      <h1 className="text-4xl font-bold mb-6">
        {translations.home.title}
      </h1>
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const hideHeader = ["/init", "/config", "/tracker"].includes(location.pathname); // 👈 CAMBIADO

  return (
    <div className="text-center mt-10">
      {!hideHeader && <Header />}
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <InitEnemiesProvider>
      <Router basename="/drunagor-turn-tracker/">
        <AppContent />
      </Router>
    </InitEnemiesProvider>
  );
}

export default App;

