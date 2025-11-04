import React, { useState } from 'react'
import './App.css'

// 使用 JSX 编写标签 

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

// 添加样式 
// 使用className属性来添加 CSS 类
function ClassTest() {
  return (
    <>
      <h1 className="red">红色样式的标题</h1>
    </>
  )
}

// 显示数据
// JSX中使用{}来嵌入变量和表达式
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

// 条件渲染
// React 没有特殊的语法来编写条件语句
// 因此你使用的就是普通的 JavaScript 代码。
// react 组件返回的是一个 react对象，因此可以赋值给一个变量
const state = false;
let content;
function IsTrue() {
  return (
    <div>这是真</div>
  )
}
function IsFalse() {
  return (
    <div>这是假</div>
  )
}
function WhatState() {
  if (state){
    content = <IsTrue />
  }else{
    content = <IsFalse />
  }
  return (
    <>
      {content}
    </>
  )
}

// 如果你喜欢更为紧凑的代码，可以使用 条件 ? 运算符
// 与 if 不同的是，它工作于 JSX 内部：
function ConditionalRender() {
  return (
    <>
      {state ? <p>状态为真</p> : <p>状态为假</p>}
    </>
  )
}

// 当你不需要 else 分支时，你也可以使用更简短的 逻辑 && 语法：
function NoElse() {
  return (
    <>
      {true && <p>状态为真</p>}
    </>
  )
}

// 渲染列表
// 一般使用 map() 函数将这个数组转换为标签构成的列表
// 列表中的元素一定要有key值
const datas = [
  { title: '啊哈', id: 1 },
  { title: '阿基维利', id: 2 },
  { title: '开拓者', id: 3 },
];

const listItems = datas.map(data =>
  (<li key={data.id}>
      {data.title}
    </li>)
)

function ListRender() {
  return (
    <ul>
      {listItems}
    </ul>
  ) 
}
// 对于列表中的每一个元素，你都应该传递一个字符串或者数字给 key
// 用于在其兄弟节点中唯一标识该元素。
// 通常 key 来自你的数据，比如数据库中的 ID。
// 如果你在后续插入、删除或重新排序这些项目
// React 将依靠你提供的 key 来思考发生了什么。


// 响应事件
// 注意这里只需要 把函数传递给事件 即可
const alertFun = () => alert('点击了！')
function ButtonAlert() {
  return(
    <button onClick={alertFun}>点击跳提示</button>
  )
}

// 更新界面
// 注意，useState()要在组件中声明
// 修改数值需要调用解构的第二个函数
// 如果渲染多次同一组件，每个组件是独立的
// 每个组件都会拥有自己的state
// 下面的例子中的具体表现为两个按钮的数字是独立的
function NumClick() {
const [num, setNum] = useState(0);
  return (
    <button onClick={() => setNum(num=> num + 1)}>num:{num}</button>
  )
}
// 使用 Hook 
// 以 use 开头的函数被称为 Hook。
// useState 是 React 提供的一个内置 Hook。
// 你可以在 React API 参考 中找到其他内置的 Hook。
// 你也可以通过组合现有的 Hook 来编写属于你自己的 Hook。
// Hook 比普通函数更为严格。
// 你只能在你的组件（或其他 Hook）的 顶层 调用 Hook。
// 如果你想在一个条件或循环中使用 useState，请提取一个新的组件并在组件内部使用它。

// 组件间共享数据 
// 为了使得 MyButton 组件显示相同的 count 并一起更新，
// 需要将各个按钮的 state “向上” 移动到最接近包含所有按钮的组件之中。
// 这里是将 MyButton 移动到了 SIOMButton 中
// 在 React 中
// ​父组件传递的 prop 名称必须与子组件接收时的变量名完全一致​（包括大小写）
// 否则子组件将无法正确获取值。
function SIOMButton(){
  const [num, setNum] = useState(0);
  const addNum = () => setNum(num + 1)

  return(
    <div>
      <h1>同步更新计数器</h1>
      <MyButton count={num} clickfn={addNum} />
      <MyButton count={num} clickfn={addNum} />
    </div>
  )
}
function MyButton({count,clickfn}){
  return (
    <button onClick={clickfn}>num:{count}</button>
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
        <ClassTest />
        <WhatState />
        <ConditionalRender />
        <NoElse />
        <ListRender />
        <ButtonAlert />
        <Text />
        <NumClick />
        <NumClick />
        <SIOMButton />
      </div>
    </>
  )
}

export default App
