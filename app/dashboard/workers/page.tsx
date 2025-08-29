'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus,
  Search,
  Filter,
  ArrowLeft,
  User,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Building2,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import EditWorkerModal from '@/components/modals/EditWorkerModal'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal'
import AddWorkerModal from '@/components/modals/AddWorkerModal'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import DataFetchingAnimation from '@/components/ui/DataFetchingAnimation'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { formatDate } from '@/utils/formatDate'

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

const WorkersPage = () => {
  const router = useRouter()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showSidebar, setShowSidebar] = useState(false)
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [user, setUser] = useState<any>(null)
  const { startLoading, stopLoading } = useApiLoaderContext()



  useEffect(() => {
    fetchWorkers()
    
    // Get user data from localStorage
    const userData = localStorage.getItem('loomsathi_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/workers/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Handle both response formats: { success: true, data: workers } and direct workers array
        const workersData = data.data || data.workers || data
        setWorkers(Array.isArray(workersData) ? workersData : [])
      } else {
        console.error('Failed to fetch workers')
        setWorkers([])
      }
    } catch (error) {
      console.error('Error fetching workers:', error)
      setWorkers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm) ||
                         worker.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
    switch (designation.toLowerCase()) {
      case 'weaver': return 'bg-blue-100 text-blue-800'
      case 'repairer': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker)
    setShowEditModal(true)
  }

  const handleDeleteWorker = (worker: Worker) => {
    setSelectedWorker(worker)
    setShowDeleteModal(true)
  }

  const handleWorkerUpdate = (updatedWorker: Worker) => {
    setWorkers(prevWorkers => 
      prevWorkers.map(worker => 
        worker._id === updatedWorker._id ? updatedWorker : worker
      )
    )
  }

  const handleWorkerAdded = (newWorker: Worker) => {
    setWorkers(prevWorkers => [newWorker, ...prevWorkers])
  }

  const handleWorkerDelete = async () => {
    if (!selectedWorker) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/workers/${selectedWorker._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
        }
      })

      if (response.ok) {
        // Remove the worker from the list
        setWorkers(prevWorkers => 
          prevWorkers.filter(worker => worker._id !== selectedWorker._id)
        )
        setSelectedWorker(null)
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
          <LoadingSpinner message="Loading workers..." size="lg" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between py-2 sm:py-0 sm:h-16">
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
                    <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">Workers Management</h1>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 bg-textile-500 text-white rounded-lg hover:bg-textile-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-2">Add Worker</span>
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key="workers-content"
            className="px-4 py-3 sm:py-4 lg:py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="appearance-none px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-textile-500 transition-colors duration-200 text-sm sm:text-base w-full"
                  >
                    <option value="all">All Workers</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-gray-400 transform rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">Total Workers</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors truncate">{workers.length}</p>
                  </div>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-green-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-green-600 truncate">Active Workers</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 group-hover:text-green-700 transition-colors truncate">
                      {workers.filter(w => w.status === 'active').length}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-yellow-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-yellow-600 truncate">Total Loans</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900 group-hover:text-yellow-700 transition-colors truncate">
                      {workers.reduce((sum, w) => sum + w.loan_history.length, 0)}
                    </p>
                  </div>
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-600 flex-shrink-0" />
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-red-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-red-600 truncate">Pending Amount</p>
                    <p className="text-sm sm:text-lg lg:text-xl font-bold text-red-900 group-hover:text-red-700 transition-colors truncate">
                      {formatCurrency(workers.reduce((sum, w) => sum + w.remaining_amt, 0))}
                    </p>
                  </div>
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Workers Table - Mobile Responsive */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkers.map((worker, index) => (
                    <motion.tr
                      key={worker._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-textile-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-textile-600">
                                {worker.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                            <div className="text-sm text-gray-500">{worker.address}</div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDesignationColor(worker.designation)}`}>
                              {worker.designation}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {worker.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {worker.email}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                            {worker.status}
                          </span>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Joined: {formatDate(worker.join_date)}
                            </div>
                            {worker.leave_date && (
                              <div className="flex items-center text-red-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                Left: {formatDate(worker.leave_date)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Total Loan:</span> {formatCurrency(worker.total_loan_amt)}
                          </div>
                          <div className="text-sm text-green-600">
                            <span className="font-medium">Paid:</span> {formatCurrency(worker.paid_amt)}
                          </div>
                          <div className="text-sm text-red-600">
                            <span className="font-medium">Remaining:</span> {formatCurrency(worker.remaining_amt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Loans:</span> {worker.loan_history?.length || 0}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/workers/${worker._id}`)}
                            className="text-textile-600 hover:text-textile-900 transition-colors p-1"
                            title="View Profile"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditWorker(worker)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                            title="Edit Worker"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(worker)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1"
                            title="Delete Worker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {filteredWorkers.map((worker, index) => (
                <motion.div
                  key={worker._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-200 p-3 sm:p-4 hover:bg-gray-50 transition-colors mb-3 sm:mb-4"
                >
                  {/* Header with Avatar, Name, and Actions */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-textile-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base font-medium text-textile-600">
                          {worker.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{worker.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{worker.address}</p>
                        <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                          <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDesignationColor(worker.designation)}`}>
                            {worker.designation}
                          </span>
                          <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                            {worker.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/dashboard/workers/${worker._id}`)}
                        className="text-textile-600 hover:text-textile-900 transition-colors p-1.5 sm:p-2"
                        title="View Profile"
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleEditWorker(worker)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 sm:p-2"
                        title="Edit Worker"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWorker(worker)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1.5 sm:p-2"
                        title="Delete Worker"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-900">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{worker.phone}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{worker.email}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Joined: {formatDate(worker.join_date)}</span>
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div className="pt-2 sm:pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Total Loan:</span>
                        <p className="text-gray-600 truncate">{formatCurrency(worker.total_loan_amt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">Paid:</span>
                        <p className="text-green-600 truncate">{formatCurrency(worker.paid_amt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">Remaining:</span>
                        <p className="text-red-600 truncate">{formatCurrency(worker.remaining_amt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Loans:</span>
                        <p className="text-gray-600 truncate">{worker.loan_history?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredWorkers.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No workers found</h3>
                <p className="text-sm sm:text-base text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first worker.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link href="/dashboard/workers/add">
                    <button className="mt-4 bg-textile-500 hover:bg-textile-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add First Worker
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Worker Modal */}
      <AddWorkerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onWorkerAdded={handleWorkerAdded}
      />

      {/* Edit Worker Modal */}
      <EditWorkerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedWorker(null)
        }}
        worker={selectedWorker}
        onUpdate={handleWorkerUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedWorker(null)
        }}
        workerName={selectedWorker?.name || ''}
        onConfirm={handleWorkerDelete}
      />

    </AuthGuard>
  )
}

export default WorkersPage 