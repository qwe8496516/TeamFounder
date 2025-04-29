const IMPORTANCE_LEVELS = [
  { value: 0, label: 'TRIVIAL', color: 'gray' },
  { value: 1, label: 'MINOR', color: 'blue' },
  { value: 2, label: 'NORMAL', color: 'yellow' },
  { value: 3, label: 'MAJOR', color: 'orange' },
  { value: 4, label: 'CRITICAL', color: 'red' }
]

function Announcement({ announcement }) {
  const level = IMPORTANCE_LEVELS.find(l => l.value === announcement.importanceLevel)
  const colorClass = level
    ? `text-${level.color}-600`
    : 'text-gray-500'

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
        <span className="text-sm text-gray-500">{announcement.date}</span>
      </div>
      <p className="text-gray-600 mb-4">{announcement.content}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Posted by: {announcement.author}</p>
        <p className={`text-xs font-sm mt-2 ${colorClass}`}>
          Importance Level: {level?.label}
        </p>
      </div>
    </div>
  )
}

export default Announcement 