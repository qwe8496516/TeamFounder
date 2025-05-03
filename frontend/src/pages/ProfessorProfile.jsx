import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'

function ProfessorProfile() {
  const [profile, setProfile] = useState({
    userId: '',
    username: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
        
        const response = await axios.get(`http://localhost:8080/api/professor/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const mockProfile = {
          userId: userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        }
        
        setProfile(mockProfile)
      } catch (err) {
        console.log(err)
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
    e.preventDefault();
    const userId = profile.userId;
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Passwords do not match',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }
    if (password.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Password must be at least 6 characters long',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            'http://localhost:8080/api/auth/change-password',
            {
                userId,
                password,
                confirmPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message || 'Password updated successfully',
            confirmButtonColor: '#4f46e5'
        });
        setPassword('');
        setConfirmPassword('');
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data || 'Failed to update password',
            confirmButtonColor: '#4f46e5'
        });
    }
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-800 px-4 py-5 sm:px-6">
            <h3 className="text-2xl font-bold text-white">
              Professor Profile
            </h3>
            <p className="mt-1 text-sm text-indigo-200">
              Manage your personal information
            </p>
          </div>
          
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Professor ID</dt>
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
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                <div className="flex">
                    <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                    Update Password
                    </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Enter new password"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessorProfile 