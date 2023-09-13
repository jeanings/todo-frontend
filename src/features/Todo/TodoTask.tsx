import React from 'react';
import { TodoType } from './todoSlice';
import './TodoTask.css';

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
            Circular borders.
=============================================================== */
const TodoTask: React.FunctionComponent<TodoTaskProps> = (props: TodoTaskProps) => {
    const styledClassname: string = props.baseClassname;

    // Build list of tasks.
    const taskListElems: JSX.Element[] = [];
    for (let task of props.tasks) {
        const taskListElem: JSX.Element = (
            <li className={ styledClassname + "__" + "tasklist-item" }
                role="listitem"
                aria-label="todo task list item"
                key={`key-task-${props.color}_${props.id}-li-${task}`}>
                { task }
            </li>
        );
        taskListElems.push(taskListElem);
    }

    return (
        <div className={ styledClassname }
            id={ props.id }
            role="listitem"
            aria-label={ `todo container for ${props.color} coded tasks` }>

            <h2>{ props.title }</h2>
            <h4>{ props.date 
                    ? props.date.toString() 
                    : '' }
            </h4>
            <ul className={ styledClassname + "__" + "tasklist" }
                role="list"
                aria-label="todo task list container">
                { taskListElems }
            </ul>
        </div>
    );
};

export interface TodoTaskProps extends TodoType {
    'baseClassname': string
};

export default TodoTask;
