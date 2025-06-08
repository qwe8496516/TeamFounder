import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import { PlusOutlined, TeamOutlined, UserOutlined, LockOutlined, UnlockOutlined, EditOutlined, EyeOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons'
import ActivityModal from '../components/ActivityModal'
import { Table, Tag, message } from 'antd'
import * as XLSX from 'xlsx'
import axios from 'axios'
import Swal from 'sweetalert2'

const TEAM_FORMATION_TYPES = {
  ASSIGNED: 'Assigned',
  SELF_SELECTED: 'Self-selected',
  RANDOM: 'Random'
}

const ACTIVITY_STATUS = {
  ONGOING: 'Ongoing',
  CLOSED: 'Closed'
}

const MOCK_ACTIVITY = {
  id: 1,
  name: 'Final Project Team Formation',
  description: 'Form teams for the final project. Each team should have 3-4 members. The project will focus on developing a web application using modern technologies.',
  status: ACTIVITY_STATUS.ONGOING,
  teamFormationType: TEAM_FORMATION_TYPES.SELF_SELECTED,
  totalTeams: 8,
  totalStudents: 32,
  isLocked: false,
  startTime: '2024-03-20',
  endTime: '2024-03-27',
  minTeamSize: 3,
  maxTeamSize: 4,
  teams: [
    {
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
    },
    {
      id: 2,
      name: 'Team Beta',
      members: [
        { id: 5, name: 'David Lee', studentId: 'D12345682', role: 'Team Leader' },
        { id: 6, name: 'Lisa Chen', studentId: 'D12345683', role: 'Frontend Developer' },
        { id: 7, name: 'James Wilson', studentId: 'D12345684', role: 'Backend Developer' }
      ],
      status: 'Pending',
      projectTitle: 'Online Learning Platform'
    },
    {
      id: 3,
      name: 'Team Gamma',
      members: [
        { id: 8, name: 'Emily Taylor', studentId: 'D12345685', role: 'Team Leader' },
        { id: 9, name: 'Robert Johnson', studentId: 'D12345686', role: 'Frontend Developer' },
        { id: 10, name: 'Jennifer White', studentId: 'D12345687', role: 'Backend Developer' },
        { id: 11, name: 'Thomas Anderson', studentId: 'D12345688', role: 'UI/UX Designer' }
      ],
      status: 'Confirmed',
      projectTitle: 'Social Media Analytics Tool'
    },
    {
      id: 4,
      name: 'Team Delta',
      members: [
        { id: 12, name: 'William Clark', studentId: 'D12345689', role: 'Team Leader' },
        { id: 13, name: 'Mary Martinez', studentId: 'D12345690', role: 'Frontend Developer' },
        { id: 14, name: 'Daniel Garcia', studentId: 'D12345691', role: 'Backend Developer' }
      ],
      status: 'Pending',
      projectTitle: 'E-commerce Platform'
    }
  ]
}

function ProfessorCourseTeamUp() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isTeamUpEnabled, setIsTeamUpEnabled] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
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

        const response = await axios.get(`http://localhost:8080/api/course/${courseCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        setIsTeamUpEnabled(response.data.teamStatus)
        setActivity(MOCK_ACTIVITY)
        setIsConfigured(!!MOCK_ACTIVITY)
      } catch (error) {
        console.error('Error fetching course data:', error)
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

    fetchCourseData()
  }, [courseCode, navigate])

  const handleEnableTeamUp = async () => {
    if (!isConfigured) {
      Swal.fire({
        icon: 'warning',
        title: 'Configuration Required',
        text: 'Please configure team formation settings first',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:8080/api/course/${courseCode}/team-status`,
        { teamStatus: true },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      setIsTeamUpEnabled(true)
      message.success('Team formation feature has been enabled')
    } catch (error) {
      console.error('Error enabling team up:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to enable team formation feature',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleLockActivity = (isLocked) => {
    setActivity(prev => ({ ...prev, isLocked }))
  }

  const handleUpdateActivity = (values) => {
    setActivity(prev => ({
      ...prev,
      ...values
    }))
    setIsConfigured(true)
    setIsModalVisible(false)
  }

  const handleExportData = () => {
    try {
      const exportData = activity.teams.map(team => {
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

      const fileName = `${activity.name}_${new Date().toISOString().split('T')[0]}.xlsx`

      XLSX.writeFile(wb, fileName)
      message.success('Data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      message.error('Export failed, please try again later')
    }
  }

  const columns = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Project Title',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      render: (text) => <span className="text-gray-700">{text}</span>
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <div className="space-y-1">
          {members.map((member) => (
            <div key={member.id} className="text-sm">
              <span className="font-medium">{member.name}</span>
              <span className="text-gray-500 ml-1">({member.studentId})</span>
              <span className="text-blue-600 ml-2 text-xs">{member.role}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Confirmed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {}}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <EyeOutlined />
          </button>
          <button
            onClick={() => {}}
            className="text-gray-600 hover:text-gray-800"
            title="Edit Team"
          >
            <EditOutlined />
          </button>
        </div>
      )
    }
  ]

  if (isLoading) {
    return <Loading />
  }

  if (!isTeamUpEnabled) {
    return (
      <div className="bg-gray-50 flex flex-col items-center py-8">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
            <Link
              to={`/professor/course/${courseCode}`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Course Info</span>
              </div>
            </Link>
            <Link
              to={`/professor/course/${courseCode}/announcement`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Announcements</span>
              </div>
            </Link>
            <Link
              to={`/professor/course/${courseCode}/team`}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-white text-gray-900 shadow-sm"
              aria-current="page"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Team Up</span>
              </div>
            </Link>
          </nav>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Formation Settings</h3>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">Configure team formation rules and requirements for your course</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activity?.teamFormationType === 'Self-selected' 
                        ? 'bg-blue-100 text-blue-800'
                        : activity?.teamFormationType === 'Assigned'
                        ? 'bg-purple-100 text-purple-800'
                        : activity?.teamFormationType === 'Random'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity?.teamFormationType || '-'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalVisible(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <EditOutlined className="mr-2" />
                  Edit Settings
                </button>
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
                            {activity?.minTeamSize || '-'} members
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
                            {activity?.maxTeamSize || '-'} members
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
                            {activity?.startTime || '-'}
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
                            {activity?.endTime || '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Activity period</div>
                </div>
              </div>

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
            </div>
          </div>
        </div>

        <ActivityModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleUpdateActivity}
          initialData={activity}
        />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          <Link
            to={`/professor/course/${courseCode}`}
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Course Info</span>
            </div>
          </Link>
          <Link
            to={`/professor/course/${courseCode}/announcement`}
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Announcements</span>
            </div>
          </Link>
          <Link
            to={`/professor/course/${courseCode}/team`}
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-white text-gray-900 shadow-sm"
            aria-current="page"
          >
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Team Up</span>
            </div>
          </Link>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {!activity ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team formation activity yet</h3>
              <p className="text-gray-500 mb-6">Create a team formation activity to get started</p>
              <button
                onClick={() => setIsModalVisible(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <PlusOutlined className="mr-2" />
                Create Activity
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{activity.name}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        activity.status === ACTIVITY_STATUS.ONGOING 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-600 max-w-3xl">{activity.description}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsModalVisible(true)}
                      className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <EditOutlined className="mr-2" />
                      Edit Activity
                    </button>
                    <button
                      onClick={() => handleLockActivity(!activity.isLocked)}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activity.isLocked
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {activity.isLocked ? (
                        <>
                          <LockOutlined className="mr-2" />
                          Unlock Activity
                        </>
                      ) : (
                        <>
                          <UnlockOutlined className="mr-2" />
                          Lock Activity
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center space-x-3 text-blue-600 mb-4">
                      <TeamOutlined className="text-xl" />
                      <span className="font-medium">Teams</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Total Teams</div>
                            <div className="text-base font-semibold text-gray-900">
                              {activity?.totalTeams || '-'} teams
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Total Students</div>
                            <div className="text-base font-semibold text-gray-900">
                              {activity?.totalStudents || '-'} students
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Team formation overview</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                    <div className="flex items-center space-x-3 text-green-600 mb-4">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
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
                              {activity?.minTeamSize || '-'} members
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
                              {activity?.maxTeamSize || '-'} members
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Members per team</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center space-x-3 text-purple-600 mb-4">
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
                              {activity?.startTime || '-'}
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
                              {activity?.endTime || '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Activity period</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Team Formation Rules</h4>
                      <p className="text-sm text-gray-500 mt-1">Current team formation settings and requirements</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <TableOutlined className="mr-2" />
                      Export Data
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Team Size Requirements</div>
                          <div className="text-sm text-gray-500">Teams must have between {activity.minTeamSize} and {activity.maxTeamSize} members</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Formation Type</div>
                          <div className="text-sm text-gray-500">{activity.teamFormationType}</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Activity Period</div>
                          <div className="text-sm text-gray-500">{activity.startTime} to {activity.endTime}</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h5 className="text-lg font-medium text-gray-900">Current Team Formations</h5>
                      <p className="text-sm text-gray-500 mt-1">View and manage all teams formed for this activity</p>
                    </div>
                    <Table
                      columns={columns}
                      dataSource={activity.teams}
                      rowKey="id"
                      pagination={false}
                      className="team-table"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ActivityModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleUpdateActivity}
        initialData={activity}
      />
    </div>
  )
}

export default ProfessorCourseTeamUp
