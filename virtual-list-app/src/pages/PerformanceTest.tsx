import { useState } from 'react'
import { FixedSizeList } from '../compoents/VirtualList/FixedSizeList'

// 生成 10000 条测试数据
const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `仓库 ${i + 1}`,
    stars: Math.floor(Math.random() * 10000),
  }))

export default function PerformanceTest() {
  const [data] = useState(() => generateData(10000))
  const [mode, setMode] = useState<'normal' | 'virtual'>('virtual')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">性能测试 - 10,000 条数据</h1>

      {/* 切换按钮 */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('normal')}
          className={`px-4 py-2 rounded ${
            mode === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          普通渲染
        </button>
        <button
          onClick={() => setMode('virtual')}
          className={`px-4 py-2 rounded ${
            mode === 'virtual' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          虚拟列表
        </button>
      </div>

      {/* 列表容器 */}
      <div className="border rounded-lg overflow-hidden">
        {mode === 'normal' ? (
          // 普通渲染
          <div style={{ height: 500, overflow: 'auto' }}>
            {data.map((item) => (
              <div
                key={item.id}
                className="h-12 border-b flex items-center px-4"
              >
                {item.name} - ⭐ {item.stars}
              </div>
            ))}
          </div>
        ) : (
          // 虚拟列表
          <FixedSizeList height={500} itemCount={data.length} itemHeight={48}>
            {({ index, style }) => (
              <div
                style={style}
                className="border-b flex items-center px-4"
              >
                {data[index].name} - ⭐ {data[index].stars}
              </div>
            )}
          </FixedSizeList>
        )}
      </div>

      {/* 说明 */}
      <div className="mt-4 text-gray-600 text-sm">
        <p>• 普通渲染：DOM 节点 = 10,000，滚动卡顿</p>
        <p>• 虚拟列表：DOM 节点 ≈ 10，滚动流畅</p>
        <p>• 打开 DevTools → Elements 查看节点数量</p>
      </div>
    </div>
  )
}