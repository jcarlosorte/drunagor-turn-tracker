import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tracker from "./pages/Tracker.jsx";
import Config from './pages/Config.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <Router basename="/drunagor-turn-tracker">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </Router>
  );
}

export default App;
