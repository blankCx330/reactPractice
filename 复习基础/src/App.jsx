// 导入 React 相关的 Hooks 和组件
import { Children, createContext, useContext, useState } from "react";
import React from "react";
// 导入自定义组件 Section 和 Heading
import Section from "./Section";
import Heading from "./Heading";

// 定义日期样式配置对象
// 包含类名和内联样式
const date = {
  className: 'date-style',
  style: {
    color: 'blue',
    fontSize: '20px',
    textAlign: 'center',
    marginTop: '50px'
  }
}

/**
 * 段落组件
 * @param {Object} porps - 组件属性
 * @param {string} porps.title - 标题文本
 * @param {string} porps.content - 段落内容
 */
function Paragraph(porps) {
  return (
    <>
      <h1>{porps.title}</h1>
      <p>{porps.content}</p>
    </>
  )
}

/**
 * 增强版段落组件
 * @param {Object} props - 组件属性
 * @param {string} [props.title='默认标题'] - 标题文本，默认值为'默认标题'
 * @param {string} props.content - 段落内容
 * @param {boolean} props.active - 激活状态
 * @param {boolean} props.ah - 另一种状态
 */
function Paragraph1({title = '默认标题', content, active, ah}) {
  return (
    <>
      <h1>{title}</h1>
      <p>{content}</p>
      <div>active状态: {active ? '1' : '0'}</div>
      <div>ah状态: {ah ? '1' : '0'}</div>
    </>
  )
}

// 定义列表数据源
const listDates = [
  {title: '标题1', content: '内容1'},
  {title: '标题2', content: '内容2'},
  {title: '标题3', content: '内容3'}
];

/**
 * 列表组件
 * @param {Object} listDates - 包含列表数据的对象
 * @param {Array} listDates.listDates - 实际的列表数据数组
 */
function List(listDates){
  // 从传入参数中解构出 listDates 数组
  const datas = listDates.listDates;
  console.log(datas);
  
  // 将数据映射为列表项
  const listP = datas.map((date,index)=>{
    return(
      <li key={index}>
        <h2>{date.title}</h2>
        <p>{date.content}</p>
      </li>
    )
  })
  
  return (
    <>
      <ul>
        {listP}
      </ul>
    </>
  )
}

/**
 * 状态切换组件
 * @param {Object} props - 组件属性
 * @param {Function} props.putStatus - 状态回调函数
 */
function YesRoNo({putStatus}){
  // 使用 useState Hook 管理组件状态
  const [status, setStatus] = useState(true); 
  
  // 处理点击事件，切换状态并调用回调
  function handleClick(){
    setStatus(!status);
    putStatus(status);
  }
  
  return (
    <>
      <button onClick={handleClick}>{status ? '芜湖' : '起飞' }</button>
    </>
  )
}

// 创建两个 Context
const ThemeContext = React.createContext(1)
const LevelContext = createContext(2);

/**
 * Context 演示组件
 * 展示如何使用 Context API
 */
function DivContext(){
  // 使用不同的方式消费 Context
  const useNum = React.useContext(ThemeContext);
  const level = useContext(LevelContext);
  
  return(
    <>
      <ThemeContext.Provider value={useNum}>
        <div>
          层级: {useNum}
        </div> 
      </ThemeContext.Provider>
      <div>
         等级: {level}
      </div>
    </>
  )
}

/**
 * 主应用组件
 * 包含所有子组件的展示和交互逻辑
 */
function App() {
  // 状态回调函数
  function putStatus(status){
    console.log(status);
  }
  
  return (
    <>
      {/* 展示样式应用 */}
      <div
        {...date}
      >
        Hello, World!
      </div>

      {/* 展示段落组件 */}
      <Paragraph title="标题1" content="段落1" />
      <Paragraph1 title="标题1" content="内容1" active />
      <Paragraph1 title="标题2" content="内容2" ah />
      <Paragraph1 title="标题3" content="内容3" />

      {/* 展示列表组件 */}
      <List listDates={listDates} />

      {/* 展示状态切换组件 */}
      <YesRoNo putStatus={putStatus} />

      {/* 展示 Context 嵌套 */}
      <DivContext>
        <DivContext>
        
       </DivContext>
      </DivContext>

      {/* 展示嵌套的 Section 和 Heading 组件 */}
      <Section>
        <Heading level={1}>一级标题</Heading>
        <Section>
          <Heading level={2}>二级标题</Heading>
          <Section>
            <Heading level={3}>三级标题</Heading>
          </Section>
        </Section>
      </Section>
    </>
  )
}

export default App
