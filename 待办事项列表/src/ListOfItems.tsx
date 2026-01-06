export default  function ListOfItems({text}: {text: string}) {
  return (
    <>
    <div className="items-and-button-container">
      <span className="items">{text}</span>
      <div className="complete-and-delete">
       <button className="completed-btn">完成</button>
       <button className="delete-btn">X</button>
      </div>
    </div>
    </>
  )
}