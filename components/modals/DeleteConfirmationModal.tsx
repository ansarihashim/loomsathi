'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  AlertTriangle,
  Trash2
} from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  workerName: string
  onConfirm: () => void
}

const DeleteConfirmationModal = ({ isOpen, onClose, workerName, onConfirm }: DeleteConfirmationModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Clear success state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSuccess('')
    }
  }, [isOpen])

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      setSuccess('Worker deleted successfully!')
      // Delay closing to show success message
      setTimeout(() => {
        onClose()
      }, 1200)
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Delete Worker</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <motion.div 
              className="p-6"
              style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: '8px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Worker Deleted Successfully!
                  </h3>
                  <p className="text-gray-600">
                    The worker has been permanently removed from the system.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Are you sure you want to delete this worker?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This action cannot be undone. The worker <span className="font-semibold">{workerName}</span> will be permanently removed from the system.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Yes, Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DeleteConfirmationModal 