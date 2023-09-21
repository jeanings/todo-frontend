import React from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { 
    act, 
    cleanup,
    render,
    screen, 
    waitFor, 
    within } from '@testing-library/react';
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

test('renders edit, delete buttons in todos', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    // Verify initial fetch.
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
    await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
    await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

    // Check existence of a todo.
    let targetColor = 'red';
    const colorContainer = screen.queryAllByRole('listitem', { name: `todo container for ${targetColor} coded tasks`})[0];
    expect(colorContainer).toBeInTheDocument();

    const editButtons = screen.queryAllByRole('button', { name: 'button to edit for tasks' });
    const deleteButtons = screen.queryAllByRole('button', { name: 'button to delete for tasks' });
    expect(editButtons.length).not.toEqual(0);
    expect(deleteButtons.length).not.toEqual(0);
});

test('delete button clicks will call DELETE method and remove todo', async() => {
    const { freshStore }= renderHelper({ todo: true, legend: false, creator: false, editor: false });
    // Verify initial fetch.
    expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
    await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
    await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

    // Get a todo to delete.
    let targetColor = 'solid';
    const todoToDelete = screen.queryAllByRole('listitem', { name: `todo container for ${targetColor} coded tasks`})[0];
    expect(todoToDelete).toBeInTheDocument();

    // Verify todo marked for deletion is in state.
    const todoInState = freshStore.getState().todo.todos?.filter(todo => todo.id === todoToDelete.id)[0];
    expect(todoInState?.id).toEqual(todoToDelete.id);
    
    // Delete todo.
    const deleteButton = within(todoToDelete).getByRole('button', { name: 'button to delete for tasks' });
    await user.click(deleteButton);

    // Verify todo no longer in state.
    const deletedTodo = freshStore.getState().todo.todos?.filter(todo => todo.id === todoToDelete.id);
    expect(deletedTodo?.length).toEqual(0);
});


type RendererType = {
    todo: boolean,
    legend: boolean,
    creator: boolean,
    editor: boolean
};