import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AllAuctions from './pages/AllAuctions'
import AuctionDetail from './pages/AuctionDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auctions" element={<AllAuctions />} />
      <Route path="/auctions/:id" element={<AuctionDetail />} />
    </Routes>
  )
}

export default App
