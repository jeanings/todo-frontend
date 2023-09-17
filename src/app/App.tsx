import React from 'react';
import Todo from '../features/Todo/Todo';
import LegendSelector from '../features/LegendSelector/LegendSelector';
import './App.css';


export const DEV_BACKEND = process.env.REACT_APP_DEV_BACKEND_STATUS;
export const todoApiUri = process.env.REACT_APP_BACKEND_URI as string;

function App() {
    return (
        <div className="App">
            <Todo />
            <LegendSelector />
        </div>
    );
}

export default App;
