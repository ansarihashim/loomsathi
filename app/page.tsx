'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import WhyGoDigital from '@/components/sections/WhyGoDigital'
import OurMission from '@/components/sections/OurMission'
import Features from '@/components/sections/Features'
import GetStarted from '@/components/sections/GetStarted'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhyGoDigital />
      <OurMission />
      <Features />
      <GetStarted />
      <Contact />
      <Footer />
    </main>
  )
} 