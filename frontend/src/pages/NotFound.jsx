import { Link } from 'react-router-dom'

function NotFound({ setIsLoggedIn }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pb-20">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <p className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</p>
        <p className="mt-2 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            onClick={() => {
              localStorage.clear()
              setIsLoggedIn(false)
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-bold font-medium rounded-md shadow-sm text-white hover:text-gray-100 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-bold font-medium rounded-md shadow-sm text-white hover:text-gray-100 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Go to login page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound 