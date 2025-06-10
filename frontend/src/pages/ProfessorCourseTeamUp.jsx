import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import { PlusOutlined, TeamOutlined, UserOutlined, LockOutlined, UnlockOutlined, EditOutlined, EyeOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons'
import ActivityModal from '../components/ActivityModal'
import { Table, Tag, message } from 'antd'
import * as XLSX from 'xlsx'
import axios from 'axios'
import Swal from 'sweetalert2'
import CourseNavigation from '../components/CourseNavigation'

const TEAM_FORMATION_TYPES = {
  SELF_SELECTED: 'Self-selected',
  RANDOM: 'Random'
}

const api = {
  async getTeamConfig(courseCode, token) {
    const response = await axios.get(`http://localhost:8080/api/teamConfig/${courseCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  async updateTeamConfig(courseCode, token, data) {
    const response = await axios.put(
      `http://localhost:8080/api/teamConfig/${courseCode}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
}

function ProfessorCourseTeamUp() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  const [teamConfig, setTeamConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(false)

  useEffect(() => {
    const checkTimeRange = () => {
      if (!teamConfig) return false
      const now = new Date()
      const startDate = new Date(teamConfig.startDate)
      const endDate = new Date(teamConfig.endDate)
      return teamConfig.status && now >= startDate && now <= endDate
    }

    setIsWithinTimeRange(checkTimeRange())
  }, [teamConfig])

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
          }).then(() => {
            navigate('/login')
          })
          return
        }

        const configData = await api.getTeamConfig(courseCode, token)
        setTeamConfig(configData)
      } catch (error) {
        console.error('Error fetching data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load course information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseCode, navigate])

  const handleEnableTeamUp = async () => {
    try {
      const result = await Swal.fire({
        title: 'Enable Team Formation',
        text: 'Are you sure you want to enable team formation? Students will be able to start forming teams.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Enable',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280'
      })

      if (!result.isConfirmed) {
        return
      }

      const token = localStorage.getItem('token')
      await axios.post(
        `http://localhost:8080/api/teamConfig/${courseCode}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const updatedConfig = await api.getTeamConfig(courseCode, token)
      setTeamConfig(updatedConfig)
      
      Swal.fire({
        title: 'Success',
        text: 'Team formation has been enabled successfully',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      console.error('Error enabling team up:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to enable team formation',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleEndTeamUp = async () => {
    try {
      const result = await Swal.fire({
        title: 'End Team Formation',
        text: 'Are you sure you want to end team formation? Students will no longer be able to form teams.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'End',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280'
      })

      if (!result.isConfirmed) {
        return
      }

      const token = localStorage.getItem('token')
      await api.updateTeamConfig(courseCode, token, {
        ...teamConfig,
        status: false
      })
      setTeamConfig(prev => ({ ...prev, status: false }))
      
      Swal.fire({
        title: 'Success',
        text: 'Team formation has been ended successfully',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      console.error('Error ending team up:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to end team formation',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleUpdateActivity = async (values) => {
    try {
      const token = localStorage.getItem('token')
      const configData = {
        status: teamConfig.status,
        minSize: values.minTeamSize,
        maxSize: values.maxTeamSize,
        startDate: values.startTime,
        endDate: values.endTime,
        formationType: values.teamFormationType === TEAM_FORMATION_TYPES.RANDOM,
        description: values.description
      }
      
      await api.updateTeamConfig(courseCode, token, configData)
      setTeamConfig(prev => ({
        ...prev,
        ...configData
      }))
      setIsModalVisible(false)
    } catch (error) {
      console.error('Error updating team formation settings:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update team formation settings',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleExportData = () => {
    try {
      const exportData = teamConfig.teams.map(team => {
        const teamData = {
          'Team Name': team.name,
          'Project Title': team.projectTitle,
          'Team Status': team.status === 'Confirmed' ? 'Confirmed' : 'Pending',
        }

        team.members.forEach((member, index) => {
          teamData[`Member ${index + 1} Name`] = member.name
          teamData[`Member ${index + 1} ID`] = member.studentId
          teamData[`Member ${index + 1} Role`] = member.role
        })

        return teamData
      })

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      const colWidths = [
        { wch: 15 },
        { wch: 20 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Team Formation')

      const fileName = `${teamConfig.name}_${new Date().toISOString().split('T')[0]}.xlsx`

      XLSX.writeFile(wb, fileName)
      message.success('Data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      message.error('Export failed, please try again later')
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!teamConfig) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseNavigation courseCode={courseCode} currentPage="team up" userType="professor" />
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Formation is Disabled</h3>
            <p className="text-gray-500 mb-6">Enable team formation to allow students to form teams</p>
            <button
              onClick={handleEnableTeamUp}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Enable Team Formation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseNavigation courseCode={courseCode} currentPage="team up" userType="professor" />

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
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">Team Formation Settings</h3>
                    {teamConfig.status && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Ongoing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">Configure team formation rules and requirements for your course</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      teamConfig.formationType
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {teamConfig.formationType ? TEAM_FORMATION_TYPES.RANDOM : TEAM_FORMATION_TYPES.SELF_SELECTED}
                    </span>
                  </div>
                </div>
                {teamConfig.status ? (
                  <button
                    onClick={handleEndTeamUp}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <LockOutlined className="mr-2" />
                    End Team Formation
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalVisible(true)}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <EditOutlined className="mr-2" />
                    Edit Settings
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 text-gray-600 mb-4">
                    <TeamOutlined className="text-xl" />
                    <span className="font-medium">Team Size</span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">Minimum Size</div>
                          <div className="text-base font-semibold text-gray-900">
                            {teamConfig.minSize || '-'} members
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">Maximum Size</div>
                          <div className="text-base font-semibold text-gray-900">
                            {teamConfig.maxSize || '-'} members
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Members per team</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 text-gray-600 mb-4">
                    <CalendarOutlined className="text-xl" />
                    <span className="font-medium">Duration</span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">Start Date</div>
                          <div className="text-base font-semibold text-gray-900">
                            {teamConfig.startDate || '-'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">End Date</div>
                          <div className="text-base font-semibold text-gray-900">
                            {teamConfig.endDate || '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Activity period</div>
                </div>
              </div>

              {teamConfig.status && (
                <div className="border-t border-gray-100 pt-8">
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Formation Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-600 mb-1">Total Teams</div>
                        <div className="text-2xl font-bold text-blue-700">{teamConfig.teams?.length || 0}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-600 mb-1">Total Members</div>
                        <div className="text-2xl font-bold text-green-700">
                          {teamConfig.teams?.reduce((sum, team) => sum + (team.members?.length || 0), 0) || 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-purple-600 mb-1">Average Team Size</div>
                        <div className="text-2xl font-bold text-purple-700">
                          {teamConfig.teams?.length ? 
                            (teamConfig.teams.reduce((sum, team) => sum + (team.members?.length || 0), 0) / teamConfig.teams.length).toFixed(1) 
                            : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!teamConfig.status && (
                <div className="border-t border-gray-100 pt-8">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 text-center border border-green-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Formation Ready</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Team formation settings are configured. You can now enable the feature for students to start forming their teams.
                    </p>
                    <button
                      onClick={handleEnableTeamUp}
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      Enable Team Formation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <ActivityModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleUpdateActivity}
          initialData={{
            minTeamSize: teamConfig.minSize,
            maxTeamSize: teamConfig.maxSize,
            startTime: teamConfig.startDate,
            endTime: teamConfig.endDate,
            teamFormationType: teamConfig.formationType ? TEAM_FORMATION_TYPES.RANDOM : TEAM_FORMATION_TYPES.SELF_SELECTED,
            description: teamConfig.description
          }}
        />
      </div>
    </div>
  )
}

export default ProfessorCourseTeamUp
