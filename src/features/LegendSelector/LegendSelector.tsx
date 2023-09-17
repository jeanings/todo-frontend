import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { TodoProps } from '../Todo/todoSlice';
import LegendButton, { LegendButtonProps } from './LegendButton';
import './LegendSelector.css';

/* ===============================================================
    Toolbar that acts as both the legend for 'color' description
    and selector/filter for showing todos based on 'color'.
    Uses <todo.showOnly> state. 
=============================================================== */
const LegendSelector: React.FunctionComponent = () => {
    const showOnly: TodoProps['showOnly'] = useAppSelector(state => state.todo.showOnly);

    const colors: LegendButtonProps['color'][] = [
        'all', 'solid', 'red', 'amber', 'green', 'transparent', 'blank'
    ];
    const labelPairs: LegendLabelsType = {
        'all': 'For the week',
        'solid': 'ASAP',
        'red': 'Today',
        'amber': 'Tomorrow',
        'green': '2~3 days',
        'transparent': '4 days',
        'blank': '5+ days'
    };
    
    // Build list of selector buttons.
    let legendButtons: React.ReactElement<LegendButtonProps>[] = [];
    for (let color of colors) {
        const legendButton = (
            <LegendButton 
                color={ color }
                label={ labelPairs[color] }
                key={`key-legend-button_${color}`}
            />
        );
        legendButtons = [...legendButtons, legendButton];
    }

    return (
        <div className="Todo__legend"
            id="legend"
            role="toolbar"
            aria-label="todo legend and selector">

            {/* Selector buttons for filtering todos by 'color' */}
            { legendButtons }
        </div>
    );
};

type LegendLabelsType = {
    [key in TodoProps['showOnly']]: LegendButtonProps['label'];
};

export default LegendSelector;
