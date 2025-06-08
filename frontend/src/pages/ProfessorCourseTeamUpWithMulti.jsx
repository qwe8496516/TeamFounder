import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import { PlusOutlined, TeamOutlined, UserOutlined, LockOutlined, UnlockOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import ActivityModal from '../components/ActivityModal'

const TEAM_FORMATION_TYPES = {
  ASSIGNED: 'Assigned',
  SELF_SELECTED: 'Self-selected',
  RANDOM: 'Random'
}

const ACTIVITY_STATUS = {
  ONGOING: 'Ongoing',
  CLOSED: 'Closed'
}

const MOCK_ACTIVITIES = [
  {
    id: 1,
    name: 'Final Project Team Formation',
    status: ACTIVITY_STATUS.ONGOING,
    teamFormationType: TEAM_FORMATION_TYPES.SELF_SELECTED,
    totalTeams: 8,
    totalStudents: 32,
    isLocked: false
  },
  {
    id: 2,
    name: 'Midterm Group Assignment',
    status: ACTIVITY_STATUS.CLOSED,
    teamFormationType: TEAM_FORMATION_TYPES.RANDOM,
    totalTeams: 6,
    totalStudents: 24,
    isLocked: true
  },
  {
    id: 3,
    name: 'Research Paper Teams',
    status: ACTIVITY_STATUS.ONGOING,
    teamFormationType: TEAM_FORMATION_TYPES.ASSIGNED,
    totalTeams: 5,
    totalStudents: 20,
    isLocked: false
  },
]

function ProfessorCourseTeamUp() {
  const { courseCode } = useParams()
  const navigate = useNavigate()
  
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    setActivities(MOCK_ACTIVITIES)
    setIsLoading(false)
  }, [])

  const handleLockActivity = (activityId, isLocked) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, isLocked } 
        : activity
    ))
  }

  const handleCreateActivity = (values) => {
    const newActivity = {
      id: activities.length + 1,
      name: values.name,
      status: ACTIVITY_STATUS.ONGOING,
      teamFormationType: values.teamFormationType,
      totalTeams: 0,
      totalStudents: 0,
      isLocked: false,
      startTime: values.startTime,
      endTime: values.endTime,
      minTeamSize: values.minTeamSize,
      maxTeamSize: values.maxTeamSize,
      description: values.description
    }
    setActivities([...activities, newActivity])
    setIsModalVisible(false)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center pt-8">
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
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-gray-800">Team Formation Activities</div>
            <button
              onClick={() => setIsModalVisible(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            >
              <PlusOutlined className="mr-2" />
              New Activity
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-500 mb-6">Create your first team formation activity to get started</p>
              <button
                onClick={() => navigate(`/professor/course/${courseCode}/team/new`)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <PlusOutlined className="mr-2" />
                Create Activity
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === ACTIVITY_STATUS.ONGOING 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.teamFormationType}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/professor/course/${courseCode}/team/${activity.id}/edit`)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => navigate(`/professor/course/${courseCode}/team/${activity.id}`)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          onClick={() => handleLockActivity(activity.id, !activity.isLocked)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          {activity.isLocked ? <LockOutlined /> : <UnlockOutlined />}
                        </button>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <TeamOutlined />
                        <span>{activity.totalTeams} Teams</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <UserOutlined />
                        <span>{activity.totalStudents} Students</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <ActivityModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateActivity}
      />
    </div>
  )
}

export default ProfessorCourseTeamUp
