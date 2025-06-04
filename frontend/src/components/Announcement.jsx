const IMPORTANCE_LEVELS = [
  { value: 0, label: 'TRIVIAL', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 1, label: 'MINOR', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 2, label: 'NORMAL', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { value: 3, label: 'MAJOR', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { value: 4, label: 'CRITICAL', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
]

function Announcement({ announcement }) {
  const level = IMPORTANCE_LEVELS.find(l => l.value === announcement.importanceLevel)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${level.bgColor}`}>
            <svg className={`h-6 w-6 ${level.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
        </div>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {announcement.date}
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 leading-relaxed">{announcement.content}</p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-gray-500">
            Posted by: {announcement.author ? announcement.author : 'Professor'}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.bgColor} ${level.textColor}`}>
          {level.label}
        </span>
      </div>
    </div>
  )
}

export default Announcement 