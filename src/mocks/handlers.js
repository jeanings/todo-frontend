import { rest } from 'msw';
import { todoApiUri } from '../app/App';
import defaultTodos from '../utils/mockTodos.json';

const createDatedPayload = {
    id: 'testDatedId',
    title: 'Write tests for editor',
    date: '2023-09-20',
    tasks: ['It has to be done'],
    completed: false,
    color: 'blank'
};

const createUpdatePayload = {
    id: '650923396d4e4712df326abe',
    title: 'Writing tests for update',
    date: '2023-09-20',
    tasks: ['This will be updated'],
    completed: false,
    color: 'solid'
}

const newTodosWithCreated = [...defaultTodos, createDatedPayload];
// Remove old todo and replace with 'updated' version.
const newTodosWithPatched = defaultTodos.filter((todo) => todo.id !== '650923396d4e4712df326abe');
newTodosWithPatched.push(createUpdatePayload);
// Delete todo.
const deletedTodo = createUpdatePayload;    // same id for deletion one.


export const handlers = [
    rest.post(`${todoApiUri}create`, (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json(newTodosWithCreated)
        );
    }),
    rest.get(`${todoApiUri}getAll`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(defaultTodos)
        );
    }),
    rest.patch(`${todoApiUri}update/650923396d4e4712df326abe`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(newTodosWithPatched)
        );
    }),
    rest.delete(`${todoApiUri}delete/650923396d4e4712df326abe`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(deletedTodo)
        );
    })
]