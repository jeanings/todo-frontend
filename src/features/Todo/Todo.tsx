import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DEV_BACKEND } from '../../app/App';
import { setTodos, TodoProps } from './todoSlice';
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
    const showOnly: TodoProps['showOnly'] = todoState.showOnly;
    
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
            
            <h1 className="Todo__greet"
                role="heading"
                aria-label="todo greeter">
                { "ToDos" + " " + getGreeting(showOnly) }
            </h1>

          
        </div>
    );
}


export const getGreeting = (showOnly: TodoProps['showOnly']): string => {
    const greetingsForColors = {
        'all': 'within 5 days',
        'solid': 'as soon as possible',
        'red': 'for today',
        'amber': 'for tomorrow',
        'green': 'in 2~3 days',
        'transparent': 'in 4 days'
    };

    return greetingsForColors[showOnly];
};

export default Todo;
