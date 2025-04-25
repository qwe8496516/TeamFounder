import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function MatchList() {
  const [matches, setMatches] = useState([
    { id: 1, title: 'Backend Developer Needed', skills: 'Java, Spring Boot', experience: '2+ years' },
    { id: 2, title: 'Frontend Developer Position', skills: 'React, TypeScript', experience: '1+ year' },
    { id: 3, title: 'Full Stack Developer Role', skills: 'Node.js, React, MongoDB', experience: '3+ years' }
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(4)
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const totalPages = Math.ceil(matches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMatches = matches.slice(startIndex, endIndex)

  const handleMatch = (id) => {
    console.log('Match user ID:', id)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-3rem)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Match List</h1>
          <Link to="/match/new" className="btn btn-primary w-full sm:w-auto">
            Post Match Request
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentMatches.map(match => (
            <div key={match.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">{match.title}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Skills:</span> {match.skills}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Experience:</span> {match.experience}
              </p>
              <button
                onClick={() => handleMatch(match.id)}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
              >
                Match
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default MatchList 