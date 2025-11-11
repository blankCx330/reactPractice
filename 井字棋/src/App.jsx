import { useState } from 'react'
import './App.css'

let text = '';
let state = true;

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X'
    setSquares(nextSquares);
  }

  return (
    <>
      <div className='ground'>
        <div className='column-div'>
          {/* 
            这里使用onSquareClick={handleClick(0)} 会无法渲染
            因为这样会在渲染时就调用handleClick函数，而不是在点击时调用
            但问题是handleClick函数中调用了setSquares，导致组件重新渲染，从而无限循环
            所以需要使用箭头函数包裹handleClick函数，确保只有在点击时才调用
          */}
          <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
          <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
          <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className='column-div'>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
          <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
          <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className='column-div'>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
          <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
          <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
      </div>
    </>
  );
}


function Square({value, onSquareClick}) {
  return (
    <>
      <button 
        className='square'
        onClick={onSquareClick}
      >
        { value }
      </button>
    </>
  )
}

function App() {

  return (
    <>
      <Board />
    </>
  )
}

export default App
