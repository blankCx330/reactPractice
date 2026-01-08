import { useRef} from "react";
export default function EventInputBox({addItem}: any ) {
  const inputRef = useRef<HTMLInputElement>(null);
  function getItemInformation(){
    if(inputRef.current!.value === ''){ 
      alert('请输入待办事项');
      return;
    }
    addItem({
              inputValue: inputRef.current!.value,
              id: new Date().getTime(), 
              completed: false
            });
    inputRef.current!.value = '';
  }

  return (
    <>
        <div className="event-input-box">
            <input 
              className="event-input"
              type="text"
              ref={inputRef}
              placeholder="请输入待办事项" 
            />
            <button onClick={getItemInformation} className="add-button">添加</button>
        </div>
    </>
  )
}