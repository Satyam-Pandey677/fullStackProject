import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import LiveAuction from '../components/sections/LiveAuction'
import FeaturedAuctions from '../components/sections/FeaturedAuctions'
import HowItWorks from '../components/sections/HowItWorks'
// import Stats from '../components/sections/Stats'
// import Testimonials from '../components/sections/Testimonials'
// import FAQ from '../components/sections/FAQ'
// import CTA from '../components/sections/CTA'
// import Footer from '../components/layout/Footer'

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <LiveAuction />
          <FeaturedAuctions />
          <HowItWorks />
        </main>
      </div>
    </div>
  )
}

export default LandingPage
