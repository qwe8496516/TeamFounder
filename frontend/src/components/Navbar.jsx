import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 shadow-lg shadow-gray-900/20' : 'bg-white shadow-2xl'} relative z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 font-['Roboto_Mono']">
                TeamFounder
              </Link>
            </div> */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/teams"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium font-['Roboto_Mono']`}
              >
                Teams
              </Link>
              <Link
                to="/courses"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium font-['Roboto_Mono']`}
              >
                Courses
              </Link>
              <Link
                to="/chat"
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium font-['Roboto_Mono']`}
              >
                Chat
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className={`${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={`${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } ml-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div 
              className="ml-3 relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button
                type="button"
                className={`${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:text-white'
                    : 'bg-white text-gray-900 hover:text-gray-700'
                } flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
              {isUserMenuOpen && (
                <div
                  className={`${
                    isDarkMode ? 'bg-gray-800 shadow-lg shadow-gray-900/20' : 'bg-white'
                  } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link
                    to="/profile"
                    className={`${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    } block px-4 py-2 text-sm font-['Roboto_Mono']`}
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    } block px-4 py-2 text-sm font-['Roboto_Mono']`}
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => navigate('/login')}
                    className={`${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    } block w-full text-left px-4 py-2 text-sm font-['Roboto_Mono']`}
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className={`${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className={`pt-2 pb-3 space-y-1 ${isDarkMode ? 'bg-gray-800 shadow-lg shadow-gray-900/20' : 'bg-white'}`}>
          <Link
            to="/dashboard"
            className={`${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
            } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
          >
            Dashboard
          </Link>
          <Link
            to="/teams"
            className={`${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
            } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
          >
            Teams
          </Link>
          <Link
            to="/courses"
            className={`${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
            } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
          >
            Courses
          </Link>
          <Link
            to="/chat"
            className={`${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
            } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
          >
            Chat
          </Link>
        </div>
        <div className={`pt-4 pb-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800 shadow-lg shadow-gray-900/20' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <div className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} font-['Roboto_Mono']`}>
                Tom Cook
              </div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-['Roboto_Mono']`}>
                tom@example.com
              </div>
            </div>
            <button
              type="button"
              className={`${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } ml-auto flex-shrink-0 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6 bg-white rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to="/profile"
              className={`${
                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className={`${
                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              } block px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
            >
              Settings
            </Link>
            <button
              onClick={() => navigate('/login')}
              className={`${
                isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
              } block w-full text-left px-3 py-2 rounded-md text-base font-medium font-['Roboto_Mono']`}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 