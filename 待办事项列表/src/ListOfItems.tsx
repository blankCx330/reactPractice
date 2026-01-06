export default  function ListOfItems({text, deleteItem, completedBtn, completed}: {text: string, deleteItem?: any, completedBtn?: any, completed?: boolean}) {
  
  return (
    <>
    <div className="items-and-button-container">
      <span 
        className="items"
        style={{textDecoration: completed ? 'line-through' : 'none'}}
      >
        {text}
      </span>
      <div className="complete-and-delete">
       <button 
          onClick={completedBtn}
          className="completed-btn"
        >
          完成
        </button>
       <button onClick={deleteItem} className="delete-btn">X</button>
      </div>
    </div>
    </>
  )
}