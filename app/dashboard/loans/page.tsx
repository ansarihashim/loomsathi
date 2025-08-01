'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  ArrowLeft,
  X,
  Check,
  AlertCircle,
  Loader2,
  User,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { useNavigationLoader } from '@/hooks/useNavigationLoader'
import { formatDate } from '@/utils/formatDate'

interface Loan {
  _id: string
  worker_id: string | {
    _id: string
    name: string
  }
  worker_name: string
  loan_amt: number
  loan_date: string | Date
  status: 'active' | 'inactive' | 'paid'
  remaining_amount: number
  paid_amount: number
  createdAt: string
  updatedAt: string
}

interface Worker {
  _id: string
  name: string
  phone: string
}

interface LoanFormData {
  worker_id: string
  worker_name: string
  loan_amt: number
  loan_date: string
  status: 'active' | 'inactive' | 'paid'
}

interface PaymentFormData {
  installment_amt: number
  installment_date: string
  notes: string
}

const LoanDashboard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [formData, setFormData] = useState<LoanFormData>({
    worker_id: '',
    worker_name: '',
    loan_amt: 0,
    loan_date: '',
    status: 'active'
  })
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    installment_amt: 0,
    installment_date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const { startLoading, stopLoading } = useApiLoaderContext()
  const { navigateWithLoader } = useNavigationLoader({
    showOnNavigation: true,
    defaultMessage: 'Loading...'
  })

  // Add local state for raw date input
  const [rawLoanDate, setRawLoanDate] = useState('')

  const fetchLoans = useCallback(async () => {
    try {
      startLoading('Fetching loan data...')
      
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/loans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch loan data: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setLoans(data.data || [])
      setFilteredLoans(data.data || [])
    } catch (error: any) {
      console.error('Error fetching loans:', error)
      setError(`Failed to fetch loan data: ${error.message}`)
    } finally {
      stopLoading()
      setIsLoading(false)
    }
  }, [startLoading, stopLoading])

  const fetchWorkers = useCallback(async () => {
    try {
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/workers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workers: ${response.status}`)
      }
      
      const data = await response.json()
      setWorkers(data.data || [])
    } catch (error: any) {
      console.error('Error fetching workers:', error)
    }
  }, [])

  useEffect(() => {
    fetchLoans()
    fetchWorkers()
  }, [fetchLoans, fetchWorkers])

  useEffect(() => {
    // Filter loans based on search term
    const filtered = loans.filter(loan => 
      getWorkerName(loan).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.loan_amt || 0).toString().includes(searchTerm) ||
      formatDate(loan.loan_date).includes(searchTerm)
    )
    setFilteredLoans(filtered)
  }, [searchTerm, loans])

  const handleCreate = () => {
    setSelectedLoan(null)
    setFormData({
      worker_id: '',
      worker_name: '',
      loan_amt: 0,
      loan_date: '',
      status: 'active'
    })
    setRawLoanDate('')
    setError('')
    setIsModalOpen(true)
  }

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan)
    setFormData({
      worker_id: typeof loan.worker_id === 'object' ? loan.worker_id._id : loan.worker_id,
      worker_name: loan.worker_name,
      loan_amt: loan.loan_amt,
      loan_date: typeof loan.loan_date === 'string' ? loan.loan_date : loan.loan_date.toISOString().split('T')[0],
      status: loan.status
    })
    setRawLoanDate(formatDate(loan.loan_date))
    setError('')
    setIsModalOpen(true)
  }

  const handleDelete = (loan: Loan) => {
    setSelectedLoan(loan)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.worker_id || !formData.loan_amt) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('loomsathi_token')
      const url = selectedLoan 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/loans/${selectedLoan._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/loans`
      
      const response = await fetch(url, {
        method: selectedLoan ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
                 body: JSON.stringify({
           worker_id: formData.worker_id,
           worker_name: formData.worker_name,
           loan_amt: formData.loan_amt,
           loan_date: formData.loan_date,
           status: formData.status
         })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save loan')
      }

      await fetchLoans()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving loan:', error)
      setError(error instanceof Error ? error.message : 'Failed to save loan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedLoan) return

    try {
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/loans/${selectedLoan._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete loan')
      }

      await fetchLoans()
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting loan:', error)
      setError('Failed to delete loan')
    }
  }

  const handleWorkerChange = (workerId: string) => {
    const worker = workers.find(w => w._id === workerId)
    setFormData(prev => ({
      ...prev,
      worker_id: workerId,
      worker_name: worker ? worker.name : ''
    }))
  }

  // Helper function to get worker name safely
  const getWorkerName = (loan: Loan) => {
    if (typeof loan.worker_id === 'object' && loan.worker_id?.name) {
      return loan.worker_id.name
    }
    return loan.worker_name || 'Unknown Worker'
  }

  const handleLoanDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, loan_date: date }))
  }

  // Payment handling functions
  const handlePayment = (loan: Loan) => {
    setSelectedLoan(loan)
    setPaymentFormData({
      installment_amt: Math.min(loan.remaining_amount || 0, 1000), // Default to 1000 or remaining amount
      installment_date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setPaymentError('')
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLoan) return

    setIsPaymentSubmitting(true)
    setPaymentError('')

    try {
      const token = localStorage.getItem('loomsathi_token')
      const paymentData = {
        worker_id: typeof selectedLoan.worker_id === 'object' ? selectedLoan.worker_id._id : selectedLoan.worker_id,
        installment_amt: paymentFormData.installment_amt,
        installment_date: paymentFormData.installment_date,
        notes: paymentFormData.notes
      }
      
      console.log('Sending payment data:', paymentData)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/installments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      })

      const data = await response.json()
      console.log('Payment response:', data)

      if (data.success) {
        // Refresh loans to get updated data
        await fetchLoans()
        setIsPaymentModalOpen(false)
        setSelectedLoan(null)
        setPaymentFormData({
          installment_amt: 0,
          installment_date: new Date().toISOString().split('T')[0],
          notes: ''
        })
      } else {
        setPaymentError(data.error || 'Failed to record payment')
      }
    } catch (err) {
      setPaymentError('Network error. Please try again.')
    } finally {
      setIsPaymentSubmitting(false)
    }
  }

  const handlePaymentInputChange = (field: keyof PaymentFormData, value: string | number) => {
    setPaymentFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
                 {/* Header */}
         <div className="bg-white shadow-sm border-b border-gray-200">
           <div className="px-4 py-4 lg:px-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <Link 
                   href="/dashboard"
                   className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </Link>
                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                     <DollarSign className="w-5 h-5 text-white" />
                   </div>
                   <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Loan Management</h1>
                 </div>
               </div>
               
               <button
                 onClick={handleCreate}
                 className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 <span className="hidden sm:inline">Add Loan</span>
               </button>
             </div>
           </div>
         </div>

                          {/* Main Content */}
         <div className="p-4 lg:p-6">
           {/* Search and Filter */}
           <div className="mb-6">
             <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex-1">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                   <input
                     type="text"
                     placeholder="Search loans by worker name, amount, or date..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                   />
                 </div>
               </div>
             </div>
           </div>

                     {/* Error Display */}
           {error && (
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-4"
             >
               <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                 <AlertCircle className="w-5 h-5 text-red-600" />
                 <span className="text-red-800">{error}</span>
               </div>
             </motion.div>
           )}

                     {/* Loan List */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                      <motion.tr
                        key={loan._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            {getWorkerName(loan)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{(loan.loan_amt || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                          ₹{(loan.remaining_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (loan.status || 'active') === 'active' ? 'bg-green-100 text-green-800' :
                            (loan.status || 'active') === 'paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {(loan.status || 'active').charAt(0).toUpperCase() + (loan.status || 'active').slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(loan.loan_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(loan)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit Loan"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePayment(loan)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Record Payment"
                              disabled={loan.status === 'paid'}
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(loan)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Loan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'No loans found matching your search.' : 'No loan records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
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
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-2xl"
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedLoan ? 'Edit Loan' : 'Add New Loan'}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4" style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: '8px' }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Worker
                      </label>
                      <select
                        required
                        value={formData.worker_id}
                        onChange={(e) => handleWorkerChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select a worker</option>
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Amount
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.loan_amt}
                        onChange={(e) => setFormData(prev => ({ ...prev, loan_amt: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Date
                      </label>
                      <input
                        type="text"
                        required
                        value={rawLoanDate}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setRawLoanDate(inputValue);
                          if (inputValue.length === 10 && inputValue.includes('/')) {
                            const parts = inputValue.split('/');
                            if (parts.length === 3) {
                              const day = parts[0];
                              const month = parts[1];
                              const year = parts[2];
                              if (day && month && year) {
                                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                handleLoanDateChange(isoDate);
                              }
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.length === 10 && inputValue.includes('/')) {
                            const parts = inputValue.split('/');
                            if (parts.length === 3) {
                              const day = parts[0];
                              const month = parts[1];
                              const year = parts[2];
                              if (day && month && year) {
                                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                handleLoanDateChange(isoDate);
                              }
                            }
                          }
                        }}
                        placeholder="DD/MM/YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'paid' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{selectedLoan ? 'Update' : 'Create'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
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
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-2xl"
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Confirm Delete</h2>
                </div>

                <div className="px-6 py-4" style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: '8px' }}>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this loan record? This action cannot be undone.
                  </p>
                  
                  {selectedLoan && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Worker:</span> {getWorkerName(selectedLoan)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Loan Amount:</span> ₹{(selectedLoan.loan_amt || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Loan Date:</span> {formatDate(selectedLoan.loan_date)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 px-6 py-4">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
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
              onClick={() => setIsPaymentModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-2xl"
                style={{ 
                  position: 'relative',
                  maxHeight: '90vh',
                  width: 'auto',
                  minWidth: '320px',
                  maxWidth: '480px',
                  overflow: 'hidden',
                  zIndex: 1001,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Record Payment</h2>
                    <button
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {selectedLoan && (
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Worker:</span> {getWorkerName(selectedLoan)}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Loan Amount:</span> ₹{(selectedLoan.loan_amt || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Remaining Amount:</span> ₹{(selectedLoan.remaining_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                                 <form onSubmit={handlePaymentSubmit} className="px-6 py-4 flex flex-col" style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'auto', paddingRight: '8px' }}>
                   <div className="space-y-4 flex-1">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Payment Amount
                       </label>
                       <input
                         type="number"
                         required
                         min="1"
                         max={selectedLoan?.remaining_amount || 0}
                         value={paymentFormData.installment_amt}
                         onChange={(e) => handlePaymentInputChange('installment_amt', Number(e.target.value))}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                         placeholder="Enter payment amount"
                       />
                       <p className="text-xs text-gray-500 mt-1">
                         Maximum: ₹{(selectedLoan?.remaining_amount || 0).toLocaleString()}
                       </p>
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Payment Date
                       </label>
                       <input
                         type="date"
                         required
                         value={paymentFormData.installment_date}
                         onChange={(e) => handlePaymentInputChange('installment_date', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Notes (Optional)
                       </label>
                       <textarea
                         value={paymentFormData.notes}
                         onChange={(e) => handlePaymentInputChange('notes', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                         placeholder="Add any notes about this payment"
                         rows={2}
                       />
                     </div>

                     {paymentError && (
                       <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                         <AlertCircle className="w-4 h-4 text-red-600" />
                         <span className="text-red-800 text-sm">{paymentError}</span>
                       </div>
                     )}
                   </div>

                   <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                     <button
                       type="button"
                       onClick={() => setIsPaymentModalOpen(false)}
                       className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       disabled={isPaymentSubmitting || paymentFormData.installment_amt <= 0}
                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                     >
                       {isPaymentSubmitting ? (
                         <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span>Recording...</span>
                         </>
                       ) : (
                         <>
                           <CreditCard className="w-4 h-4" />
                           <span>Record Payment</span>
                         </>
                       )}
                     </button>
                   </div>
                 </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  )
}

export default LoanDashboard 