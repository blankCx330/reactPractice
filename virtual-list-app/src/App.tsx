import { useState } from 'react'
import './App.css'
import ArticleList from './compoents/ArticleList'
import PerformanceTest from './pages/PerformanceTest'

function App() {
  const [showTest, setShowTest] = useState(false)

  return (
    <div className="w-full h-screen bg-blue-200 flex flex-col">
      {/* 导航 */}
      <nav className="p-4 bg-gray-100 flex gap-4">
        <button 
          onClick={() => setShowTest(false)}
          className={!showTest ? 'font-bold' : ''}
        >
          项目列表
        </button>
        <button 
          onClick={() => setShowTest(true)}
          className={showTest ? 'font-bold' : ''}
        >
          性能测试
        </button>
      </nav>

      {/* 内容 */}
      {showTest ? <PerformanceTest /> : (
        <div className="flex-1 flex justify-center min-h-0">
          <div className="w-1/3 h-full border-2 flex flex-col">
            <ArticleList />
          </div>
        </div>
      )}
    </div>
  )
}

export default App