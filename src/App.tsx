import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login.page'
import Pomodoro from './pages/Pomodoro.page'
import Feed from './pages/Feed.page'
import Comunidade from './pages/Comunity.page'
import './App.css'
import { Sidebar } from './components/Sidebar'
import Profile from './pages/Profile.page'
import { useState, useEffect } from 'react'

const NO_SIDEBAR_ROUTES = ['/login']

function App() {
  const location = useLocation()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const showSidebar = !NO_SIDEBAR_ROUTES.includes(location.pathname) && !isFullscreen

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}

      <main className={`flex-1 ${showSidebar ? 'ml-16 lg:ml-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/comunidade" element={<Comunidade />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
