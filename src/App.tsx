// @ts-nocheck
import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { EcoProvider } from "./lib/store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EcoBuddy from "./components/EcoBuddy";
import { SuccessBurst, ToastHost } from "./components/Feedback";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Actions from "./pages/Actions";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Auth from "./pages/Auth";

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <EcoProvider>
      <HashRouter>
        <ScrollTop />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <EcoBuddy />
        <ToastHost />
        <SuccessBurst />
      </HashRouter>
    </EcoProvider>
  );
}
