import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import CourseNavigation from '../components/CourseNavigation'
import Swal from 'sweetalert2'
import axios from 'axios'

const MOCK_TEAM = {
  id: 1,
  name: 'Team Alpha',
  members: [
    { id: 1, name: 'John Smith', studentId: 'D12345678', role: 'Team Leader' },
    { id: 2, name: 'Emma Wilson', studentId: 'D12345679', role: 'Frontend Developer' },
    { id: 3, name: 'Michael Brown', studentId: 'D12345680', role: 'Backend Developer' },
    { id: 4, name: 'Sarah Davis', studentId: 'D12345681', role: 'UI/UX Designer' }
  ],
  status: 'Confirmed',
  projectTitle: 'Smart Campus Navigation System'
}

function StudentCourseTeamUp() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  const [team, setTeam] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTeamUpEnabled, setIsTeamUpEnabled] = useState(false)
  const [teamConfig, setTeamConfig] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
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

        const configResponse = await axios.get(`http://localhost:8080/api/teamConfig/${courseCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTeamConfig(configResponse.data)

        const now = new Date()
        const startDate = new Date(configResponse.data.startDate)
        const endDate = new Date(configResponse.data.endDate)
        const isEnabled = configResponse.data.status && now >= startDate && now <= endDate
        setIsTeamUpEnabled(isEnabled)

        if (isEnabled) {
          setTeam(MOCK_TEAM)
        }
      } catch (error) {
        console.error('Error fetching team data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load team information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamData()
  }, [courseCode, navigate])

  if (isLoading) {
    return <Loading />
  }

  if (!isTeamUpEnabled) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseNavigation courseCode={courseCode} currentPage="team up" userType="student" />
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Formation Not Started</h3>
            <p className="text-gray-500 mb-6">
              {teamConfig ? (
                <>
                  Team formation will be available from {new Date(teamConfig.startDate).toLocaleDateString()} to {new Date(teamConfig.endDate).toLocaleDateString()}
                </>
              ) : (
                'Team formation feature is not available for this course yet'
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseNavigation courseCode={courseCode} currentPage="team up" userType="student" />
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Yet</h3>
            <p className="text-gray-500 mb-6">You haven't joined or created a team yet</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(`/student/course/${courseCode}/invitations`)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                View Invitations
              </button>
              <button
                onClick={() => navigate(`/student/course/${courseCode}/match`)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Find Teammates
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseNavigation courseCode={courseCode} currentPage="team up" userType="student" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">{team.projectTitle}</p>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {team.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {team.members.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={`https://i.pravatar.cc/150?img=${member.id}`}
                          alt={member.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.studentId}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentCourseTeamUp
