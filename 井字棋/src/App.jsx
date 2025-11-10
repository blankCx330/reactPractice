import { useState } from 'react'
import './App.css'

let text = '';
let state = true;

function Square() {
  const [value, setValue] = useState(null);
  function handleClick() {
    setValue('X')
  }

  return (
    <>
      <button 
        className='square'
        onClick={handleClick}
      >
        { value }
      </button>
    </>
  )
}

function App() {

  return (
    <>
      <div className='ground'>
        <div className='column-div'>
          <Square />
          <Square />
          <Square />
        </div>
        <div className='column-div'>
          <Square />
          <Square />
          <Square />
        </div>
        <div className='column-div'>
          <Square />
          <Square />
          <Square />
        </div>
      </div>   
    </>
  )
}

export default App
