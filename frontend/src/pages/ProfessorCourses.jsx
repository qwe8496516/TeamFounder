import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Loading from '../components/Loading'

const courseImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
]

function NextArrow(props) {
  const { onClick } = props
  return (
    <button
      className="absolute z-30 right-0 top-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-full p-2 shadow-lg hover:bg-gray-700 focus:outline-none hidden md:flex"
      style={{ right: '-48px' }}
      onClick={onClick}
      aria-label="Next"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

function PrevArrow(props) {
  const { onClick } = props
  return (
    <button
      className="absolute z-30 left-0 top-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-full p-2 shadow-lg hover:bg-gray-700 focus:outline-none hidden md:flex"
      style={{ left: '-48px' }}
      onClick={onClick}
      aria-label="Previous"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  )
}

function ProfessorCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const settings = {
    dots: true,
    infinite: courses.length > 3,
    speed: 600,
    slidesToShow: Math.min(3, courses.length),
    slidesToScroll: 1,
    centerMode: courses.length > 1,
    centerPadding: '0px',
    autoplay: courses.length > 3,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: courses.length > 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, courses.length),
          centerMode: courses.length > 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        }
      }
    ]
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const professorId = localStorage.getItem('userId')
        const response = await axios.get(`http://localhost:8080/api/course/professor/${professorId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        const coursesWithImages = response.data.map(course => ({
          ...course,
          image: courseImages[
            Array.from(course.courseCode).reduce((acc, char) => acc + char.charCodeAt(0), 0) % courseImages.length
          ],
          tags: ['Course', 'Education']
        }))
        setCourses(coursesWithImages)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Failed to fetch courses. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleManageClick = (courseCode) => {
    navigate(`/professor/course/${courseCode}`)
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="mt-8 p-8 bg-white rounded-lg shadow-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't created any courses yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-12 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {courses.length === 1 
              ? "You are teaching 1 course."
              : `You are teaching ${courses.length} courses.`}
          </p>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course.courseCode} className="pt-4 px-4 pb-12">
                <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300 hover:scale-105 flex flex-col">
                  <span className="absolute top-4 right-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {course.courseCode}
                  </span>
                  <div className="h-48">
                    <img
                      className="w-full h-full object-cover"
                      src={course.image}
                      alt={course.name}
                    />
                  </div>
                  <div className="px-6 py-4 h-32">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-bold text-xl text-gray-900">{course.name}</h2>
                    </div>
                    <p className="text-gray-700 text-base line-clamp-2">{course.description}</p>
                  </div>
                  <div className="px-6 py-2 h-16">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {course.students} students
                    </div>
                  </div>
                  <div className="px-6 h-12">
                    {course.tags && course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => handleManageClick(course.courseCode)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-bold font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default ProfessorCourses 