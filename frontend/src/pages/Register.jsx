import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'

function Register() {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailSuggestions, setEmailSuggestions] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      const baseEmail = value.split('@')[0]
      if (baseEmail) {
        setEmailSuggestions([`${baseEmail}@ntut.org.tw`])
      } else {
        setEmailSuggestions([])
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      email: suggestion
    }))
    setEmailSuggestions([])
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name) return 'Name is required'
    if (!formData.email) return 'Email is required'
    if (!formData.password) return 'Password is required'
    if (!formData.confirmPassword) return 'Confirm Password is required'
    if (!formData.email.endsWith('@ntut.org.tw')) return 'Email must be end with @ntut.org.tw'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errors,
        confirmButtonColor: '#4f46e5'
      })
      return
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        userId: formData.studentId,
        username: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Welcome to TeamFounder!',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
		  setIsLoading(true)
          navigate('/login')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'An error occurred during registration',
        })
      }
    } catch (err) {
      console.error('Registration error:', err)
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || 'An error occurred during registration',
        confirmButtonColor: '#4f46e5'
      })
    } finally {
      setIsLoading(false)
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      <div className="min-h-screen flex">
        {/* Left Side - Register Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <i className="fas fa-user-plus text-gray-600 fa-lg"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-600 mt-2">Join us and start your journey</p>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* Name and ID Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* ID Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student/Professor ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                        placeholder="Enter your ID"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                    {emailSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {emailSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 text-black cursor-pointer"
                            onClick={() => handleEmailSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                      <i
                        onClick={() => setShowPassword(!showPassword)}
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 hover:text-gray-500 cursor-pointer flex items-center justify-center`}
                      ></i>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                        placeholder="Confirm your password"
                        required
                      />
                      <i
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 hover:text-gray-500 cursor-pointer flex items-center justify-center`}
                      ></i>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50 transition-colors"
                >
                  Create Account
                </button>

                {/* Login Link */}
                <p className="mt-6 text-center text-gray-600">
                  Already have an account?
                  <Link
                    to="/login"
                    className="ml-1 text-gray-600 hover:text-gray-700 font-semibold focus:outline-none"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.form>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')" }}
        >
          <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-12">
              <h2 className="text-4xl font-bold mb-6">TeamFounder</h2>
              <p className="text-xl">Find your perfect team members and start your journey together</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Register 