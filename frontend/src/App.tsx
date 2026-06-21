import { useState } from 'react'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'

import SendEmail from './pages/Login'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/Verify'
import AuthLayout from './pages/Auth/AuthLayout'
import ProductsPage from './pages/ProductsPage'


function App() {
  const [count, setCount] = useState(0)

  return (
        <Routes>
            <Route index element={<LandingPage/>}/>
            <Route path="/sign-in" element={<SendEmail/>}/>
            <Route path="/send-otp" element={<VerifyPage  />}/>
            <Route element={<AuthLayout/>}>
              <Route path='/products' element={<ProductsPage/>}/>
            </Route>
        </Routes>
  )
}

export default App
