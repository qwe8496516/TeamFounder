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
  const topRef = useRef(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // 確保在瀏覽器環境下
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

        // 收集所有可用的技能
        const allSkills = new Set()
        sortedStudents.forEach(student => {
          student.skills.forEach(skill => allSkills.add(skill))
        })
        setAvailableSkills(Array.from(allSkills))
      } catch (err) {
        console.error('Error fetching match data:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load match information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [courseCode])

  useEffect(() => {
    // 過濾學生
    let filtered = students

    // 根據搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 根據選中的技能過濾
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
      // 確保在瀏覽器環境下
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

      await axios.post(`http://localhost:8080/api/course/${courseCode}/invitation`, {
        receiverId: studentId,
        message: "I'd like to invite you to join my team!"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Invitation sent successfully',
        confirmButtonColor: '#4f46e5'
      })
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

              {/* 搜索和過濾區域 */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                          ? 'bg-indigo-600 text-white'
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
                                  {student.skills.map((skill, index) => (
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
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSendInvitation(student.id)}
                                  className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
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
                              ? 'bg-indigo-600 text-white'
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