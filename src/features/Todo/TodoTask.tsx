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
    const styledClassname: string = props.baseClassname + props.color;

    return (
        <div className={ styledClassname }
            role="lisitem"
            aria-label="todo task">
        </div>
    );
};

export interface TodoTaskProps extends TodoType {
    'baseClassname': string
};

export default TodoTask;
