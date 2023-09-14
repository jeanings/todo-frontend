import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import './LegendSelector.css';

/* ===============================================================
    Toolbar that acts as both the legend for 'color' description
    and selector/filter for showing todos based on 'color'.
    Uses <todo.showOnly> state. 
=============================================================== */
const LegendSelector: React.FunctionComponent = () => {
    

    return (
        <div className="Todo__legend"
            id="legend"
            role="toolbar"
            aria-label="todo legend and selector">

            {/* Selector buttons for filtering todos by 'color' */}
        </div>
    );
};

export default LegendSelector;
