import { useState } from 'react'
import './App.css'

let text = '';
let state = true;

function Board({ xIsNext, squares, onPlay }) {

  // 处理点击方格的函数
  function handleClick(i) {
    // 如果该方格已有值，或者已有玩家获胜，则不进行任何操作
    if (squares[i] || calcilateWinner(squares)) {
      return;
    }
    // 创建 squares 的副本
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X'
    }else{
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares);//将新的 squares 状态传递给父组件 history
  }

  const winner = calcilateWinner(squares);
  // 这里的 status 不是状态变量
  // 但status 的值依赖于 squares 和 xIsNext 这两个状态变量
  // 当 squares xIsNext 这两个状态变量 更新导致组件重新渲染时
  // status会重新计算
  // 新的值会直接反映在 JSX 中
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'O' : 'X');
  }

  return (
    <>
    <p className='status'>{ status }</p>
      <div className='ground'>
        <div className='column-div'>
          {/* 
            这里使用onSquareClick={handleClick(0)} 会无法渲染
            因为这样会在渲染时就调用handleClick函数，而不是在点击时调用
            但问题是handleClick函数中调用了setSquares，导致组件重新渲染，从而无限循环
            所以需要使用箭头函数包裹handleClick函数，确保只有在点击时才调用

            在 React 中
            通常使用 onSomething 命名代表事件的 props
            使用 handleSomething 命名处理这些事件的函数。
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

  function Game() {
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const currentSquares = history[history.length -1];//声明当前棋盘状态

    //处理下一个棋盘状态的函数
    function handlePlay(nextSquares) {
      setHistory([...history, nextSquares]);//对history进行浅拷贝
      setXIsNext(!xIsNext);
    }

    return (
      <>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </>
    )
  }

  // 计算获胜者的函数
  // 接受当前 squares 作为参数
  // 返回获胜者的标记（'X' 或 'O'），如果没有获胜者则返回 null
  // squares 是一个长度为9的数组，表示井字棋的9个格子
  function calcilateWinner(squares) {
    //胜利的组合
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];//获取对应的三个坐标
      //当这三个坐标的值相等且不为空时，说明有玩家获胜
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

// 方格组件
// 接受 value 和 onSquareClick 作为 props
// value: 方格的值（'X'、'O' 或 null）
// onSquareClick: 点击方格时调用的函数
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
      <Game />
    </>
  )
}

export default App
