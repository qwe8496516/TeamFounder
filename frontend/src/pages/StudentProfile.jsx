import { useState } from 'react'
import { Link } from 'react-router-dom'

function StudentProfile() {
  const [formData, setFormData] = useState({
    about: '',
    country: 'United States',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    comments: true,
    candidates: false,
    offers: false,
    pushNotifications: 'everything'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add API call to update profile
    console.log('Form submitted:', formData)
  }

  return (
    // <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-3xl mx-auto">
    //     <nav className="flex mb-8" aria-label="Breadcrumb">
    //       <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
    //         <li className="inline-flex items-center">
    //           <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
    //             <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    //               <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
    //             </svg>
    //             Home
    //           </Link>
    //         </li>
    //         <li>
    //           <div className="flex items-center">
    //             <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
    //               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
    //             </svg>
    //             <Link to="/student" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">Student</Link>
    //           </div>
    //         </li>
    //         <li aria-current="page">
    //           <div className="flex items-center">
    //             <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
    //               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
    //             </svg>
    //             <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Profile</span>
    //           </div>
    //         </li>
    //       </ol>
    //     </nav>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your profile and notification settings</p>
          </div>
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      value={formData.about}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Write something about yourself..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      type="text"
                      name="streetAddress"
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">State / Province</label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      checked={formData.comments}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comments" className="ml-3 block text-sm font-medium text-gray-700">
                      Comments
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      checked={formData.candidates}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="candidates" className="ml-3 block text-sm font-medium text-gray-700">
                      Candidates
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      checked={formData.offers}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="offers" className="ml-3 block text-sm font-medium text-gray-700">
                      Job Offers
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="push-everything"
                        name="pushNotifications"
                        type="radio"
                        value="everything"
                        checked={formData.pushNotifications === 'everything'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                        Everything
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="push-email"
                        name="pushNotifications"
                        type="radio"
                        value="email"
                        checked={formData.pushNotifications === 'email'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                        Same as email
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="push-nothing"
                        name="pushNotifications"
                        type="radio"
                        value="nothing"
                        checked={formData.pushNotifications === 'nothing'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                        No push notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
    //   </div>
    // </div>
  )
}

export default StudentProfile 