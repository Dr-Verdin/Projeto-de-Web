// teste de commit

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login.page";
import Register from "./pages/Register.page";
import Pomodoro from "./pages/Pomodoro.page";
import Feed from "./pages/Feed.page";
import Profile from "./pages/Profile.page";
import CreatePostPage from "./pages/CreatePost.page";
import SettingsPage from "./pages/Settings.page";
import NotificationsPage from "./pages/Notifications.page";
import CommunitiesPage from "./pages/Communities.page";

import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { SearchPanel } from "./components/SearchPanel";
import { NotificationPanel } from "./components/NotificationPanel";
import { SettingsModal } from "./components/SettingsModal";
import Comunidade from "./pages/Community.page";
import CreateModal from "./components/CreateModal";
import { useAuth } from "./contexts/AuthContext";
import type { User } from "./types/User";
import Mensagechat from "./pages/Chat.page";

const NO_NAV_ROUTES = ["/login", "/register"];
const MOBILE_FULLPAGE_ROUTES = ["/criar-post", "/configuracoes", "/mensagens", "/notificacoes", "/comunidades"];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePanelType, setActivePanelType] = useState<"search" | "notifications" | null>(null);

  // modais — controlados aqui para poder fazer a transição mobile↔desktop
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // desktop → mobile: modal aberto ou painel aberto vira página
  useEffect(() => {
    if (isMobile) {
      if (isCreateModalOpen) {
        setIsCreateModalOpen(false);
        navigate("/criar-post");
      }
      if (isSettingsModalOpen) {
        setIsSettingsModalOpen(false);
        navigate("/configuracoes");
      }
      if (panelOpen && activePanelType === "notifications") {
        setPanelOpen(false);
        setActivePanelType(null);
        navigate("/notificacoes");
      }
    }
  }, [isMobile]);

  // mobile → desktop: página exclusiva vira modal ou redireciona
  useEffect(() => {
    if (!isMobile && MOBILE_FULLPAGE_ROUTES.includes(location.pathname)) {
      if (location.pathname === "/criar-post") {
        navigate("/");
        setIsCreateModalOpen(true);
      } else if (location.pathname === "/configuracoes") {
        navigate("/");
        setIsSettingsModalOpen(true);
      } else if (location.pathname === "/notificacoes") {
        // no desktop as notificações ficam no painel lateral — abre ele
        navigate("/");
      } else if (location.pathname === "/comunidades") {
        // no desktop as comunidades ficam no card do feed
        navigate("/");
      }
      // /mensagens permanece como página em desktop também
    }
  }, [isMobile, location.pathname]);

  function handleSaveProfile(updatedUser: User) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent("user-updated", { detail: { userId: user?.id ?? user?.sub } }));
    setIsSettingsModalOpen(false);
  }

  function handleDeleteProfile() {
    logout();
    navigate("/login");
    setIsSettingsModalOpen(false);
  }

  const showNav = !NO_NAV_ROUTES.includes(location.pathname) && !isFullscreen;
  const isMobileFullPage = MOBILE_FULLPAGE_ROUTES.includes(location.pathname);
  const showMobileNav = showNav && isMobile && !isMobileFullPage;
  // Pomodoro não deve ter padding bottom — ele usa h-full e a barra mobile fica por cima (é fullscreen)
  const isPomodoro = location.pathname === "/pomodoro";

  return (
    <div className="flex h-screen overflow-hidden">

      {/* DESKTOP: sidebar lateral */}
      {showNav && !isMobile && (
        <>
          <Sidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            panelOpen={panelOpen}
            setPanelOpen={setPanelOpen}
            activePanelType={activePanelType}
            setActivePanelType={setActivePanelType}
            openCreateModal={() => setIsCreateModalOpen(true)}
            openSettingsModal={() => setIsSettingsModalOpen(true)}
          />
          <SearchPanel
            open={panelOpen && activePanelType === "search"}
            onClose={() => { setPanelOpen(false); setActivePanelType(null); }}
          />
          <NotificationPanel
            open={panelOpen && activePanelType === "notifications"}
            onClose={() => { setPanelOpen(false); setActivePanelType(null); }}
          />
        </>
      )}

      {/* MOBILE: top bar + bottom bar */}
      {showMobileNav && <MobileNav />}

      {/* CONTEÚDO PRINCIPAL */}
      <div
        className={`flex-1 min-h-0 transition-all duration-300 w-full bg-gray-50
          ${showNav && !isMobile ? "pl-16" : ""}
          ${showMobileNav && !isPomodoro ? "pt-14 pb-20" : ""}
          ${showMobileNav && isPomodoro ? "pt-14" : ""}
          ${isMobileFullPage ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}
      >
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/perfil/:id" element={<Profile />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comunidade/:id" element={<Comunidade />} />
          <Route path="/criar-post" element={<CreatePostPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/mensagens" element={<Mensagechat />} />
          <Route path="/notificacoes" element={<NotificationsPage />} />
          <Route path="/comunidades" element={<CommunitiesPage />} />
        </Routes>
      </div>

      {/* MODAIS DESKTOP */}
      {isCreateModalOpen && (
        <CreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          user={user}
          open={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}
    </div>
  );
}

export default App;
