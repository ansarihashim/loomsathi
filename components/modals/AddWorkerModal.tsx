'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Save,
  AlertCircle,
  Plus
} from 'lucide-react'

interface Worker {
  _id: string
  name: string
  phone: string
  email: string
  address: string
  designation: string
  status: 'active' | 'inactive'
  join_date: string
  leave_date?: string
  loan_history: Array<{
    loan_id: any
    loan_amt: number
    loan_date: string
  }>
  installment_history: Array<{
    installment_id: any
    installment_amt: number
    installment_date: string
  }>
  total_loan_amt: number
  paid_amt: number
  remaining_amt: number
  createdAt: string
  updatedAt: string
}

interface AddWorkerModalProps {
  isOpen: boolean
  onClose: () => void
  onWorkerAdded: (newWorker: Worker) => void
}

// Utility function to format date for display (dd/mm/yyyy)
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Utility function to convert dd/mm/yyyy to yyyy-mm-dd for backend
const formatDateForBackend = (dateString: string): string => {
  if (!dateString) return ''
  
  // Handle dd/mm/yyyy format
  const parts = dateString.split('/')
  if (parts.length === 3) {
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  
  return dateString
}

// Utility function to validate date format
const isValidDateFormat = (dateString: string): boolean => {
  if (!dateString) return true // Empty is valid for optional fields
  
  const parts = dateString.split('/')
  if (parts.length !== 3) return false
  
  const day = parseInt(parts[0])
  const month = parseInt(parts[1])
  const year = parseInt(parts[2])
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false
  if (day < 1 || day > 31) return false
  if (month < 1 || month > 12) return false
  if (year < 1900 || year > 2100) return false
  
  return true
}

const AddWorkerModal = ({ isOpen, onClose, onWorkerAdded }: AddWorkerModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    designation: 'weaver',
    status: 'active' as 'active' | 'inactive',
    join_date: '',
    leave_date: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        designation: 'weaver',
        status: 'active',
        join_date: '',
        leave_date: ''
      })
      setError('')
      setSuccess('')
      setValidationErrors({})
    }
  }, [isOpen])

  // Add custom styles for dropdown
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      select option:hover {
        background-color: #f97316 !important;
        color: white !important;
      }
      select option:checked {
        background-color: #f97316 !important;
        color: white !important;
      }
      select:focus option:checked {
        background-color: #f97316 !important;
        color: white !important;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.join_date) {
      errors.join_date = 'Join date is required'
    } else if (!isValidDateFormat(formData.join_date)) {
      errors.join_date = 'Please enter date in dd/mm/yyyy format'
    }
    
    if (formData.leave_date && !isValidDateFormat(formData.leave_date)) {
      errors.leave_date = 'Please enter date in dd/mm/yyyy format'
    }
    
    if (formData.leave_date && formData.join_date) {
      const joinDate = new Date(formatDateForBackend(formData.join_date))
      const leaveDate = new Date(formatDateForBackend(formData.leave_date))
      
      if (leaveDate <= joinDate) {
        errors.leave_date = 'Leave date must be after join date'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Prepare data for backend
    const workerData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      designation: formData.designation,
      status: formData.status,
      join_date: formatDateForBackend(formData.join_date),
      leave_date: formData.leave_date ? formatDateForBackend(formData.leave_date) : undefined
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
        },
        body: JSON.stringify(workerData)
      })

      if (response.ok) {
        const result = await response.json()
        const newWorker = result.data || result
        onWorkerAdded(newWorker)
        setSuccess('Worker added successfully!')
        
        // Show success message for a moment, then close modal
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        const errorData = await response.json()
        console.error('Create error:', errorData)
        setError(errorData.message || errorData.error || errorData.errors?.join(', ') || 'Failed to create worker')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value
    
    // Auto-format date input as user types
    if (name === 'join_date' || name === 'leave_date') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '')
      
      if (digits.length <= 2) {
        formattedValue = digits
      } else if (digits.length <= 4) {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`
      } else if (digits.length <= 8) {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
      } else {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="min-h-screen inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          style={{ 
            position: 'sticky', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-lg shadow-xl"
            style={{ 
              position: 'relative',
              maxHeight: '85vh',
              width: 'auto',
              minWidth: '320px',
              maxWidth: '480px',
              overflow: 'hidden',
              zIndex: 1001,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-textile-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Worker</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="p-4 sm:p-6 space-y-4"
              style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: '8px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-700">{success}</span>
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent ${
                      validationErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter worker name"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent ${
                      validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent ${
                      validationErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Designation and Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <div className="relative">
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent appearance-none bg-white hover:border-textile-500 transition-colors"
                    >
                      <option value="weaver" className="hover:bg-textile-500 hover:text-white">Weaver</option>
                      <option value="repairer" className="hover:bg-textile-500 hover:text-white">Repairer</option>
                      <option value="other" className="hover:bg-textile-500 hover:text-white">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent appearance-none bg-white hover:border-textile-500 transition-colors"
                    >
                      <option value="active" className="hover:bg-textile-500 hover:text-white">Active</option>
                      <option value="inactive" className="hover:bg-textile-500 hover:text-white">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date * (dd/mm/yyyy)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleDateInput}
                    required
                    maxLength={10}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent ${
                      validationErrors.join_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                {validationErrors.join_date && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.join_date}</p>
                )}
              </div>

              {/* Leave Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Date (dd/mm/yyyy)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="leave_date"
                    value={formData.leave_date}
                    onChange={handleDateInput}
                    maxLength={10}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent ${
                      validationErrors.leave_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                {validationErrors.leave_date && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.leave_date}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-textile-500 hover:bg-textile-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Worker</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddWorkerModal 