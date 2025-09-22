'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  Building2
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import EditWorkerModal from '@/components/modals/EditWorkerModal'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal'
import { formatDate } from '@/utils/formatDate'
import { workerService, type Worker } from '@/lib/api'

const WorkerDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const workerId = params.id as string
  
  const [worker, setWorker] = useState<Worker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fetchWorkerDetails = useCallback(async () => {
    try {
      const result = await workerService.getById(workerId)
      
      if (result.success) {
        setWorker(result.data)
      } else {
        setError('Worker not found')
      }
    } catch (error) {
      console.error('Error fetching worker details:', error)
      setError('Failed to load worker details')
    } finally {
      setIsLoading(false)
    }
  }, [workerId])

  useEffect(() => {
    fetchWorkerDetails()
  }, [fetchWorkerDetails])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getDesignationColor = (designation: string) => {
    const colors = {
      weaver: 'bg-blue-100 text-blue-800',
      helper: 'bg-yellow-100 text-yellow-800',
      supervisor: 'bg-purple-100 text-purple-800',
      manager: 'bg-indigo-100 text-indigo-800'
    }
    return colors[designation as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleWorkerUpdate = (updatedWorker: Worker) => {
    setWorker(updatedWorker)
  }

  const handleWorkerDelete = async () => {
    try {
      const result = await workerService.delete(workerId)

      if (result?.success) {
        // Show success feedback and delay redirect for smooth animation
        setTimeout(() => {
          router.push('/dashboard/workers')
        }, 1000) // Give time for modal to close with animation
      } else {
        console.error('Failed to delete worker')
      }
    } catch (error) {
      console.error('Error deleting worker:', error)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-textile-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading worker details...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !worker) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Worker Not Found</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-textile-500 hover:bg-textile-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between py-3 sm:py-0 sm:h-16">
              {/* Back Button and Title */}
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-1 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Back</span>
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-textile-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">Worker Details</h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center justify-center space-x-1 bg-textile-500 hover:bg-textile-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-base"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-base"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 sm:py-6 lg:py-8">
          {/* Worker Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between mb-4 sm:mb-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-textile-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-textile-600">
                    {worker.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="sm:ml-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{worker.name}</h2>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDesignationColor(worker.designation)}`}>
                      {worker.designation}
                    </span>
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(worker.status)}`}>
                      {worker.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900 break-words">{worker.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900 break-words">{worker.email}</span>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900 break-words">{worker.address}</span>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Employment Details</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-900">Joined: {formatDate(worker.join_date)}</span>
                  </div>
                  {worker.leave_date && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-red-600">Left: {formatDate(worker.leave_date)}</span>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </motion.div>

          {/* Financial Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8"
          >
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">Total Loans</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors truncate">{formatCurrency(worker.total_loan_amt)}</p>
                </div>
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:text-blue-700 transition-colors flex-shrink-0" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-green-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-600 truncate">Amount Paid</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 group-hover:text-green-700 transition-colors truncate">{formatCurrency(worker.paid_amt)}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 group-hover:text-green-700 transition-colors flex-shrink-0" />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-red-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-red-600 truncate">Remaining Amount</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900 group-hover:text-red-700 transition-colors truncate">{formatCurrency(worker.remaining_amt)}</p>
                </div>
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 group-hover:text-red-700 transition-colors flex-shrink-0" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-purple-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-600 truncate">Total Loans</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 group-hover:text-purple-700 transition-colors truncate">{worker.loan_history?.length || 0}</p>
                </div>
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 group-hover:text-purple-700 transition-colors flex-shrink-0" />
              </div>
            </div>
          </motion.div>

          {/* Loan History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 sm:mb-6 lg:mb-8"
          >
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Loan History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Details
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {worker.loan_history && worker.loan_history.length > 0 ? (
                    worker.loan_history.map((loan, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">Loan #{index + 1}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">{formatCurrency(loan.loan_amt)}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Active
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {formatDate(loan.loan_date)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                        No loan history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Installment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Installment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {worker.installment_history && worker.installment_history.length > 0 ? (
                    worker.installment_history.map((installment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{formatCurrency(installment.installment_amt)}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {formatDate(installment.installment_date)}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {formatDate(installment.installment_date)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                        No installment history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Modals */}
        <EditWorkerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          worker={worker}
          onUpdate={handleWorkerUpdate}
        />
        
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          workerName={worker?.name || ''}
          onConfirm={handleWorkerDelete}
        />
      </div>
    </AuthGuard>
  )
}

export default WorkerDetailPage 