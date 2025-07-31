'use client'

import { motion } from 'framer-motion'
import { Check, Star, Phone, Mail, MessageCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    description: 'Perfect for small textile businesses',
    features: [
      'Up to 10 looms',
      'Basic reporting',
      'Mobile app access',
      'Email support',
      'Data backup'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '₹1,999',
    period: '/month',
    description: 'Ideal for growing businesses',
    features: [
      'Up to 50 looms',
      'Advanced analytics',
      'Worker management',
      'Priority support',
      'Custom integrations',
      'Training sessions'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations',
    features: [
      'Unlimited looms',
      'Custom development',
      'Dedicated support',
      'On-site training',
      'API access',
      'White-label options'
    ],
    popular: false
  }
]

const contactOptions = [
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our team',
    action: '+91 98765 43210',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get detailed information',
    action: 'hello@loomsathi.com',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Instant support available',
    action: 'Start Chat',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
]

const GetStarted = () => {
  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-textile-50 via-white to-primary-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to <span className="text-gradient">Get Started?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business and start your digital transformation journey today.
          </p>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-textile-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`bg-white rounded-2xl shadow-lg p-8 h-full ${plan.popular ? 'ring-2 ring-textile-500' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.name === 'Enterprise' ? (
                  <Button 
                    variant="secondary"
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button 
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Need Help Getting Started?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h4>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <button className="text-textile-600 font-semibold hover:text-textile-700 transition-colors">
                  {option.action}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-textile-500 to-primary-500 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join 500+ Successful Textile Businesses
            </h3>
            <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Start your digital transformation today and become part of Malegaon's growing 
              digital textile community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-textile-600 hover:bg-gray-50"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-textile-600"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default GetStarted 