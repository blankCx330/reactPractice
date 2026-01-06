import { useRef,useState } from "react";
export default function EventInputBox({getItem}:any) {
  const inputRef = useRef<HTMLInputElement>(null);
  function getItemInformation(){
    getItem(inputRef.current!.value);
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