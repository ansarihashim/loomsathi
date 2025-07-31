'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-textile-50 via-white to-primary-50 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8751f' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container className="relative z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2 sm:px-0"
          >
            <span className="text-gradient">Digital Solutions</span>
            <br />
            <span className="text-gray-800">for Powerloom</span>
            <br />
            <span className="text-gradient">Management</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Transform your textile business with our comprehensive digital platform. 
            Manage looms, track production, and grow your business with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
          >
            <Link href="/signup">
              <Button size="lg" className="group w-full sm:w-auto text-sm sm:text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="group w-full sm:w-auto text-sm sm:text-base">
              <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textile-600 mb-1">500+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textile-600 mb-1">10,000+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">Looms Managed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textile-600 mb-1">₹50Cr+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textile-600 mb-1">98%</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-20 right-10 w-20 h-20 bg-textile-100 rounded-full opacity-20 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-20 left-10 w-16 h-16 bg-primary-100 rounded-full opacity-20 hidden lg:block"
      />
    </section>
  )
}

export default Hero 