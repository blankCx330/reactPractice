import { useState } from 'react'
import './App.css'

function Square() {
  return (
    <>
      <button className='square'></button>
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
