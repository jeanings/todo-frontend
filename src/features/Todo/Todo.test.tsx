import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todo from './Todo';


test('renders Todo component', () => {
    render(
        <Provider store={store}>
            <Todo />
        </Provider>
    );

    expect(screen.getByRole('list', { name: 'todo tasks container' })).toBeInTheDocument();
});

test('sets (mocked, development) state', async() => {
    render(
        <Provider store={store}>
            <Todo />
        </Provider>
    );

    await waitFor(() => screen.findByRole('list', { name: 'todo tasks container'}));
    expect(screen.getByRole('list', { name: 'todo tasks container' })).toBeInTheDocument();
    expect(store.getState().todo.status).toEqual('successful');
    expect(store.getState().todo.green).not.toBeNull();
});