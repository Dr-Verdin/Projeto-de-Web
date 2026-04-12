import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Sidebar } from './components/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div>Hello World</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
