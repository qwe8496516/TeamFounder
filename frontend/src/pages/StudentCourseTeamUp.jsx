import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'

function StudentCourseTeamUp() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isMatchingEnabled, setIsMatchingEnabled] = useState(false)
  const [myTeam, setMyTeam] = useState(null)
  const [availableStudents, setAvailableStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    const fetchMatchingStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login first',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            navigate('/login')
          })
          return
        }

        const response = await axios.get(
          `http://localhost:8080/api/course/${courseCode}/matching-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        
        setIsMatchingEnabled(response.data.isEnabled)
        if (response.data.myTeam) {
          setMyTeam(response.data.myTeam)
        }
        if (response.data.availableStudents) {
          setAvailableStudents(response.data.availableStudents)
        }
      } catch (error) {
        console.error('Error fetching matching status:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch matching status',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatchingStatus()
  }, [courseCode, navigate])

  const handleSelectStudent = (student) => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id))
    } else {
      setSelectedStudents([...selectedStudents, student])
    }
  }

  const handleCreateTeam = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:8080/api/course/${courseCode}/create-team`,
        {
          memberIds: selectedStudents.map(s => s.id)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      setMyTeam(response.data.team)
      setSelectedStudents([])
      
      Swal.fire({
        icon: 'success',
        title: 'Team Created',
        text: 'Your team has been created successfully',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      console.error('Error creating team:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create team',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Team Up</h1>
            </div>

            {!isMatchingEnabled && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Team Up Feature Not Available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The professor has not enabled the team up feature yet. Please wait for further notice.
                </p>
              </div>
            )}

            {isMatchingEnabled && myTeam && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">My Team</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    {myTeam.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isMatchingEnabled && !myTeam && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Available Students</h2>
                  <button
                    onClick={handleCreateTeam}
                    disabled={selectedStudents.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedStudents.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Create Team ({selectedStudents.length})
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedStudents.find(s => s.id === student.id)
                          ? 'bg-indigo-50 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-gray-700">{student.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCourseTeamUp
