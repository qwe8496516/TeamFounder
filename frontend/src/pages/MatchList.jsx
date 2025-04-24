import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function MatchList() {
  const [matches, setMatches] = useState([
    { 
      id: 1, 
      name: '張三', 
      skills: ['前端開發', 'UI設計', 'React', 'TypeScript'],
      experience: '3年',
      lookingFor: '後端開發夥伴',
      status: '配對中'
    },
    { 
      id: 2, 
      name: '李四', 
      skills: ['後端開發', '資料庫', 'Node.js', 'MongoDB'],
      experience: '5年',
      lookingFor: '前端開發夥伴',
      status: '配對中'
    },
    { 
      id: 3, 
      name: '王五', 
      skills: ['全端開發', 'DevOps', 'AWS', 'Docker'],
      experience: '4年',
      lookingFor: 'UI設計師',
      status: '配對中'
    },
    { 
      id: 4, 
      name: '陳六', 
      skills: ['UI設計', 'UX設計', 'Figma', 'Adobe XD'],
      experience: '2年',
      lookingFor: '前端開發夥伴',
      status: '已配對',
      matchedWith: '王五'
    },
    { 
      id: 5, 
      name: '趙七', 
      skills: ['後端開發', '雲端架構', 'Python', 'Django'],
      experience: '6年',
      lookingFor: '前端開發夥伴',
      status: '已配對',
      matchedWith: '張三'
    },
    { 
      id: 6, 
      name: '林八', 
      skills: ['行動開發', 'Flutter', 'iOS', 'Android'],
      experience: '3年',
      lookingFor: '後端開發夥伴',
      status: '配對中'
    },
    { 
      id: 7, 
      name: '黃九', 
      skills: ['資料分析', 'Python', 'SQL', '機器學習'],
      experience: '4年',
      lookingFor: '前端開發夥伴',
      status: '配對中'
    },
    { 
      id: 8, 
      name: '吳十', 
      skills: ['產品經理', '專案管理', '敏捷開發'],
      experience: '5年',
      lookingFor: '全端開發夥伴',
      status: '配對中'
    },
    { 
      id: 9, 
      name: '鄭十一', 
      skills: ['測試工程師', '自動化測試', 'Selenium'],
      experience: '2年',
      lookingFor: '開發夥伴',
      status: '配對中'
    },
    { 
      id: 10, 
      name: '周十二', 
      skills: ['區塊鏈', 'Solidity', 'Web3'],
      experience: '3年',
      lookingFor: '全端開發夥伴',
      status: '配對中'
    },
    { 
      id: 11, 
      name: '孫十三', 
      skills: ['資安工程師', '滲透測試', '網路安全'],
      experience: '4年',
      lookingFor: '開發夥伴',
      status: '配對中'
    },
    { 
      id: 12, 
      name: '馬十四', 
      skills: ['DevOps', 'CI/CD', 'Kubernetes'],
      experience: '5年',
      lookingFor: '後端開發夥伴',
      status: '配對中'
    },
    { 
      id: 13, 
      name: '朱十五', 
      skills: ['前端開發', 'Vue', 'Nuxt.js'],
      experience: '3年',
      lookingFor: '後端開發夥伴',
      status: '配對中'
    },
    { 
      id: 14, 
      name: '胡十六', 
      skills: ['後端開發', 'Java', 'Spring Boot'],
      experience: '4年',
      lookingFor: '前端開發夥伴',
      status: '配對中'
    },
    { 
      id: 15, 
      name: '林十七', 
      skills: ['UI設計', '動畫設計', 'After Effects'],
      experience: '2年',
      lookingFor: '前端開發夥伴',
      status: '配對中'
    }
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(4)
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const totalPages = Math.ceil(matches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMatches = matches.slice(startIndex, endIndex)

  const handleMatch = (id) => {
    console.log('配對用戶ID:', id)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-3rem)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">配對列表</h1>
          <Link to="/match/new" className="btn btn-primary w-full sm:w-auto">
            發布配對需求
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-md flex-1">
          <ul className="divide-y divide-gray-200">
            {currentMatches.map((match) => (
              <li key={match.id} className="hover:bg-gray-50">
                <div className="px-3 sm:px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        {match.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        {match.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p className="truncate">經驗：{match.experience}</p>
                        <p className="truncate">尋找：{match.lookingFor}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <div className="sm:hidden">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.status === '配對中' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {match.status}
                        </span>
                      </div>
                      {match.status === '配對中' ? (
                        <button
                          onClick={() => handleMatch(match.id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          配對
                        </button>
                      ) : (
                        <span className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600">
                          已配對
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 hidden sm:block">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      match.status === '配對中' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 分頁 */}
        <div className="mt-6">
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 sm:px-4 py-3 sm:px-6 rounded-md shadow">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  顯示 <span className="font-medium">{startIndex + 1}</span> 到{' '}
                  <span className="font-medium">{Math.min(endIndex, matches.length)}</span> 的{' '}
                  <span className="font-medium">{matches.length}</span> 個結果
                </p>
              </div>
              <div>
                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">上一頁</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-3 sm:px-4 py-2 text-sm font-semibold ${
                        page === currentPage
                          ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">下一頁</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchList 