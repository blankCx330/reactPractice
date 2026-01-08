import { useState, useRef } from 'react'
import './App.css'

function App() {
  
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLInputElement>(null)

  const addFun = () => {
    setCount(count + 1)
  }
  const minusFun = () => {
    setCount(count - 1)
  }

  const num = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      alert('不能为空')
      return
    }
    if (isNaN(Number(e.target.value))) {
      alert('警告：只能输入数字')
      return
    }
    setCount(Number(e.target.value))
  }
  
  return (
    <> 
      <div className='background'>
        <div className='container'>
          <button onClick={minusFun} className='minus-button btn'>-</button>
          <input 
            type='text' 
            className='count-value'
            value={count}
            ref={countRef}
            onChange={e => num(e)}
            placeholder='0' 
          />
          <button onClick={addFun} className='plus-button btn'>+</button>
        </div>
      </div>
    </>
  )
}

export default App
