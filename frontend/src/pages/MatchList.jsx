import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import MatchCard from '../components/MatchCard'
import Pagination from '../components/Pagination'

function MatchList() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [currentStudents, setCurrentStudents] = useState([])
  const topRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const id = localStorage.getItem('id')
        const userId = localStorage.getItem('userId')
        const token = localStorage.getItem('token')

        if (!userId || !token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login first',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            navigate('/login')
          })
          return
        }
        
        const courseCode = 'CS205'
        const response = await axios.get(`http://localhost:8080/api/course/${courseCode}/student/${id}/match`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const formattedStudents = response.data.map(student => ({
          id: student.id,
          name: student.username,
          userId: student.userId,
          email: student.email,
          skills: student.skills.map(skill => skill.name),
          matchScore: student.Fitness,
          avatar: '/images/default-avatar.png'
        }))
        
        setStudents(formattedStudents)
      } catch (err) {
        console.error('Error fetching match data:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load match information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentStudents(students.slice(indexOfFirstItem, indexOfLastItem))
  }, [currentPage, students, itemsPerPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalPages = Math.ceil(students.length / itemsPerPage)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white py-4 px-4 sm:px-6 lg:px-8">
      <div ref={topRef} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 my-8">Match</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your vision and skills.
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