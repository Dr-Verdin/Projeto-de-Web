import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.page'
import Pomodoro from './pages/Pomodoro.page'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Pomodoro/>} />
    </Routes>
  )
}

export default App
