import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.page'
import Pomodoro from './pages/Pomodoro.page'
import './App.css'
import { Sidebar } from './components/Sidebar'
import Profile from './pages/Profile.page'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div>Hello World</div>} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
