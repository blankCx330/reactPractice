export default function ButtonContainer({handleCompletedTimes, handleAllItems, handleIncompleteTimes, handleClearCompleted}: any) {

  return (
        <div className="button-container">
            <button className="button-container-btn" onClick={handleCompletedTimes()} >已完成</button >
            <button className="button-container-btn" onClick={handleIncompleteTimes()}>未完成</button >
            <button className="button-container-btn" onClick={handleAllItems()}>查看所有</button >
            <button className="button-container-btn" onClick={handleClearCompleted()} >删除已完成</button>
        </div>
    )
}   