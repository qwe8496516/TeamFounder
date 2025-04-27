import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'

function StudentProfile() {
  const [profile, setProfile] = useState({
    userId: '',
    username: '',
    email: '',
    skills: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [skillType, setSkillType] = useState('technical') // 預設為技術技能
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
        
        const response = await axios.get(`http://localhost:8080/api/student/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        setProfile(response.data)
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password must be at least 6 characters long',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8080/api/students/${profile.userId}/password`, 
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password updated successfully',
        confirmButtonColor: '#4f46e5'
      })

      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Error updating password:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update password',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    
    if (!newSkill.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a skill',
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:8080/api/students/${profile.userId}/skills`,
        { skill: newSkill, type: skillType },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, response.data]
      }))

      setNewSkill('')
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Skill added successfully',
        confirmButtonColor: '#4f46e5'
      })
    } catch (err) {
      console.error('Error adding skill:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add skill',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  const handleRemoveSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `http://localhost:8080/api/students/${profile.userId}/skills/${skillId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProfile(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill._id !== skillId)
      }))

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Skill removed successfully',
        confirmButtonColor: '#4f46e5'
      })
    } catch (err) {
      console.error('Error removing skill:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove skill',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-800 px-4 py-5 sm:px-6">
            <h3 className="text-2xl font-bold text-white">
              Student Profile
            </h3>
            <p className="mt-1 text-sm text-indigo-200">
              Manage your personal information and skills
            </p>
          </div>
          
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.userId}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.username}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.email}</dd>
              </div>
            </dl>
          </div>

          {/* Password Section */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Skills Section */}
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Skills</h4>
            
            <form onSubmit={handleAddSkill} className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter new skill"
                  />
                </div>
                
                <div className="w-40">
                  <select
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skills</option>
                    <option value="language">Language</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Add Skill
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <div key={skill._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                        {skill.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No skills added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile 