// App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedRoutes from "@/components/AnimatedRoutes";

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

function App() {
  return (
    <Router basename="/drunagor-turn-tracker/">
      <div className="text-center mt-10">
        <Header />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;


