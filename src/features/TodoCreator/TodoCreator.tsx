import React, { useState }from 'react';
import { useAppDispatch } from '../../app/hooks';
import { createTodo, TodoType } from '../Todo/todoSlice';
import './TodoCreator.css';

/* =============================================
    Button component opening todo create form.
============================================= */
const TodoCreator: React.FunctionComponent = () => {

    const onCreateButtonClick = (event: React.SyntheticEvent) => {
        // open editor overlay for creating new todo.
    };

    return (
        <button className="Todo__create"
            aria-label={ `button to create new todos` }
            onClick={ onCreateButtonClick }>
            
            { newTodoIcon }
        </button>
    );
};


const newTodoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 15v-3h-2v3h-3v2h3v3h2v-3h3v-2h-.937zM4 7h11v2H4zm0 4h11v2H4zm0 4h8v2H4z">
        </path>
    </svg>
);

export interface TodoCreatorProps {
    'name': 'edit' | 'delete',
    'baseClassname': string,
    'id': TodoType['id'],
    'color': TodoType['color']
};

export default TodoCreator;
