import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LegendSelector from './LegendSelector';


test('renders LegendSelector component', () => {
    render(
        <Provider store={store}>
            <LegendSelector />
        </Provider>
    );

    expect(screen.getByRole('toolbar', { name: 'todo legend and selector' })).toBeInTheDocument();
});