import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { handleColorSelect, TodoProps } from '../Todo/todoSlice';
import './LegendButton.css';

/* ===============================================================
    Legend selector button that shows/filters 'color' todos. 
=============================================================== */
const LegendButton: React.FunctionComponent<LegendButtonProps> = (props: LegendButtonProps) => {
    const dispatch = useAppDispatch();
    const [ legendButtonHovered, setLegendButtonHovered ] = useState(false);
    const [ legendButtonSelected, setLegendButtonSelected ] = useState(false);
    const showOnly: TodoProps['showOnly'] = useAppSelector(state => state.todo.showOnly);

    // Set clicked state on initial render for 'all'.
    useEffect(() => {
        if (props.color === 'all') {
            setLegendButtonSelected(true);
        }
    }, []);

    // Update <showOnly> state on legend button click.
    useEffect(() => {
        // Only dispatch action if new selection.
        if (showOnly !== props.color
            && legendButtonSelected === true) {
            dispatch(handleColorSelect(props.color));
        }
    }, [legendButtonSelected]);

    // De-select button if <showOnly> different.
    useEffect(() => {
        if (showOnly !== props.color) {
            setLegendButtonSelected(false);
        }
    }, [showOnly]);

    
    const onLegendButtonHover = (event: React.SyntheticEvent) => {
        legendButtonHovered === true
            ? setLegendButtonHovered(false)
            : setLegendButtonHovered(true);
    };

    const onLegendButtonClick = (event: React.SyntheticEvent) => {
        legendButtonSelected === true
            ? setLegendButtonSelected(false)
            : setLegendButtonSelected(true);
    };
    

    return (
        <button className={`Todo__legend__button ${props.color} ${legendButtonHovered ? "hovered" : ""} ${legendButtonSelected ? "selected" : ""}`}
            id={ `selector__${props.color}`}
            aria-label={ `todo selector for ${props.color}` }
            onMouseEnter={ onLegendButtonHover }
            onMouseLeave={ onLegendButtonHover }
            onClick={ onLegendButtonClick }>

            { getLabelIcon(props.color) }   
            { props.label }
        
        </button>
    );
};


const getLabelIcon = (color: LegendButtonProps['color']) => {
    const styledClassName: string = `Todo__legend__button__indicator ${color}`;
    const circleSolid = (
        <svg className={ styledClassName }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z">
            </path>
        </svg>
    );

    const circleHollow = (
        <svg className={ styledClassName }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12c.001 5.515 4.487 10.001 10 10.001 5.514 0 10-4.486 10.001-10.001 0-5.514-4.486-10-10.001-10zm0 18.001c-4.41 0-7.999-3.589-8-8.001 0-4.411 3.589-8 8-8 4.412 0 8.001 3.589 8.001 8-.001 4.412-3.59 8.001-8.001 8.001z">
            </path>
        </svg>
    );

    const grid = (
        <svg className={ styledClassName }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z">
            </path>
        </svg>
    );

    const boxSolid = (
        <svg className={ styledClassName }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z">
            </path>
        </svg>
    );

    const boxHollow = (
        <svg className={ styledClassName }
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z">
                </path>
        </svg>
    );

    let labelSvg = circleSolid;
    // Assign different svg depending on 'color'.
    switch (color) {
        case 'all': 
            labelSvg = grid;
            break;
        case 'solid':
            labelSvg = boxSolid;
            break;
        case 'transparent':
            labelSvg = circleHollow;
            break;
        case 'blank':
            labelSvg = boxHollow;
            break;
        default:
            labelSvg = circleSolid;
    }

    return labelSvg;
};

export interface LegendButtonProps {
    'color': TodoProps['showOnly'],
    'label': 'For the week' | 'ASAP' | 'Today' | 'Tomorrow' | '2~3 days' | '4 days' | '5+ days'
};

export default LegendButton;
