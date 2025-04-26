import React from 'react'

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 bg-white"></div>
    </div>
  )
}

export default Loading 