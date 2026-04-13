import { Route, Routes } from 'react-router-dom'
import { Button } from "./components/ui/button";
import Feed from './Feed.page'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <div>Hello World</div>
          <div>
              <Button>Clique aqui</Button>
            </div>
        </div>
      } />
      <Route path="/feed" element={<Feed />} />
      
    </Routes>
  )
}

export default App
