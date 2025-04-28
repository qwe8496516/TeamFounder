function Announcement({ announcement }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
        <span className="text-sm text-gray-500">{announcement.date}</span>
      </div>
      <p className="text-gray-600 mb-4">{announcement.content}</p>
      <p className="text-sm text-gray-500">Posted by: {announcement.author}</p>
    </div>
  )
}

export default Announcement 