// src/components/AnimatedRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomeMenu from "@/pages/HomeMenu"; // Lo importamos desde App.jsx ya que estaba ahí
import Tracker from "@/pages/Tracker";
import Config from "@/pages/Config";
import InitTracker from "@/pages/InitTracker";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeMenu />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/config" element={<Config />} />
        <Route path="/init" element={<InitTracker />} />
      </Routes>
    </AnimatePresence>
  );
}
