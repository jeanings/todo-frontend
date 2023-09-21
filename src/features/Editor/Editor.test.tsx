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
import Editor from './Editor';
import Todo from '../Todo/Todo';
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


describe('Editor renders on state <editing> conditional', () => {
    afterEach(() => {
        cleanup;
    });

    test('== false, does not render Editor container', async() => {    
        const { freshStore }= renderHelper({ todo: false, legend: false, creator: true, editor: true });
        expect(freshStore.getState().editor.editing).toEqual(false);
        
        const editorContainer = screen.queryByRole('main', { name: 'editor container' });
        expect(editorContainer).toBeNull();
    });
    
    test('== true, renders Editor container', async() => {
        const { freshStore }= renderHelper({ todo: false, legend: false, creator: true, editor: true });
        expect(freshStore.getState().editor.editing).toEqual(false);

        const todoCreatorButton = screen.getByRole('button', { name: 'button to create new todos' });
        expect(todoCreatorButton).toBeInTheDocument();
        // Open editor.
        await waitFor(() => user.click(todoCreatorButton));
        expect(freshStore.getState().editor.editing).toEqual(true);
        
        const editorContainer = screen.queryByRole('main', { name: 'editor container' });
        expect(editorContainer).toBeInTheDocument();
    });
});


describe('Editor form submission', () => {
    afterEach(() => {
        cleanup;
    });

    test('dispatches CREATE form data on accepted inputs', async() => {
        const { freshStore }= renderHelper({ todo: true, legend: false, creator: true, editor: true });
        
        // Verify initial fetch.
        expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
        await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
        await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

        const todoCreatorButton = screen.getByRole('button', { name: 'button to create new todos' });
        expect(todoCreatorButton).toBeInTheDocument();

        // Open editor.
        await waitFor(() => user.click(todoCreatorButton));
        expect(freshStore.getState().editor.editing).toEqual(true);
    
        const inputTitle = screen.getByRole('textbox', { name: 'Title' });
        const inputDate = screen.getByRole('textbox', { name: 'Date' });
        const inputTasks = screen.getByRole('textbox', { name: 'Tasks' });

        // Enter accepted values (dated).
        await user.type(inputTitle, "Write tests for create");
        expect(inputTitle).toHaveValue("Write tests for create");
        await user.type(inputDate, "2023/09/20");
        expect(inputDate).toHaveValue("2023/09/20");
        await user.type(inputTasks, "It has to be done");
        expect(inputTasks).toHaveValue("It has to be done");

        // Verify "new" todo doesn't exist in state.
        const submitButton = screen.getByRole('button', { name: 'editor submit button' });
        await waitFor(() => user.click(submitButton));
   
        // Verify updated todos.
        const findDatedTodo = freshStore.getState().todo.todos?.filter(todo => todo.id === "testDatedId");
        expect(findDatedTodo?.length).toEqual(1);
    });

    test('dispatches UPDATE form data on accepted inputs', async() => {
        const { freshStore }= renderHelper({ todo: true, legend: false, creator: true, editor: true });
        
        // Verify initial fetch.
        expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
        await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
        await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

        const todoUpdateButton = screen.getAllByRole('button', { name: 'button to edit for tasks' })[0];
        expect(todoUpdateButton).toBeInTheDocument();

        // Open editor.
        await waitFor(() => user.click(todoUpdateButton));
        expect(freshStore.getState().editor.editing).toEqual(true);
    
        const inputTitle = screen.getByRole('textbox', { name: 'Title' });
        const inputDate = screen.getByRole('textbox', { name: 'Date' });
        const inputTasks = screen.getByRole('textbox', { name: 'Tasks' });

        // Enter accepted values (dated).
        await user.type(inputTitle, "Writing tests for update");
        expect(inputTitle).toHaveValue("Writing tests for update");
        await user.type(inputDate, "2023/09/20");
        expect(inputDate).toHaveValue("2023/09/20");
        await user.type(inputTasks, "This will be updated");
        expect(inputTasks).toHaveValue("This will be updated");

        // Check original todo props.
        const findTodoBefore = freshStore.getState().todo.todos?.filter(todo => todo.id === '650923396d4e4712df326abe')[0];
        expect(findTodoBefore?.title).not.toEqual('Write tests for update'); 

        // Verify "new" todo doesn't exist in state.
        const submitButton = screen.getByRole('button', { name: 'editor submit button' });
        await waitFor(() => user.click(submitButton));
   
        // Verify updated todos.
        const findTodoAfter = freshStore.getState().todo.todos?.filter(todo => todo.id === '650923396d4e4712df326abe')[0];
        expect(findTodoAfter?.title).toEqual('Writing tests for update');
    });

    test('with wrong inputs will not dispatch action', async() => {
        const { freshStore }= renderHelper({ todo: true, legend: false, creator: true, editor: true });
        
        // Verify initial fetch.
        expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
        await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
        await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

        const todoCreatorButton = screen.getByRole('button', { name: 'button to create new todos' });
        expect(todoCreatorButton).toBeInTheDocument();

        // Open editor.
        await waitFor(() => user.click(todoCreatorButton));
        expect(freshStore.getState().editor.editing).toEqual(true);
    
        const inputTitle = screen.getByRole('textbox', { name: 'Title' });
        const inputDate = screen.getByRole('textbox', { name: 'Date' });
        const inputTasks = screen.getByRole('textbox', { name: 'Tasks' });

        // Enter accepted values (dated).
        await user.type(inputTitle, "Write tests for create");
        expect(inputTitle).toHaveValue("Write tests for create");
        await user.type(inputDate, "10/31/2023");
        expect(inputDate).toHaveValue("10/31/2023");
        await user.type(inputTasks, "This is gonna fail");
        expect(inputTasks).toHaveValue("This is gonna fail");

        // Verify "new" todo doesn't exist in state.
        const submitButton = screen.getByRole('button', { name: 'editor submit button' });
        await waitFor(() => user.click(submitButton));
   
        // Verify unchanged todos.
        const findDatedTodo = freshStore.getState().todo.todos?.filter(todo => todo.id === "testDatedId");
        expect(findDatedTodo?.length).toEqual(0);
    });
});



type RendererType = {
    todo: boolean,
    legend: boolean,
    creator: boolean,
    editor: boolean
};
type CrudType = 'create' | 'getAll' | 'update' | 'delete';