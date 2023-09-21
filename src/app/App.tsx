import React from 'react';
import { useAppSelector } from './hooks';
import Todo from '../features/Todo/Todo';
import LegendSelector from '../features/LegendSelector/LegendSelector';
import TodoCreator from '../features/TodoCreator/TodoCreator';
import Editor from '../features/Editor/Editor';
import './App.css';



export const todoApiUri = process.env.REACT_APP_BACKEND_URI as string;

function App() {
    const editing = useAppSelector(state => state.editor.editing);

    return (
        <div className={ `App` }>
            {/* Dimming overlay when Editor is shown. */}
            <div className={ `App__overlay ${editing ? "on" : ""}` }
                role="figure"
                aria-label="overlay for main app">
            </div>
            <Todo />
            <LegendSelector />
            <TodoCreator />
            <Editor />
        </div>
    );
}

export default App;
