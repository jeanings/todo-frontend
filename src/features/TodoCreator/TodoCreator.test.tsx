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
import Todo from '../Todo/Todo';
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


test('renders TodoCreator component', async() => {
    const { freshStore }= renderHelper({ todo: false, legend: false, creator: true, editor: false });
    expect(screen.getByRole('button', { name: 'button to create new todos' })).toBeInTheDocument();
});

test('creator button click updates <editor> state', async() => {
    const { freshStore }= renderHelper({ todo: false, legend: false, creator: true, editor: false });
    const createButton = screen.getByRole('button', { name: 'button to create new todos' });
    expect(createButton).toBeInTheDocument();
    expect(freshStore.getState().editor.editing).toEqual(false);

    // Click create button.
    await user.click(createButton);

    expect(freshStore.getState().editor.editFor).toEqual('create');
    expect(freshStore.getState().editor.editing).toEqual(true);
});


type RendererType = {
    todo: boolean,
    legend: boolean,
    creator: boolean,
    editor: boolean
};