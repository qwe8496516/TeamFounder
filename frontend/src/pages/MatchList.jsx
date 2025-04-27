import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import Pagination from '../components/Pagination'

function MatchList({ setIsLoading }) {
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'John Doe',
      major: 'Computer Science',
      skills: ['Java', 'Spring Boot', 'REST APIs'],
      interests: ['Web Development', 'Backend Development'],
      matchScore: 85,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: 2, 
      name: 'Jane Smith',
      major: 'Software Engineering',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      interests: ['Frontend Development', 'UI/UX'],
      matchScore: 92,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: 3, 
      name: 'Mike Johnson',
      major: 'Information Technology',
      skills: ['Node.js', 'React', 'MongoDB', 'Express'],
      interests: ['Full Stack Development', 'DevOps'],
      matchScore: 78,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: 4, 
      name: 'Sarah Williams',
      major: 'Computer Engineering',
      skills: ['Figma', 'Adobe XD', 'User Research'],
      interests: ['UI/UX Design', 'Product Design'],
      matchScore: 88,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: 5, 
      name: 'David Brown',
      major: 'Computer Science',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      interests: ['DevOps', 'Cloud Computing'],
      matchScore: 95,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: 6, 
      name: 'Emily Davis',
      major: 'Software Engineering',
      skills: ['React Native', 'Swift', 'Kotlin'],
      interests: ['Mobile Development', 'Cross-platform Apps'],
      matchScore: 82,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [currentStudents, setCurrentStudents] = useState([])
  const topRef = useRef(null)

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentStudents(students.slice(indexOfFirstItem, indexOfLastItem))
  }, [currentPage, students, itemsPerPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Smooth scroll to top
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalPages = Math.ceil(students.length / itemsPerPage)

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white py-4 px-4 sm:px-6 lg:px-8">
      <div ref={topRef} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 my-8">Find Your Perfect Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and connect with talented professionals who share your vision and skills.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentStudents.map(student => (
            <MatchCard 
              key={student.id} 
              student={student}
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