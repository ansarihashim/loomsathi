'use client'

import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp
} from 'lucide-react'
import Container from '@/components/ui/Container'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Demo', href: '#' },
      { name: 'API', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Training', href: '#' },
      { name: 'Status', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-textile-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">L</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold">LoomSathi</span>
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                  Empowering Malegaon's textile industry with digital solutions. 
                  Transform your powerloom business with our comprehensive platform.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-textile-400" />
                    <span className="text-gray-300 text-sm sm:text-base">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-textile-400" />
                    <span className="text-gray-300 text-sm sm:text-base">hello@loomsathi.com</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-textile-400" />
                    <span className="text-gray-300 text-sm sm:text-base">Malegaon, Maharashtra, India</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-1 sm:space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-textile-400 transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-1 sm:space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-textile-400 transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-1 sm:space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-textile-400 transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-800 pt-6 sm:pt-8 mt-8 sm:mt-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 lg:space-x-6">
                <p className="text-gray-400 text-xs sm:text-sm">
                  © 2024 LoomSathi. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  {footerLinks.legal.map((link, index) => (
                    <a 
                      key={index}
                      href={link.href}
                      className="text-gray-400 hover:text-textile-400 text-xs sm:text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex space-x-2 sm:space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-textile-600 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  ))}
                </div>
                
                <button
                  onClick={scrollToTop}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-textile-600 rounded-lg flex items-center justify-center hover:bg-textile-700 transition-colors"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer 