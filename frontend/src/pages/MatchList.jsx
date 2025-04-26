import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import Pagination from '../components/Pagination'

function MatchList({ setIsLoading }) {
  const [matches, setMatches] = useState([
    { id: 1, title: 'Backend Developer Needed', skills: 'Java, Spring Boot, REST APIs', experience: '2+ years' },
    { id: 2, title: 'Frontend Developer Position', skills: 'React, TypeScript, Tailwind CSS', experience: '3+ years' },
    { id: 3, title: 'Full Stack Developer Role', skills: 'Node.js, React, MongoDB, Express', experience: '4+ years' },
    { id: 4, title: 'UI/UX Designer Wanted', skills: 'Figma, Adobe XD, User Research', experience: '2+ years' },
    { id: 5, title: 'DevOps Engineer Position', skills: 'AWS, Docker, Kubernetes, CI/CD', experience: '3+ years' },
    { id: 6, title: 'Mobile App Developer', skills: 'React Native, Swift, Kotlin', experience: '2+ years' },
    { id: 7, title: 'Mobile App Developer', skills: 'React Native, Swift, Kotlin', experience: '2+ years' },
    { id: 8, title: 'Mobile App Developer', skills: 'React Native, Swift, Kotlin', experience: '2+ years' },
    { id: 9, title: 'Mobile App Developer', skills: 'React Native, Swift, Kotlin', experience: '2+ years' },
    { id: 10, title: 'Mobile App Developer', skills: 'React Native, Swift, Kotlin', experience: '2+ years' },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [currentMatches, setCurrentMatches] = useState([])

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentMatches(matches.slice(indexOfFirstItem, indexOfLastItem))
  }, [currentPage, matches, itemsPerPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleMatch = (matchId) => {
    console.log('Matching with:', matchId)
  }

  const totalPages = Math.ceil(matches.length / itemsPerPage)

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and connect with talented professionals who share your vision and skills.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMatches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match}
              onMatch={handleMatch}
            />
          ))}
        </div>

        <div className="mt-12">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default MatchList 