'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Users, Globe } from 'lucide-react'
import Link from 'next/link'
import Container from '@/components/ui/Container'

const missionPoints = [
  {
    icon: Heart,
    title: 'Empowering Local Business',
    description: 'Supporting Malegaon\'s textile community with technology that understands their unique needs.'
  },
  {
    icon: Target,
    title: 'Digital Transformation',
    description: 'Bridging the gap between traditional textile practices and modern digital solutions.'
  },
  {
    icon: Users,
    title: 'Community Growth',
    description: 'Creating opportunities for local businesses to compete in the global market.'
  },
  {
    icon: Globe,
    title: 'Sustainable Future',
    description: 'Promoting efficient resource management and sustainable textile practices.'
  }
]

const OurMission = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-br from-textile-50 via-white to-primary-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Mission Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-textile-100 text-textile-700 rounded-full text-sm font-medium">
                Our Story
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Mission</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Born in the heart of Malegaon's textile industry, we understand the challenges 
              that powerloom owners face daily. Our mission is to bring the power of digital 
              technology to every textile business, making operations more efficient, 
              profitable, and sustainable.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe that every textile business, regardless of size, deserves access to 
              modern tools that can transform their operations and help them grow in the 
              competitive market.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-textile-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-textile-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Placeholder */}
              <div className="bg-gradient-to-br from-textile-200 to-primary-200 rounded-2xl p-8 md:p-12 text-center">
                <div className="w-24 h-24 bg-textile-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Malegaon's Digital Future
                </h3>
                <p className="text-gray-600 mb-6">
                  Join us in building a stronger, more prosperous textile community 
                  through digital innovation and local expertise.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-textile-600">500+</div>
                    <div className="text-sm text-gray-500">Businesses</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-textile-600">1000+</div>
                    <div className="text-sm text-gray-500">Looms</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary-200 rounded-full opacity-60"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-textile-300 rounded-full opacity-60"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join the Digital Revolution?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Be part of Malegaon's growing digital textile community. 
              Start your transformation journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
              <button className="btn-primary">
                Get Started Now
              </button>
              </Link>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default OurMission 