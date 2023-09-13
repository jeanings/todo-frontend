import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoTask from './Todo';

test('renders Todo component', () => {
    render(
        <Provider store={store}>
            <TodoTask />
        </Provider>
    );

});
