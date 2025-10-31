function Hello() {
  return (
    <h1>Hello World</h1>
  );
}

function Button() {
  return (
    <button>Click Me</button>
  );
}


function App() {
  return (
    <>
      <div>
        <Hello />
        <Button />
      </div>
    </>
  )
}

export default App
