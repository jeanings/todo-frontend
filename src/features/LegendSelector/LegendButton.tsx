import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TodoProps } from '../Todo/todoSlice';
import './LegendButton.css';

/* ===============================================================
    Legend selector button that shows/filters 'color' todos. 
=============================================================== */
const LegendButton: React.FunctionComponent<LegendButtonProps> = (props: LegendButtonProps) => {
    const showOnly: TodoProps['showOnly'] = useAppSelector(state => state.todo.showOnly);


    return (
        <button className="Todo__legend__button"
            id={ `selector__${props.color}`}
            aria-label="todo selector button">

            { props.color }
        
        </button>
    );
};

export interface LegendButtonProps {
    'color': TodoProps['showOnly'],
    'label': 'All' | 'ASAP' | 'Today' | 'Tomorrow' | '2~3 days' | '4 days'
};

export default LegendButton;
