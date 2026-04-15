import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login.page";
import Pomodoro from "./pages/Pomodoro.page";
import Feed from "./pages/Feed.page";
import Profile from "./pages/Profile.page";

import { Sidebar } from "./components/Sidebar";

const NO_SIDEBAR_ROUTES = ["/login"];

function App() {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 👇 novo estado da sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const showSidebar =
    !NO_SIDEBAR_ROUTES.includes(location.pathname) && !isFullscreen;

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 flex justify-center bg-gray-50`}
      >
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/perfil/:id" element={<Profile />} />
          {/*<Route path="/comunidade/:id" element={<Comunidade />} />*/}
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
