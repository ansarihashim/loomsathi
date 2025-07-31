'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, DollarSign, Users, Shield, BarChart3 } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Link from 'next/link'

const benefits = [
  {
    icon: TrendingUp,
    title: 'Increased Productivity',
    description: 'Boost your production efficiency by up to 40% with real-time monitoring and automated processes.',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Clock,
    title: 'Time Savings',
    description: 'Save 3-4 hours daily on manual record keeping and administrative tasks.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: DollarSign,
    title: 'Cost Reduction',
    description: 'Reduce operational costs by 25% through better resource management and waste reduction.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Users,
    title: 'Better Workforce Management',
    description: 'Track worker performance, manage shifts, and optimize labor allocation efficiently.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'Secure cloud storage with backup and recovery options for all your business data.',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Get detailed reports and analytics to make informed business decisions.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
]

const WhyGoDigital = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Go <span className="text-gradient">Digital?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of textile businesses in Malegaon who have transformed their operations 
            with our digital solutions. Here's what you can achieve:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <div className={`w-16 h-16 ${benefit.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-textile-50 to-primary-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your digital transformation journey today and join the growing community 
              of successful textile businesses in Malegaon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="btn-primary">
                  Start Free Trial
                </button>
              </Link>
              <button className="btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default WhyGoDigital 