import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Course() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const mockCourses = [
          {
            id: 1,
            name: 'Web Development',
            code: 'CS101',
            semester: 'Spring 2024',
            students: 45,
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
            tags: ['Web', 'Frontend', 'JavaScript']
          },
          {
            id: 2,
            name: 'Mobile App Development',
            code: 'CS102',
            semester: 'Spring 2024',
            students: 38,
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            description: 'Build mobile applications for iOS and Android using React Native.',
            tags: ['Mobile', 'React Native', 'iOS', 'Android']
          },
          {
            id: 3,
            name: 'Data Science',
            code: 'CS103',
            semester: 'Spring 2024',
            students: 52,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            description: 'Introduction to data analysis, machine learning, and data visualization.',
            tags: ['Data Science', 'Python', 'Machine Learning']
          }
        ]
        setCourses(mockCourses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your courses and view student progress
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {courses.map((course) => (
            <div key={course.id} className="max-w-sm rounded-xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition duration-300 hover:scale-105">
              <img className="w-full h-48 object-cover" src={course.image} alt={course.name} />
              <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-xl text-gray-900">{course.name}</h2>
                  <span className="text-sm text-gray-500">{course.code}</span>
                </div>
                <p className="text-gray-700 text-base mb-4">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {course.students} students
                </div>
                <div className="px-6 pt-4 pb-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Link
                  to={`/student/course/${course.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-bold font-medium rounded-md shadow-sm text-white bg-gray-600 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Course