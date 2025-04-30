import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import { spaceChildren } from 'antd/es/button'

function Login({ setIsLoggedIn }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { userId, password })

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Login Success',
          text: 'You have successfully logged in',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
          setIsLoading(true)
          navigate(response.data.redirect + '/course')
          localStorage.setItem('id', response.data.id)
          localStorage.setItem('userId', response.data.userId)
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('role', response.data.role)
          setIsLoggedIn(true)
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid credentials',
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
        {/* Left Side - Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
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

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                  <i className="fas fa-sign-in-alt text-gray-600 fa-lg"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                <p className="text-gray-600 mt-2">Please sign in to continue</p>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* ID Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student/Professor ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors"
                      placeholder="Enter your ID"
                      requigray
                    />
                    <i className="fas fa-user absolute right-2 top-4 w-6 h-6 text-gray-400"></i>
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-gray-600 hover:text-gray-700">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onSubmit={handleSubmit}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50 transition-colors"
                >
                  Sign in
                </button>

                {/* Register Link */}
                <p className="mt-6 text-center text-gray-600">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="ml-1 text-gray-600 hover:text-gray-700 font-semibold focus:outline-none"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Login 