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


test('renders LegendSelector component', async() => {
    const { freshStore } = renderHelper({ todo: false, legend: true, creator: false, editor: false });
    expect(screen.getByRole('toolbar', { name: 'todo legend and selector' })).toBeInTheDocument();
});

describe('selecting a "color"', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup;
    });

    const checkRenderedColors = async(selectorColor: string) => {
        const { freshStore }= renderHelper({ todo: true, legend: true, creator: false, editor: false });
        // Verify initial fetch.
        expect(screen.getByRole('main', { name: 'todo tasks container' })).toBeInTheDocument();
        await waitFor(() => expect(freshStore.getState().todo.todos).not.toEqual(null));
        await waitFor(() => expect(freshStore.getState().todo.status).toEqual('successful'));

        // Get color button.
        const selectorButton = screen.getByRole('button', { name: `todo selector for ${selectorColor}`});
        expect(selectorButton).toBeInTheDocument();

        // Get 'all' colors list.
        expect(freshStore.getState().todo.showOnly).toEqual('all');
        const todosContainer = screen.getByRole('list', { name: 'todo tasks list container' });
        const todos = within(todosContainer).queryAllByRole('listitem', { name: /todo container for/ });
    
        const allRenderedColors: string[] = [];
        for (let todo of todos) {
            const color = todo.className.split(' ')[1];
            if (!allRenderedColors.includes(color)) {
                allRenderedColors.push(color);
            }
        }
        expect(allRenderedColors).toEqual(['solid', 'red', 'amber', 'green']);

        // Click to filter for color.
        await user.click(selectorButton);

        // Verify colors.
        expect(freshStore.getState().todo.showOnly).toEqual(selectorColor);
        const todosContainerSolids = screen.getByRole('list', { name: 'todo tasks list container' });
        const todosSolids = within(todosContainerSolids).queryAllByRole('listitem', { name: /todo container for/ });
        
        const renderedOnly: string[] = [];
        for (let todo of todosSolids) {
            const selectedColor = todo.className.split(' ')[1];
            if (!renderedOnly.includes(selectedColor)) {
                renderedOnly.push(selectedColor);
            }
        }

        if (selectorColor === 'transparent') {
            expect(renderedOnly).toEqual([]);
        }
        else {
            expect(renderedOnly).toEqual([selectorColor]);
        }
    }

    test('solid -> renders week todos', async() => {
        checkRenderedColors('solid');
    });

    test('red -> renders today todos', async() => {
        checkRenderedColors('red');
    });

    test('amber -> renders tomorrow todos', async() => {
        checkRenderedColors('amber');
    });

    test('green -> renders 2-3 days todos', async() => {
        checkRenderedColors('green');
    });

    test('transparent -> (will not) render 4 day todos (not in mocked data)', async() => {
        checkRenderedColors('transparent');
    });

    test('blank -> renders all 5+ days todos', async() => {
        checkRenderedColors('blank');
    });
});





type RendererType = {
    todo: boolean,
    legend: boolean,
    creator: boolean,
    editor: boolean
};