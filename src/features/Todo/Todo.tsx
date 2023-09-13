import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DEV_BACKEND } from '../../app/App';
import { setTodos } from './todoSlice';
import TodoTask from './TodoTask';
import todos from '../../utils/mockTodos.json';
import './Todo.css';


/* =====================================================================
    A main component - container for all the todos which are fetched 
    and generated on initial load.
===================================================================== */
const Todo: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const todoState = useAppSelector(state => state.todo);
    
    useEffect(() => {
        if (todoState.status === 'uninitialized') {
            if (DEV_BACKEND === 'Off') {
                // for development only, mocked action to set state.
                dispatch(setTodos(todos));
            }
        }
    }, [todoState.status])


    return (
        <div className="Todo"
            role="list"
            aria-label="todo tasks container">
        </div>
    );
}

export default Todo;
