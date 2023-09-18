import React from 'react';
import Todo from '../features/Todo/Todo';
import LegendSelector from '../features/LegendSelector/LegendSelector';
import './App.css';
import TodoCreator from '../features/TodoCreator/TodoCreator';


export const todoApiUri = process.env.REACT_APP_BACKEND_URI as string;

function App() {
    return (
        <div className="App">
            <Todo />
            <LegendSelector />
            <TodoCreator />
        </div>
    );
}

export default App;
