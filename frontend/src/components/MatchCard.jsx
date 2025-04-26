import { Link } from 'react-router-dom'

function MatchCard({ match, onMatch }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{match.title}</h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-indigo-600">Skills Required</span>
            <p className="mt-1 text-sm text-gray-900 line-clamp-2">{match.skills}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-indigo-600">Experience</span>
            <p className="mt-1 text-sm text-gray-900">{match.experience}</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => onMatch(match.id)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Send Invitation
        </button>
      </div>
    </div>
  )
}

export default MatchCard 