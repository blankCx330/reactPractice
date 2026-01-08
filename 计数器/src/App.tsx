import { useState, useRef } from 'react'
import './App.css'

/**
 * App组件：一个简单的计数器应用
 * 用户可以通过点击按钮或直接输入数字来改变计数值
 */
function App() {
  
  // 使用useState钩子管理计数状态，初始值为0
  const [count, setCount] = useState(0)
  // 使用useRef创建一个引用，关联到输入框元素
  const countRef = useRef<HTMLInputElement>(null)

  /**
   * 增加计数的函数
   * 将当前计数值加1
   */
  const addFun = () => {
    setCount(count + 1)
  }
  /**
   * 减少计数的函数
   * 将当前计数值减1
   */
  const minusFun = () => {
    setCount(count - 1)
  }

  /**
   * 处理输入框变化的函数
   * @param e React.ChangeEvent<HTMLInputElement> 输入框变化事件
   * 验证输入是否为空或非数字，并更新计数值
   */
  const num = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 检查输入是否为空
    if (e.target.value === '') {
      alert('不能为空')
      return
    }
    // 检查输入是否为有效数字
    if (isNaN(Number(e.target.value))) {
      alert('警告：只能输入数字')
      return
    }
    // 更新计数值
    setCount(Number(e.target.value))
  }
  
  return (
    <> 
      {/* 背景容器 */}
      <div className='background'>
        {/* 计数器容器 */}
        <div className='container'>
          {/* 减少按钮 */}
          <button onClick={minusFun} className='minus-button btn'>-</button>
          {/* 计数值输入框 */}
          <input 
            type='text' 
            className='count-value'
            value={count}
            ref={countRef}
            onChange={e => num(e)}
            placeholder='0' 
          />
          {/* 增加按钮 */}
          <button onClick={addFun} className='plus-button btn'>+</button>
        </div>
      </div>
    </>
  )
}

export default App
