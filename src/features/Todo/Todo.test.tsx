import React from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { 
    act, 
    cleanup,
    render,
    screen, 
    waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Todo, { getGreeting } from '../Todo/Todo';
import Editor from '../Editor/Editor';
import TodoCreator from '../TodoCreator/TodoCreator';
import LegendSelector from '../LegendSelector/LegendSelector';


const user = userEvent.setup();

const renderHelper = (renderFor: RendererType) => {
    const freshStore = setupStore();
    const container = render(
        <Provider store={freshStore}>
            { renderFor.todo } &&  <Todo />
            { renderFor.legend } && <LegendSelector />
            { renderFor.creator } && <TodoCreator />
            { renderFor.editor } && <Editor />
        </Provider>
    );
    return {...container, freshStore};
};

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup;
});


test('renders Todo component', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
});

test('fetches todos on init', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    // Verify initial fetch.
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
    await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
    await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));
});

test('renders correct heading text based on <showOnly> state', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    // Verify initial fetch.
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
    await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
    await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

    const heading: HTMLElement = screen.getByRole('heading', { name: 'todo greeter'});
    expect(heading).toBeInTheDocument();

    // Default, 'show all' heading.
    expect(freshStore.getState().todo.showOnly).toEqual('all');
    const expectedAllGreeting: string = "ToDos" + " " + getGreeting('all');
    expect(heading.textContent).toEqual(expectedAllGreeting);
});

test('renders color-coded todos', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    // Verify initial fetch.
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
    await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
    await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

    // Verify existing colors.
    const existingColors = ['solid', 'red', 'amber', 'green'];
    for (let color of existingColors) {
        // Verify existence in state.
        expect(freshStore.getState().todo[color]).not.toEqual(null);
        // Verify container exists in DOM.
        const colorContainer = screen.queryAllByRole('listitem', { name: `todo container for ${color} coded tasks`});
        expect(colorContainer.length).not.toEqual(0);
    }
});


type RendererType = {
    todo: boolean,
    legend: boolean,
    creator: boolean,
    editor: boolean
};