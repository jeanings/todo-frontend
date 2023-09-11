import React from 'react';
import Todo from '../features/Todo/Todo';
import './App.css';


export const todoApiUri: string = 'http://localhost:3333'; 

function App() {
  return (
    <div className="App">
      <Todo />
    </div>
  );
}

export default App;
