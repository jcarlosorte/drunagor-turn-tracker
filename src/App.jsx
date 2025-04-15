import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Tracker from "./pages/Tracker.jsx";
import Config from "./pages/Config";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </Router>
  );
}

export default App;
