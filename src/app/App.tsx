import React from 'react';
import Todo from '../features/Todo/Todo';
import './App.css';

export const DEV_BACKEND = process.env.REACT_APP_DEV_BACKEND_STATUS;
export const todoApiUri: string = 'http://localhost:5000';

function App() {
    return (
        <div className="App">
            <Todo />
        </div>
    );
}

export default App;
