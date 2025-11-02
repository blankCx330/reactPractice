import React from 'react'
import './App.css'

// react中使用下面的方式定义一个组件
// react 组件可以使用函数或类来定义
// react 组件的命名必须以大写字母开头
// return 后面的括号是必须的
function Hello() {
  return (
    <h1 className='hello' >Hello World</h1> 
    //可以使用 className 来添加 CSS 类
  );
}

const Button = () => <button>Click Me</button>


// react 组件可以返回多个元素，需要使用一个父元素包裹
// JSX 比 HTML 更加严格。你必须闭合标签
// 如 <br />。你的组件也不能返回多个 JSX 标签。
// 你必须将它们包裹到一个共享的父级中
// 比如 <div>...</div> 或使用空的 <>...</> 包裹
function Page() {
  return (
  <>
    <h1>这是标题</h1>
    <p>这是段落</p>
  </>
  );
}

// 在 JSX 中可以使用变量
const text = "这是一个文本变量"

function Text() {
  return (
    <div>{text}</div>
  )
}

// App()通常会被挂载到 HTML 页面的根元素（如 <div id="root">）上
// 成为所有其他组件的父级容器。
function App() {
  return (
    <>
      <div>
        <Hello />
        <Button />
        <Page />
        <Text />
      </div>
    </>
  )
}

export default App
