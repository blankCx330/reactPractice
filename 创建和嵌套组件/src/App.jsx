import React from 'react'
import './App.css'

function Hello() {
  return (
    <h1 className='hello' >Hello World</h1>
  );
}

const Button = () => <button>Click Me</button>

// App()通常会被挂载到 HTML 页面的根元素（如 <div id="root">）上
// 成为所有其他组件的父级容器。
function App() {
  return (
    <>
      <div>
        <Hello />
        <Button />
      </div>
    </>
  )
}

export default App
