import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MatchCard({ student }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!student) {
    return (
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-24 w-24 mx-auto bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mx-auto mt-4"></div>
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mx-auto mt-2"></div>
        </div>
      </div>
    )
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex justify-end px-4 py-6 relative" ref={dropdownRef}>
        <button
          id="dropdownButton"
          onClick={toggleDropdown}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 transition-colors duration-200"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {/* Dropdown menu */}
        <div
          id="dropdown"
          className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 absolute right-0 top-10 transition-all duration-200 transform ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <Link
                to={`/student/profile/${student.id || ''}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                View Profile
              </Link>
            </li>
            <li>
              <Link
                to={`/student/chat/${student.id || ''}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                Send Invitation
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors duration-200"
              >
                Report
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <div className="relative group">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 group-hover:scale-110"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            // src={student.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
            alt=""
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white transition-colors duration-200">
          {student.name || 'Unnamed'}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {student.major || 'Student'}
        </span>
        
        {/* Skills display */}
        <div className="mt-4 px-4 w-full">
          <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills</h6>
          <div className="flex flex-wrap gap-2">
            {student.skills?.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm"
              >
                {skill}
              </span>
            ))}
            {(!student.skills || student.skills.length === 0) && (
              <span className="text-sm text-gray-500 dark:text-gray-400">No skills</span>
            )}
          </div>
        </div>

        {student.matchScore && (
          <div className="mt-4 px-4 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Match Score</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {student.matchScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-gray-500 to-gray-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${student.matchScore}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex mt-6 space-x-4">
          <Link
            to={`/student/profile/${student.id || ''}`}
            className="inline-flex items-center px-4 py-2 text-sm font-bold text-center text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 transition-all duration-200 transform shadow-md"
          >
            View Profile
          </Link>
          <Link
            to={`/student/chat/${student.id || ''}`}
            className="py-2 px-4 text-sm font-bold text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200 transform shadow-md"
          >
            Send Invitation
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MatchCard 