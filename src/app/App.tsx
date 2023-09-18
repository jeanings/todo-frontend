import React from 'react';
import Todo from '../features/Todo/Todo';
import LegendSelector from '../features/LegendSelector/LegendSelector';
import TodoCreator from '../features/TodoCreator/TodoCreator';
import Editor from '../features/Editor/Editor';
import './App.css';



export const todoApiUri = process.env.REACT_APP_BACKEND_URI as string;

function App() {
    return (
        <div className="App">
            <Todo />
            <LegendSelector />
            <TodoCreator />
            <Editor />
        </div>
    );
}

export default App;
