import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion, AnimatePresence } from 'framer-motion'
import CourseNavigation from '../components/CourseNavigation'

const StudentCourseMatch = () => {
  const { courseCode } = useParams()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [currentStudents, setCurrentStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [availableSkills, setAvailableSkills] = useState([])
  const [isTeamUpEnabled, setIsTeamUpEnabled] = useState(false)
  const [teamConfig, setTeamConfig] = useState(null)
  const topRef = useRef(null)

  const fetchStudents = async () => {
    try {
      if (typeof window === 'undefined') return

      const id = window.localStorage.getItem('id')
      const token = window.localStorage.getItem('token')

      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please login first',
          confirmButtonColor: '#4f46e5'
        })
        return
      }

      const response = await axios.get(`http://localhost:8080/api/course/${courseCode}/student/${id}/match`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const formattedStudents = response.data.map(student => ({
        id: student.id,
        name: student.username,
        userId: student.userId,
        email: student.email,
        skills: student.skills.map(skill => skill.name),
        matchScore: student.Fitness,
        avatar: `https://i.pravatar.cc/150?img=${student.id}`
      }))
      
      const sortedStudents = formattedStudents.sort((a, b) => b.matchScore - a.matchScore)
      
      setStudents(sortedStudents)
      setFilteredStudents(sortedStudents)

      const allSkills = new Set()
      sortedStudents.forEach(student => {
        student.skills.forEach(skill => allSkills.add(skill))
      })
      setAvailableSkills(Array.from(allSkills))
    } catch (err) {
      console.error('Error fetching students:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load students',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window === 'undefined') return

        const token = window.localStorage.getItem('token')

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

        const now = new Date()
        const startDate = new Date(configResponse.data.startDate)
        const endDate = new Date(configResponse.data.endDate)
        const isEnabled = configResponse.data.status === 1 && now >= startDate && now <= endDate
        
        setIsTeamUpEnabled(isEnabled)

        if (isEnabled) {
          await fetchStudents()
        }
      } catch (err) {
        console.error('Error fetching data:', err)
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

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(student =>
        selectedSkills.every(skill => student.skills.includes(skill))
      )
    }

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedSkills, students])

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentStudents(filteredStudents.slice(indexOfFirstItem, indexOfLastItem))
  }, [currentPage, filteredStudents, itemsPerPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSendInvitation = async (studentId) => {
    try {
      if (typeof window === 'undefined') return

      const token = window.localStorage.getItem('token')
      const id = window.localStorage.getItem('id')
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please login first',
          confirmButtonColor: '#4f46e5'
        })
        return
      }

      const confirmResult = await Swal.fire({
        title: 'Send Team Invitation',
        text: "Are you sure you want to send a team invitation to this student?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Cancel'
      })

      if (!confirmResult.isConfirmed) {
        return
      }

      const defaultMessage = "I'd like to invite you to join my team! I think we would work well together based on our skills and interests."

      const { value: formValues } = await Swal.fire({
        title: 'Write Your Message',
        html:
          '<div class="mb-4">' +
          '<label class="block text-sm font-medium text-gray-700 mb-2">Invitation Message</label>' +
          '<textarea id="swal-message" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows="3">' + 
          defaultMessage +
          '</textarea>' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Send Invitation',
        cancelButtonText: 'Back',
        preConfirm: () => {
          const message = document.getElementById('swal-message').value
          if (!message.trim()) {
            Swal.showValidationMessage('Please enter a message')
            return false
          }
          return message
        }
      })

      if (formValues) {
        // Final confirmation
        const finalConfirm = await Swal.fire({
          title: 'Confirm Send',
          text: "Are you sure you want to send this invitation?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4f46e5',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, send it',
          cancelButtonText: 'No, go back'
        })

        if (finalConfirm.isConfirmed) {
          await axios.post(`http://localhost:8080/api/invitations`, null, {
            params: {
              senderId: id,
              receiverId: studentId,
              courseCode: courseCode,
              message: formValues,
              status: 0
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          await fetchStudents()

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Invitation sent successfully',
            confirmButtonColor: '#4f46e5'
          })
        }
      }
    } catch (err) {
      console.error('Error sending invitation:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send invitation',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  if (isLoading) {
    return <Loading />
  }

  if (!isTeamUpEnabled) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseNavigation courseCode={courseCode} currentPage="match" userType="student" />
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
                ) : (
                  'Team formation is currently disabled for this course'
                )
              ) : (
                'Team formation feature is not available for this course yet'
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseNavigation courseCode={courseCode} currentPage="match" userType="student" />

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
                <h2 className="text-2xl font-bold text-gray-900">Find Teammates</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{filteredStudents.length} Potential Matches</span>
                </div>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedSkills.includes(skill)
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                  <p className="text-gray-500">We couldn't find any potential teammates matching your criteria</p>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <div className="space-y-6">
                      {currentStudents.map((student) => (
                        <motion.div
                          key={student.id}
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
                                src={student.avatar}
                                alt={student.name}
                              />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {student.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  student.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                                  student.matchScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                  student.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {student.matchScore}% Match
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>{student.email}</span>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                  {student.skills && student.skills.length > 0 ? (
                                    student.skills.map((skill, index) => (
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
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSendInvitation(student.id)}
                                  className="ml-4 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                >
                                  Send Invitation
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-gray-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
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

export default StudentCourseMatch 