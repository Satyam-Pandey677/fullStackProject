import { useState } from 'react'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'

import SendEmail from './pages/SendEmail'
import LandingPage from './pages/LandingPage'
import VerfyOtp from './pages/VerfyOtp'


function App() {
  const [count, setCount] = useState(0)

  return (
        <Routes>
            <Route index element={<LandingPage/>}/>
            <Route path="/sign-in" element={<SendEmail/>}/>
            <Route path="/send-otp" element={<VerfyOtp/>}/>
        </Routes>
  )
}

export default App
