import React, { useState } from 'react'
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

// 上面组件使用的语法被称为JSX
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
const pObj = {
  title: "这是一个属性变量标题",
  content: "这是一个属性变量内容"
}
const addNum = (a, b) => a + b;
const arr = [1, 2, 3, 4, 5];
const style = {
  backgroundColor: '#000',
  width: '100px',
  height: '100px',
}

// 在 JSX 中可以使用表达式
// JSX 中使用 {}时
// 相当于告诉 React：“这里需要解析一段 JavaScript 表达式”
function Text() {
  return (
    <>
      <div>{text}</div>
      <h2>{pObj.title}</h2>
      <p>{pObj.content}</p>
      <div>{'这是拼接字符'+text}</div>
      <div>1 + 2 = {addNum(1,2)}</div>
      <div>{arr.map((num, index) => (<p key={index} >{num}</p>))}</div>
      
      {/* style={ } 中必须要是一个对象 */}
      {/* React 的内联样式系统基于 ​JavaScript 对象​ 实现
          而不是传统的 CSS 字符串。 */}
      <div style={style}></div>
      <p></p>
      <div style={{
          backgroundColor: '#000',
          width: '100px',
          height: '100px',
        }}></div>
    </>
  )
}


// 更新界面

// 注意，useState()要在组件中声明
// 修改数值需要调用解构的第二个函数
function NumClick() {
const [num, setNum] = useState(0);
  return (
    <button onClick={() => setNum(num=> num + 1)}>num:{num}</button>
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
        <NumClick />
      </div>
    </>
  )
}

export default App
