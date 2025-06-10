import { Link } from 'react-router-dom'

const CourseNavigation = ({ courseCode, currentPage, userType = 'student' }) => {
  const studentNavItems = [
    {
      path: `/student/course/${courseCode}`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      ),
      label: 'Announcements'
    },
    {
      path: `/student/course/${courseCode}/team`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      label: 'Team Up'
    },
    {
      path: `/student/course/${courseCode}/match`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      ),
      label: 'Match'
    },
    {
      path: `/student/course/${courseCode}/invitations`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
      label: 'Invitations'
    }
  ]

  const professorNavItems = [
    {
      path: `/professor/course/${courseCode}`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      label: 'Course Info'
    },
    {
      path: `/professor/course/${courseCode}/announcement`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      ),
      label: 'Announcements'
    },
    {
      path: `/professor/course/${courseCode}/team`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      label: 'Team Up'
    }
  ]

  const navItems = userType === 'student' ? studentNavItems : professorNavItems

  return (
    <div className="mb-8">
      <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentPage === item.label.toLowerCase()
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
            aria-current={currentPage === item.label.toLowerCase() ? 'page' : undefined}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default CourseNavigation 