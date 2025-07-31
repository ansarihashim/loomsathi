'use client'

import { motion } from 'framer-motion'
import { 
  Monitor, 
  BarChart3, 
  Users, 
  Shield, 
  Smartphone, 
  Database,
  Settings,
  Zap
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'

const features = [
  {
    icon: Monitor,
    title: 'Real-time Monitoring',
    description: 'Monitor your looms and production in real-time with live dashboards and alerts.',
    benefits: ['Live production tracking', 'Instant alerts', 'Performance metrics']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get detailed insights into your production efficiency, costs, and profitability.',
    benefits: ['Production reports', 'Cost analysis', 'Profit tracking']
  },
  {
    icon: Users,
    title: 'Worker Management',
    description: 'Manage your workforce efficiently with shift tracking and performance monitoring.',
    benefits: ['Shift management', 'Performance tracking', 'Attendance records']
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'Your business data is protected with enterprise-grade security and backup.',
    benefits: ['Cloud backup', 'Data encryption', 'Access control']
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Access your business data anywhere with our mobile application.',
    benefits: ['Mobile dashboard', 'Push notifications', 'Offline sync']
  },
  {
    icon: Database,
    title: 'Inventory Management',
    description: 'Track raw materials, finished goods, and manage your inventory efficiently.',
    benefits: ['Stock tracking', 'Reorder alerts', 'Inventory reports']
  },
  {
    icon: Settings,
    title: 'Customizable Workflows',
    description: 'Adapt the system to your specific business processes and requirements.',
    benefits: ['Custom fields', 'Workflow automation', 'Integration options']
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Get started in minutes with our simple setup process and guided onboarding.',
    benefits: ['Easy setup', 'Training videos', '24/7 support']
  }
]

const Features = () => {
  return (
    <section className="section-padding bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Everything you need to manage your textile business efficiently. 
            From production monitoring to financial tracking, we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-textile-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-textile-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
                <ul className="space-y-1 sm:space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-textile-500 rounded-full mr-2 sm:mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-textile-50 to-primary-50 rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-textile-600 mb-2">99.9%</div>
                <div className="text-gray-600 text-sm sm:text-base">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-textile-600 mb-2">24/7</div>
                <div className="text-gray-600 text-sm sm:text-base">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-textile-600 mb-2">5min</div>
                <div className="text-gray-600 text-sm sm:text-base">Setup Time</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Experience These Features?
          </h3>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4 sm:px-0">
            Start your free trial today and see how our features can transform your textile business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="btn-primary">
              Start Free Trial
            </button>
            <button className="btn-secondary">
              View Demo
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default Features 