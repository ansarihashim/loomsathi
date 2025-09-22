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
  Package,
  ArrowLeft,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { useNavigationLoader } from '@/hooks/useNavigationLoader'
import { formatDate } from '@/utils/formatDate'

interface Beam {
  _id: string
  beam_arrival_date: string
  beams_arrived: number
  week_start: string
  week_end: string
  createdAt: string
  updatedAt: string
}

interface BeamFormData {
  beam_arrival_date: string
  beams_arrived: number
  week_start: string
  week_end: string
}

const BeamDashboard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [beams, setBeams] = useState<Beam[]>([])
  const [filteredBeams, setFilteredBeams] = useState<Beam[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBeam, setSelectedBeam] = useState<Beam | null>(null)
  const [formData, setFormData] = useState<BeamFormData>({
    beam_arrival_date: '',
    beams_arrived: 0,
    week_start: '',
    week_end: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { startLoading, stopLoading } = useApiLoaderContext()
  const { navigateWithLoader, fetchWithLoader } = useNavigationLoader({
    showOnNavigation: true,
    defaultMessage: 'Loading...'
  })

  // Add local state for raw date inputs
  const [rawArrivalDate, setRawArrivalDate] = useState('');
  const [rawWeekStart, setRawWeekStart] = useState('');
  const [rawWeekEnd, setRawWeekEnd] = useState('');

  const fetchBeams = useCallback(async () => {
    try {
      const data = await fetchWithLoader(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/beams`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to fetch beam data: ${response.status} ${response.statusText}`)
        }
        return response.json()
      }, 'Fetching beam data...')

      setBeams(data.data || [])
      setFilteredBeams(data.data || [])
    } catch (error: any) {
      console.error('Error fetching beam:', error)
      setError(`Failed to fetch beam data: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [fetchWithLoader])

  useEffect(() => {
    fetchBeams()
  }, [fetchBeams])

  useEffect(() => {
    // Filter beams based on search term
    const filtered = beams.filter(beam => 
      beam.beams_arrived.toString().includes(searchTerm) ||
      formatDate(beam.beam_arrival_date).includes(searchTerm)
    )
    setFilteredBeams(filtered)
  }, [searchTerm, beams])

  const handleCreate = () => {
    setFormData({
      beam_arrival_date: '',
      beams_arrived: 0,
      week_start: '',
      week_end: ''
    })
    setRawArrivalDate('');
    setRawWeekStart('');
    setRawWeekEnd('');
    setSelectedBeam(null)
    setError('')
    setIsModalOpen(true)
  }

  const handleEdit = (beam: Beam) => {
    setSelectedBeam(beam)
    // Convert ISO dates to DD/MM/YYYY for the raw input
    const arrivalDate = beam.beam_arrival_date.split('T')[0]
    const weekStart = beam.week_start.split('T')[0]
    const weekEnd = beam.week_end.split('T')[0]
    setRawArrivalDate(formatDate(arrivalDate))
    setRawWeekStart(formatDate(weekStart))
    setRawWeekEnd(formatDate(weekEnd))
    setFormData({
      beam_arrival_date: arrivalDate,
      beams_arrived: beam.beams_arrived,
      week_start: weekStart,
      week_end: weekEnd
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleDelete = (beam: Beam) => {
    setSelectedBeam(beam)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const url = selectedBeam 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/beams/${selectedBeam._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/beams`
      
      const method = selectedBeam ? 'PUT' : 'POST'
      
      console.log('Sending request to:', url)
      console.log('Method:', method)
      console.log('Form data:', formData)
      console.log('Form data JSON:', JSON.stringify(formData))
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        let errorMessage = 'Failed to save beam'
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ')
          } else {
            errorMessage = errorData.error || errorData.message || errorMessage
          }
        } catch (e) {
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      setIsModalOpen(false)
      fetchBeams()
    } catch (error: any) {
      console.error('Error saving beam:', error)
      setError(error.message || 'Failed to save beam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedBeam) return

    try {
      startLoading('Deleting beam...')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/beams/${selectedBeam._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete beam')
      }

      setIsDeleteModalOpen(false)
      setSelectedBeam(null)
      fetchBeams()
    } catch (error) {
      console.error('Error deleting beam:', error)
      setError('Failed to delete beam')
    } finally {
      stopLoading()
    }
  }

  const handleArrivalDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      beam_arrival_date: date
    }))
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner message="Loading beam dashboard..." size="lg" />
        </div>
      </AuthGuard>
    )
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
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Beam Management</h1>
                </div>
              </div>
              
              <button
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Beam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6">
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by quantity or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </motion.div>
          )}

          {/* Beam List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBeams.length > 0 ? (
                    filteredBeams.map((beam) => (
                      <motion.tr
                        key={beam._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(beam.beam_arrival_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {beam.beams_arrived}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(beam.week_start)} - {formatDate(beam.week_end)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(beam)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(beam)}
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
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'No beams found matching your search.' : 'No beam records found.'}
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
              className="min-h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedBeam ? 'Edit Beam' : 'Add New Beam'}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Date
                      </label>
                      <input
                        type="text"
                        required
                        value={rawArrivalDate}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setRawArrivalDate(inputValue);
                          if (inputValue.length === 10 && inputValue.includes('/')) {
                            const parts = inputValue.split('/');
                            if (parts.length === 3) {
                              const day = parts[0];
                              const month = parts[1];
                              const year = parts[2];
                              if (day && month && year) {
                                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                handleArrivalDateChange(isoDate);
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
                                handleArrivalDateChange(isoDate);
                              }
                            }
                          }
                        }}
                        placeholder="DD/MM/YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Arrived
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.beams_arrived}
                        onChange={(e) => setFormData(prev => ({ ...prev, beams_arrived: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Week Start
                        </label>
                        <input
                          type="text"
                          required
                          value={rawWeekStart}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setRawWeekStart(inputValue);
                            if (inputValue.length === 10 && inputValue.includes('/')) {
                              const parts = inputValue.split('/');
                              if (parts.length === 3) {
                                const day = parts[0];
                                const month = parts[1];
                                const year = parts[2];
                                if (day && month && year) {
                                  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                  setFormData(prev => ({ ...prev, week_start: isoDate }));
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
                                  setFormData(prev => ({ ...prev, week_start: isoDate }));
                                }
                              }
                            }
                          }}
                          placeholder="DD/MM/YYYY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Week End
                        </label>
                        <input
                          type="text"
                          required
                          value={rawWeekEnd}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setRawWeekEnd(inputValue);
                            if (inputValue.length === 10 && inputValue.includes('/')) {
                              const parts = inputValue.split('/');
                              if (parts.length === 3) {
                                const day = parts[0];
                                const month = parts[1];
                                const year = parts[2];
                                if (day && month && year) {
                                  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                  setFormData(prev => ({ ...prev, week_end: isoDate }));
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
                                  setFormData(prev => ({ ...prev, week_end: isoDate }));
                                }
                              }
                            }
                          }}
                          placeholder="DD/MM/YYYY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 mt-4">
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{selectedBeam ? 'Update' : 'Create'}</span>
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
              className="min-h-screen inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
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
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Confirm Delete</h2>
                </div>

                <div className="px-6 py-4" style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: '8px' }}>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this beam record? This action cannot be undone.
                  </p>
                  
                  {selectedBeam && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Quantity:</span> {selectedBeam.beams_arrived}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Arrival Date:</span> {formatDate(selectedBeam?.beam_arrival_date)}
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
      </div>
    </AuthGuard>
  )
}

export default BeamDashboard 