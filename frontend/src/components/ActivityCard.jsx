import { motion } from 'framer-motion'
import { EditOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

const ACTIVITY_STATUS = {
  ONGOING: 'Ongoing',
  CLOSED: 'Closed'
}

function ActivityCard({ activity, onEdit, onView, onLock, courseCode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 group"
    >
      <div className={`h-2 ${activity.status === ACTIVITY_STATUS.ONGOING ? 'bg-green-500' : 'bg-gray-400'}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors duration-200">
              {activity.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.status === ACTIVITY_STATUS.ONGOING
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {activity.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.isLocked
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {activity.isLocked ? 'Locked' : 'Editable'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Tooltip title="Edit Activity">
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="View Details">
              <button
                onClick={onView}
                className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <EyeOutlined />
              </button>
            </Tooltip>
            <Tooltip title={activity.isLocked ? "Unlock Team Formation" : "Lock Team Formation"}>
              <button
                onClick={onLock}
                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                  activity.isLocked
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {activity.isLocked ? <LockOutlined /> : <UnlockOutlined />}
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">{activity.teamFormationType}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-50 transition-colors duration-200">
              <div className="text-sm text-gray-500 mb-1">Teams</div>
              <div className="h-8 flex items-center text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                {activity.totalTeams}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-50 transition-colors duration-200">
              <div className="text-sm text-gray-500 mb-1">Students</div>
              <div className="h-8 flex items-center text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                {activity.totalStudents}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityCard 