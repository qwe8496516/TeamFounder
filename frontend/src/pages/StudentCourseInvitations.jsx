import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion, AnimatePresence } from 'framer-motion'
import CourseNavigation from '../components/CourseNavigation'

// Mock data
const mockInvitations = [
  {
    id: 1,
    sender: {
      id: 101,
      name: 'John Smith',
      major: 'Computer Science',
      year: 'Junior',
      skills: ['React', 'Node.js', 'Python'],
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    message: 'Hey! I saw your profile and I think we would make a great team. I\'m looking for someone with React experience for our final project.'
  },
  {
    id: 2,
    sender: {
      id: 102,
      name: 'Emma Wilson',
      major: 'Software Engineering',
      year: 'Sophomore',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    message: 'Hi! I noticed you have experience with backend development. Would you be interested in joining our team? We\'re planning to build a web application.'
  },
  {
    id: 3,
    sender: {
      id: 103,
      name: 'Michael Brown',
      major: 'Artificial Intelligence',
      year: 'Senior',
      skills: ['Python', 'TensorFlow', 'Data Analysis'],
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    message: 'Our team is looking for someone with machine learning experience. Your skills match perfectly with what we need!'
  },
  {
    id: 4,
    sender: {
      id: 104,
      name: 'Sarah Davis',
      major: 'Computer Science',
      year: 'Junior',
      skills: ['Vue.js', 'Node.js', 'MongoDB'],
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    message: 'Looking for a full-stack developer to join our team. We have a great project idea!'
  },
  {
    id: 5,
    sender: {
      id: 105,
      name: 'David Lee',
      major: 'Software Engineering',
      year: 'Senior',
      skills: ['React', 'TypeScript', 'GraphQL'],
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    message: 'We need a frontend developer for our team. Your React skills would be perfect!'
  },
  {
    id: 6,
    sender: {
      id: 106,
      name: 'Lisa Chen',
      major: 'Computer Science',
      year: 'Sophomore',
      skills: ['Python', 'Django', 'PostgreSQL'],
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    message: 'Our team is working on a web application and would love to have you join us!'
  }
]

function StudentCourseInvitations() {
  const { courseCode } = useParams()
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    // Simulate API call with setTimeout
    setInvitations(mockInvitations)
    setIsLoading(false)
  }, [])

  const handleAcceptInvitation = async (invitationId) => {
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setInvitations(invitations.filter(inv => inv.id !== invitationId))
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
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setInvitations(invitations.filter(inv => inv.id !== invitationId))
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
  const currentInvitations = invitations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(invitations.length / itemsPerPage)

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

        <motion.div
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{invitations.length} Invitations</span>
                </div>
              </div>

              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Invitations</h3>
                  <p className="text-gray-500">You haven't received any team invitations yet</p>
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
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {invitation.sender.name}
                                </h3>
                                <div className="flex space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAcceptInvitation(invitation.id)}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                  >
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRejectInvitation(invitation.id)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                  >
                                    Decline
                                  </motion.button>
                                </div>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>{invitation.sender.major}</span>
                                <span className="mx-2">•</span>
                                <span>{invitation.sender.year}</span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {invitation.sender.skills.map((skill, index) => (
                                  <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                              {invitation.message && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="mt-4 p-4 bg-gray-50 rounded-lg"
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
      </div>
    </div>
  )
}

export default StudentCourseInvitations 