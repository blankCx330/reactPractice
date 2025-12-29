import { useState } from "react";

  const date = {
    className: 'date-style',
    style: {
      color: 'blue',
      fontSize: '20px',
      textAlign: 'center',
      marginTop: '50px'
    }
  }

  function Paragraph(porps) {
    return (
      <>
        <h1>{porps.title}</h1>
        <p>{porps.content}</p>
      </>
    )
  }

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

  const listDates = [
    {title: '标题1', content: '内容1'},
    {title: '标题2', content: '内容2'},
    {title: '标题3', content: '内容3'}
  ];
function List(listDates){
  const datas = listDates.listDates;//解构赋值 传入的参数是 {listDates: Array(3)} 需要取出listDates属性
  console.log(datas);
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

function YesRoNo({putStatus}){
  const [status, setStatus] = useState(true); 
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

function App() {
  function putStatus(status){
    console.log(status);
  }
  return (
    <>
      <div
        {...date}
      >
        Hello, World!
      </div>


      <Paragraph title="标题1" content="段落1" />
      <Paragraph1 title="标题1" content="内容1" active />
      <Paragraph1 title="标题2" content="内容2" ah />
      <Paragraph1 title="标题3" content="内容3" />

      <List listDates={listDates} />

      <YesRoNo putStatus={putStatus} />
    </>
  )
}

export default App
