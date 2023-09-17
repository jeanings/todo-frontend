import React from 'react';
import { TodoType } from './todoSlice';
import TodoTaskButton from './TodoTaskButton';
import './TodoTask.css';
import { JsxAttribute } from 'typescript';

/* ===============================================================
    Constructor for creating individual todo task items.
    Styling based on time-based 'colors':
        'solid'
            No defined due date, do asap.
            Sharp, defined borders.
        'red'
            Tasks for current day.
            Gently beveled borders.
        'amber'
            Tasks for tomorrow.
            Curved borders.
        'green'
            Tasks for 2-3 days out.
            Rounded borders.
        'transparent'
            Tasks for 4 days out.
            Circular dotted borders.
        'blank'
            Tasks for 5+ days out.
            Square dashed borders.
=============================================================== */
const TodoTask: React.FunctionComponent<TodoTaskProps> = (props: TodoTaskProps) => {
    const styledClassname: string = `${props.baseClassname}__box`;

    // Build list of tasks.
    const taskListElems: JSX.Element[] = [];
    let taskCount: number = 0;
    for (let task of props.tasks) {
        const taskListElem: JSX.Element = (
            <li className={ `${styledClassname}__tasklist-item ${props.color}` }
                role="listitem"
                aria-label="todo task list item"
                key={`key-task-${props.color}_${props.id}-li-${taskCount}${task}`}>
                { task }
            </li>
        );
        taskListElems.push(taskListElem);
        taskCount++;
    }

    // Edit and delete buttons.
    const editButton: JSX.Element = (
        <TodoTaskButton
            name='edit'
            baseClassname={styledClassname}
            color={props.color}
        />
    );

    const deleteButton: JSX.Element = (
        <TodoTaskButton
            name='delete'
            baseClassname={styledClassname}
            color={props.color}
        />
    );

    return (
        <div className={ `${styledClassname} ${props.color}` }
            id={ props.id }
            role="listitem"
            aria-label={ `todo container for ${props.color} coded tasks` }>

            <h2>{ props.title }</h2>
            <h4>{ props.date 
                    ? props.date.toString() 
                    : '' }
            </h4>
            <ul className={ `${styledClassname}__tasklist ${props.color}` }
                role="list"
                aria-label="todo task list container">
                { taskListElems }
            </ul>

            { editButton }
            { deleteButton }
        </div>
    );
};


export interface TodoTaskProps extends TodoType {
    'baseClassname': string
};

export default TodoTask;
