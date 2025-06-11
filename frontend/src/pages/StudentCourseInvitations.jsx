import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion, AnimatePresence } from 'framer-motion'
import CourseNavigation from '../components/CourseNavigation'
import axios from 'axios'

function StudentCourseInvitations() {
  const { courseCode } = useParams()
  const [invitations, setInvitations] = useState([])
  const [filteredInvitations, setFilteredInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isTeamUpEnabled, setIsTeamUpEnabled] = useState(false)
  const [teamConfig, setTeamConfig] = useState(null)
  const [statusFilter, setStatusFilter] = useState(0)
  const itemsPerPage = 3

  useEffect(() => {
    const filtered = invitations.filter(invitation => invitation.status === statusFilter)
    setFilteredInvitations(filtered)
    setCurrentPage(1)
  }, [invitations, statusFilter])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login first',
            confirmButtonColor: '#4f46e5'
          })
          return
        }

        const configResponse = await axios.get(`http://localhost:8080/api/teamConfig/${courseCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTeamConfig(configResponse.data)

        const now = new Date();
        const startDate = new Date(configResponse.data.startDate);
        const endDate = new Date(configResponse.data.endDate);

        const formatDateOnly = (date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const today = formatDateOnly(now);
        const start = formatDateOnly(startDate);
        const end = formatDateOnly(endDate);

        const isEnabled = configResponse.data.status === 1 && today >= start && today <= end;
        setIsTeamUpEnabled(isEnabled)

        if (isEnabled) {
          const id = localStorage.getItem('id')
          const invitationsResponse = await axios.get(`http://localhost:8080/api/invitations/${courseCode}/invitations/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          const formattedInvitations = invitationsResponse.data.map(invitation => ({
            id: invitation.id,
            sender: {
              id: invitation.student.id,
              name: invitation.student.username,
              email: invitation.student.email,
              skills: invitation.skills.map(skill => skill.name),
              avatar: `https://i.pravatar.cc/150?img=${invitation.student.id}`
            },
            message: invitation.message,
            status: invitation.status
          }))

          setInvitations(formattedInvitations)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseCode])

  const handleAcceptInvitation = async (invitationId) => {
    const result = await Swal.fire({
      title: 'Accept Invitation',
      text: 'Are you sure you want to accept this invitation?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280'
    })

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please login first',
          confirmButtonColor: '#4f46e5'
        })
        return
      }

      await axios.put(`http://localhost:8080/api/invitations/${invitationId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setInvitations(prevInvitations => {
        const updatedInvitations = prevInvitations.map(inv => 
          inv.id === invitationId ? { ...inv, status: 1 } : inv
        )
        return updatedInvitations
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Invitation accepted successfully',
        confirmButtonColor: '#4f46e5'
      })
    } catch (err) {
      console.error('Error accepting invitation:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to accept invitation',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleRejectInvitation = async (invitationId) => {
    const result = await Swal.fire({
      title: 'Reject Invitation',
      text: 'Are you sure you want to reject this invitation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    })

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please login first',
          confirmButtonColor: '#4f46e5'
        })
        return
      }

      await axios.put(`http://localhost:8080/api/invitations/${invitationId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setInvitations(prevInvitations => {
        const updatedInvitations = prevInvitations.map(inv => 
          inv.id === invitationId ? { ...inv, status: 2 } : inv
        )
        return updatedInvitations
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Invitation rejected successfully',
        confirmButtonColor: '#4f46e5'
      })
    } catch (err) {
      console.error('Error rejecting invitation:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reject invitation',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInvitations = filteredInvitations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInvitations.length / itemsPerPage)

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentPage === i
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      )
    }
    return pages
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseNavigation courseCode={courseCode} currentPage="invitations" userType="student" />
        
        <AnimatePresence mode="wait">
          {!isTeamUpEnabled ? (
            <motion.div
              key="disabled"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Team Formation Not Available</h3>
                <p className="text-gray-500 mb-6">
                  {teamConfig ? (
                    teamConfig.status === 1 ? (
                      <>
                        Team formation will be available from {new Date(teamConfig.startDate).toLocaleDateString()} to {new Date(teamConfig.endDate).toLocaleDateString()}
                      </>
                    ) : teamConfig.status === 2 ? (
                      'Team formation has ended for this course'
                    ) : (
                      'Team formation is currently disabled for this course'
                    )
                  ) : (
                    'Team formation feature is not available for this course yet'
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="enabled"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Team Invitations</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setStatusFilter(0)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            statusFilter === 0
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => setStatusFilter(1)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            statusFilter === 1
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Accepted
                        </button>
                        <button
                          onClick={() => setStatusFilter(2)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            statusFilter === 2
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Rejected
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">{filteredInvitations.length} Invitations</span>
                    </div>
                  </div>

                  {filteredInvitations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Invitations</h3>
                      <p className="text-gray-500">
                        {`You haven't received any ${statusFilter === 0 ? 'pending' : statusFilter === 1 ? 'accepted' : 'rejected'} invitations`}
                      </p>
                    </div>
                  ) : (
                    <>
                      <AnimatePresence mode="wait">
                        <div className="space-y-6">
                          {currentInvitations.map((invitation) => (
                            <motion.div
                              key={invitation.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex items-start space-x-4">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex-shrink-0"
                                >
                                  <img
                                    className="h-16 w-16 rounded-full border-2 border-white shadow-sm"
                                    src={invitation.sender.avatar || '/images/default-avatar.png'}
                                    alt={invitation.sender.name}
                                  />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {invitation.sender.name}
                                      </h3>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        invitation.status === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                        invitation.status === 1 ? 'bg-green-100 text-green-800 border border-green-200' :
                                        'bg-red-100 text-red-800 border border-red-200'
                                      }`}>
                                        {invitation.status === 0 ? 'PENDING' :
                                         invitation.status === 1 ? 'ACCEPTED' :
                                         'REJECTED'}
                                      </span>
                                    </div>
                                    {invitation.status === 0 && (
                                      <div className="flex space-x-2">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleAcceptInvitation(invitation.id)}
                                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                                        >
                                          Accept
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleRejectInvitation(invitation.id)}
                                          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-300 shadow-sm"
                                        >
                                          Decline
                                        </motion.button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{invitation.sender.email}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {invitation.sender.skills && invitation.sender.skills.length > 0 ? (
                                      invitation.sender.skills.map((skill, index) => (
                                        <motion.span
                                          key={index}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.1 }}
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                        >
                                          {skill}
                                        </motion.span>
                                      ))
                                    ) : (
                                      <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200"
                                      >
                                        No Skills
                                      </motion.span>
                                    )}
                                  </div>
                                  {invitation.message && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.2 }}
                                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                      <p className="text-sm text-gray-600">{invitation.message}</p>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>

                      {totalPages > 1 && (
                        <div className="mt-8 flex justify-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Previous
                          </button>
                          {renderPagination()}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StudentCourseInvitations 