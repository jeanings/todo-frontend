import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteTodo, TodoType } from './todoSlice';
import { toggleEditor } from '../Editor/editorSlice';
import './TodoTaskButton.css';

/* ====================================================
    Button component for inside tasks: edit or delete.
==================================================== */
const TodoTaskButton: React.FunctionComponent<TodoTaskButtonProps> = (props: TodoTaskButtonProps) => {
    const dispatch = useAppDispatch();
    const editorToggle = useAppSelector(state => state.editor.editing);
    const className: string = `${props.baseClassname}__button`;


    const onTaskButtonClick = (event: React.SyntheticEvent) => {
        switch(props.name) {
            case 'edit':
                const parsedTasks = props.tasks
                    ? props.tasks.join('\n')
                    : '';
                const thisTodo = {
                    id: props.id,
                    title: props.title,
                    date: props.date,
                    tasks: parsedTasks
                };

                editorToggle // TODO open but diff todo, change
                    ? dispatch(toggleEditor([ false, 'update' ]))
                    : dispatch(toggleEditor([ true, 'update', thisTodo ]));
                break;
            case 'delete':
                dispatch(deleteTodo({ id: props.id }));
                break;
        }
    };


    return (
        <button className={ `${className} ${props.name} ${props.color}` }
            aria-label={ `button to ${props.name} for tasks` }
            onClick={ onTaskButtonClick }>
            { getIcon(props.name, props.baseClassname, props.color) }
        </button>
    );
};


const getIcon = (name: 'edit' | 'delete', className: string, color: TodoType['color']) => {
    const editIcon = (
        <svg className={ `${className}__icon ${color}` }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z">
            </path>
        </svg>
    );
    
    const deleteIcon = (
        <svg className={ `${className}__icon ${color}` }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z">
            </path>
            <path d="M9 10h2v8H9zm4 0h2v8h-2z">
            </path>
        </svg>
    );

    let svgIcon = name === 'edit' ? editIcon : deleteIcon;
    return svgIcon;
};

export interface TodoTaskButtonProps {
    name: 'edit' | 'delete',
    baseClassname: string,
    id: TodoType['id'],
    title?: TodoType['title'],
    date?: TodoType['date'],
    tasks?: TodoType['tasks'],
    color: TodoType['color']
};

export default TodoTaskButton;
