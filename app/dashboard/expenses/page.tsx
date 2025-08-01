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
  Receipt
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { useNavigationLoader } from '@/hooks/useNavigationLoader'
import { formatDate } from '@/utils/formatDate'

interface Expense {
  _id: string
  title: string
  amount: number
  category: string
  description: string
  expense_date: string | Date
  createdAt: string
  updatedAt: string
}

interface ExpenseFormData {
  title: string
  amount: number
  category: string
  description: string
  expense_date: string
}

// Component to handle search params with Suspense
const SearchParamsHandler = ({ 
  isLoading, 
  handleCreate, 
  router 
}: { 
  isLoading: boolean
  handleCreate: () => void
  router: any
}) => {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'create' && !isLoading) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        handleCreate()
        // Clean up the URL parameter
        router.replace('/dashboard/expenses', { scroll: false })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [searchParams, isLoading, router, handleCreate])
  
  return null
}

const ExpenseDashboard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: 0,
    category: '',
    description: '',
    expense_date: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { startLoading, stopLoading } = useApiLoaderContext()
  const { navigateWithLoader } = useNavigationLoader({
    showOnNavigation: true,
    defaultMessage: 'Loading...'
  })

  // Add local state for raw date input
  const [rawExpenseDate, setRawExpenseDate] = useState('')

  const fetchExpenses = useCallback(async () => {
    try {
      startLoading('Fetching expense data...')
      
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        return
      }
      
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch expense data: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setExpenses(data.data || [])
      setFilteredExpenses(data.data || [])
    } catch (error: any) {
      console.error('Error fetching expenses:', error)
      setError(`Failed to fetch expense data: ${error.message}`)
    } finally {
      stopLoading()
      setIsLoading(false)
    }
  }, [startLoading, stopLoading])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  // Check for URL parameter to auto-open create modal
  useEffect(() => {
    // This will be handled by the SearchParamsHandler component
  }, [])

  useEffect(() => {
    // Filter expenses based on search term
    const filtered = expenses.filter(expense => 
      (expense.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.amount || 0).toString().includes(searchTerm) ||
      formatDate(expense.expense_date).includes(searchTerm)
    )
    setFilteredExpenses(filtered)
  }, [searchTerm, expenses])

  const handleCreate = () => {
    setSelectedExpense(null)
    setFormData({
      title: '',
      amount: 0,
      category: '',
      description: '',
      expense_date: ''
    })
    setRawExpenseDate('')
    setError('')
    setIsModalOpen(true)
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      expense_date: typeof expense.expense_date === 'string' ? expense.expense_date : expense.expense_date.toISOString().split('T')[0]
    })
    setRawExpenseDate(formatDate(expense.expense_date))
    setError('')
    setIsModalOpen(true)
  }

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Enhanced validation
    if (!formData.title || formData.title.trim() === '') {
      setError('Please enter a valid title.')
      return
    }
    
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    
    if (!formData.category || formData.category.trim() === '') {
      setError('Please select a valid category.')
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('loomsathi_token')
      const url = selectedExpense 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses/${selectedExpense._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`
      
      const response = await fetch(url, {
        method: selectedExpense ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          expense_date: formData.expense_date
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save expense')
      }

      await fetchExpenses()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving expense:', error)
      setError(error instanceof Error ? error.message : 'Failed to save expense')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedExpense) return

    try {
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses/${selectedExpense._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      await fetchExpenses()
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting expense:', error)
      setError('Failed to delete expense')
    }
  }

  const handleExpenseDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, expense_date: date }))
  }

  const handleCleanup = async () => {
    if (!confirm('This will permanently delete all invalid expense records (those with empty titles, categories, or zero amounts). Are you sure?')) {
      return
    }

    try {
      startLoading('Cleaning up invalid expenses...')
      
      const token = localStorage.getItem('loomsathi_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses/cleanup`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to cleanup expenses')
      }
      
      const data = await response.json()
      console.log('Cleanup result:', data)
      
      if (data.success) {
        setError('')
        await fetchExpenses()
        alert(`Successfully cleaned up ${data.data.deletedCount} invalid expense records.`)
      } else {
        throw new Error(data.error || 'Cleanup failed')
      }
    } catch (error) {
      console.error('Error cleaning up expenses:', error)
      setError('Failed to cleanup expenses. Please try again.')
    } finally {
      stopLoading()
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <SearchParamsHandler 
          isLoading={isLoading}
          handleCreate={handleCreate}
          router={router}
        />
      </Suspense>
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Expense Management</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCreate}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Expense</span>
                </button>
              </div>
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
                    placeholder="Search expenses by title, category, amount, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

          {/* Expense List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <motion.tr
                        key={expense._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                                                 <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div className="flex items-center">
                             <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                             {expense.title}
                           </div>
                         </td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm">
                           <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                             {expense.category}
                           </span>
                         </td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                           ₹{expense.amount.toLocaleString()}
                         </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(expense.expense_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'No expenses found matching your search.' : (
                          <div>
                            <p>No valid expense records found.</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Invalid records with empty titles, categories, or zero amounts have been filtered out.
                            </p>
                            <p className="text-sm text-blue-600 mt-2">
                              Click "Cleanup" to permanently remove invalid records from the database.
                            </p>
                          </div>
                        )}
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
                      {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
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
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Labor">Labor</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expense Date
                      </label>
                      <input
                        type="text"
                        required
                        value={rawExpenseDate}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setRawExpenseDate(inputValue);
                          if (inputValue.length === 10 && inputValue.includes('/')) {
                            const parts = inputValue.split('/');
                            if (parts.length === 3) {
                              const day = parts[0];
                              const month = parts[1];
                              const year = parts[2];
                              if (day && month && year) {
                                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                handleExpenseDateChange(isoDate);
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
                                handleExpenseDateChange(isoDate);
                              }
                            }
                          }
                        }}
                        placeholder="DD/MM/YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
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
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{selectedExpense ? 'Update' : 'Create'}</span>
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
                    Are you sure you want to delete this expense record? This action cannot be undone.
                  </p>
                  
                  {selectedExpense && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Title:</span> {selectedExpense.title}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Category:</span> {selectedExpense.category}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Amount:</span> ₹{selectedExpense.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Date:</span> {formatDate(selectedExpense.expense_date)}
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
      </motion.div>
    </AuthGuard>
  )
}

export default ExpenseDashboard 