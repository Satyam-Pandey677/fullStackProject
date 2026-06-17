import { useState } from 'react'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'

import Verify from './pages/Verify'
import LandingPage from './pages/LandingPage'


function App() {
  const [count, setCount] = useState(0)

  return (
        <Routes>
            <Route index element={<LandingPage/>}/>
            <Route path="/verify" element={<Verify/>}/>
        </Routes>
  )
}

export default App
