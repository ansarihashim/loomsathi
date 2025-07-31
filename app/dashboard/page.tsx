'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Plus,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  ArrowRight,
  Package,
  Layers,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SmoothNavigation from '@/components/ui/SmoothNavigation'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { useNavigationLoader } from '@/hooks/useNavigationLoader'

interface DashboardStats {
  totalWorkers: number
  remainingLoanAmount: number
  baanaStock: number
  beamStock: number
  lastWeekExpense: number
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface RecentActivity {
  id: string
  type: 'worker_added' | 'loan_created' | 'installment_paid' | 'expense_added' | 'beam_arrived' | 'baana_arrived'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
  quantity?: number
  date?: string
}

interface BeamActivity {
  id: string
  type: 'beam_arrived'
  quantity: number
  date: string
}

interface BaanaActivity {
  id: string
  type: 'baana_arrived'
  quantity: number
  date: string
}

const Dashboard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkers: 0,
    remainingLoanAmount: 0,
    baanaStock: 0,
    beamStock: 0,
    lastWeekExpense: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [beamActivity, setBeamActivity] = useState<BeamActivity | null>(null)
  const [baanaActivity, setBaanaActivity] = useState<BaanaActivity | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { startLoading, stopLoading } = useApiLoaderContext()
  const { navigateWithLoader } = useNavigationLoader({
    showOnNavigation: true,
    defaultMessage: 'Loading page...'
  })

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen])

  // Handle body scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  // Focus management for accessibility
  useEffect(() => {
    if (isSidebarOpen) {
      // Focus the first focusable element in sidebar when it opens
      const firstFocusable = document.querySelector('nav button, nav a, nav input')
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus()
      }
    }
  }, [isSidebarOpen])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('loomsathi_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch dashboard data
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('loomsathi_user')
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // Fetch stats and activities with loading indicators
      const [statsData, activitiesData, beamActivitiesData, baanaActivitiesData] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
          }
        }).then(res => res.ok ? res.json() : null),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/activities`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
          }
        }).then(res => res.ok ? res.json() : null),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/beam-activities`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
          }
        }).then(res => res.ok ? res.json() : null),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/baana-activities`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('loomsathi_token')}`
          }
        }).then(res => res.ok ? res.json() : null)
      ])

      if (statsData) {
        console.log('Dashboard stats received:', statsData)
        // Ensure all required fields have default values
        setStats({
          totalWorkers: statsData.totalWorkers || 0,
          remainingLoanAmount: statsData.remainingLoanAmount || 0,
          baanaStock: statsData.baanaStock || 0,
          beamStock: statsData.beamStock || 0,
          lastWeekExpense: statsData.lastWeekExpense || 0
        })
      }
      if (activitiesData) {
        setRecentActivities(activitiesData)
      }
      if (beamActivitiesData) {
        setBeamActivity(beamActivitiesData)
      }
      if (baanaActivitiesData) {
        setBaanaActivity(baanaActivitiesData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'worker_added':
        return <UserPlus className="w-5 h-5 text-blue-600" />
      case 'loan_created':
        return <DollarSign className="w-5 h-5 text-green-600" />
      case 'installment_paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'expense_added':
        return <FileText className="w-5 h-5 text-orange-600" />
      case 'beam_arrived':
        return <Layers className="w-5 h-5 text-orange-600" />
      case 'baana_arrived':
        return <Package className="w-5 h-5 text-purple-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Close sidebar when clicking on navigation items
  const handleNavigationClick = () => {
    setIsSidebarOpen(false)
  }

  // Handle overlay click to close sidebar
  const handleOverlayClick = () => {
    setIsSidebarOpen(false)
  }

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner message="Loading dashboard..." size="lg" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <motion.div 
              className="p-4 border-b border-gray-200 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SmoothNavigation href="/dashboard" icon={<TrendingUp className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Dashboard
                </SmoothNavigation>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <SmoothNavigation href="/dashboard/workers" icon={<Users className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Workers
                </SmoothNavigation>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SmoothNavigation href="/dashboard/loans" icon={<DollarSign className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Loans
                </SmoothNavigation>
              </motion.div>
              

              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <SmoothNavigation href="/dashboard/expenses" icon={<AlertCircle className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Expenses
                </SmoothNavigation>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <SmoothNavigation href="/dashboard/baana" icon={<Package className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Baana Management
                </SmoothNavigation>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <SmoothNavigation href="/dashboard/beam" icon={<Layers className="w-5 h-5" />} onClick={handleNavigationClick}>
                  Beam Management
                </SmoothNavigation>
              </motion.div>
            </nav>

            {/* Sidebar Footer */}
            <motion.div 
              className="p-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link 
                href="/dashboard/settings" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-textile-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                onClick={handleNavigationClick}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 z-40">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo and Hamburger Menu Button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Open menu"
                    aria-expanded={isSidebarOpen}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-textile-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">LoomSathi</span>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <ProfileDropdown user={user} />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Dashboard Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key="dashboard-content"
                className="p-4 lg:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Page Header */}
                <motion.div 
                  className="mb-6 lg:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                  <p className="text-gray-600">Welcome to your textile business management dashboard</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200 hover:shadow-lg hover:bg-purple-50 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigateWithLoader('/dashboard/baana', 'Loading baana...')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-600 truncate">Baana</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                          <Package className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                        </div>
                      </div>
                      
                      {/* Recent Baana Activity */}
                      <div className="mt-4">
                        {baanaActivity ? (
                          <div className="text-center">
                            <p className="text-2xl lg:text-3xl font-bold text-purple-700">
                              {baanaActivity.quantity}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              {baanaActivity.date}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-xs text-gray-500">No recent activity</p>
                          </div>
                        )}
                      </div>
                      
                      <motion.div 
                        className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm text-purple-600 font-medium">View Baana</span>
                        <ArrowRight className="w-4 h-4 ml-1 text-purple-600" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200 hover:shadow-lg hover:bg-orange-50 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigateWithLoader('/dashboard/beam', 'Loading beam...')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-600 truncate">Beam</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0">
                          <Layers className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                        </div>
                      </div>
                      
                      {/* Recent Beam Activity */}
                      <div className="mt-4">
                        {beamActivity ? (
                          <div className="text-center">
                            <p className="text-2xl lg:text-3xl font-bold text-orange-700">
                              {beamActivity.quantity}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              {beamActivity.date}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-xs text-gray-500">No recent activity</p>
                          </div>
                        )}
                      </div>
                      
                      <motion.div 
                        className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm text-orange-600 font-medium">View Beam</span>
                        <ArrowRight className="w-4 h-4 ml-1 text-orange-600" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200 hover:shadow-lg hover:bg-green-50 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigateWithLoader('/dashboard/loans', 'Loading loans...')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-600 truncate">Remaining Loan Amount</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                          <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                        </div>
                      </div>
                      
                      {/* Centered Amount Display */}
                      <div className="mt-4">
                        <div className="text-center">
                          <p className="text-2xl lg:text-3xl font-bold text-green-700">
                            ₹{(stats.remainingLoanAmount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Total Outstanding
                          </p>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm text-green-600 font-medium">Manage Loans</span>
                        <ArrowRight className="w-4 h-4 ml-1 text-green-600" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200 hover:shadow-lg hover:bg-red-50 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigateWithLoader('/dashboard/expenses', 'Loading expenses...')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-600 truncate">Last Week Expense</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                          <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                        </div>
                      </div>
                      
                                             {/* Centered Amount Display */}
                       <div className="mt-4">
                         <div className="text-center">
                           <p className="text-2xl lg:text-3xl font-bold text-red-700">
                             ₹{(stats.lastWeekExpense || 0).toLocaleString()}
                           </p>
                         </div>
                       </div>
                      
                      <motion.div 
                        className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm text-red-600 font-medium">View Expenses</span>
                        <ArrowRight className="w-4 h-4 ml-1 text-red-600" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>



                {/* Recent Activities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200"
                >
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
                  <div className="space-y-3 lg:space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                            <p className="text-sm text-gray-600 break-words leading-relaxed mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex-shrink-0`}>
                            {activity.status}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 lg:w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm lg:text-base">No recent activities</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={handleOverlayClick}
          />
        )}
      </div>
    </AuthGuard>
  )
}

export default Dashboard