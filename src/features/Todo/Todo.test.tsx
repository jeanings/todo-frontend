import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todo, { getGreeting } from './Todo';


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
    // expect(store.getState().todo.green).not.toBeNull();
});

test('(WIP) renders correct heading text based on <showOnly> state', async() => {
    render(
        <Provider store={store}>
            <Todo />
        </Provider>
    );

    expect(store.getState().todo.status).toEqual('successful');
    const heading: HTMLElement = screen.getByRole('heading', { name: 'todo greeter'});
    expect(heading).toBeInTheDocument();

    // Default, 'show all' heading.
    expect(store.getState().todo.showOnly).toEqual('all');
    const expectedAllGreeting: string = "ToDos" + " " + getGreeting('all');
    expect(heading.textContent).toEqual(expectedAllGreeting);
    
    // TODO: 
    // refactor later for selecter integration tests.
});

test('renders color-coded todo containers from fetched data', async() => {
    render(
        <Provider store={store}>
            <Todo />
        </Provider>
    );

    expect(store.getState().todo.status).toEqual('successful');
    
    // Verify non-existing colors.
    const nonExistingColors = ['red', 'green'];
    for (let color of nonExistingColors) {
        // Verify existence in state.
        expect(store.getState().todo[color]).toEqual(null);
        // Verify container exists in DOM.
        const colorContainer = screen.queryAllByRole(
            'listitem', { name: `todo container for ${color} coded tasks`});
        expect(colorContainer.length).toEqual(0);
    }
    
    // Verify existing colors.
    const existingColors = ['solid', 'amber', 'transparent'];
    for (let color of existingColors) {
        // Verify existence in state.
        expect(store.getState().todo[color]).not.toEqual(null);
        // Verify container exists in DOM.
        const colorContainer = screen.queryAllByRole(
            'listitem', { name: `todo container for ${color} coded tasks`});
        expect(colorContainer.length).not.toEqual(0);
    }
 
});