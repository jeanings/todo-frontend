import { createSlice, createAsyncThunk, ActionMatchingAllOf } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { RootState } from '../../app/store';
import { todoApiUri } from '../../app/App';


/* ================================================
    Slice for handling CRUD operations for todos.
================================================ */

/* ---------------------------------
    Todos fetcher for async thunk.
--------------------------------- */
export const requestToApi = (todoApiUri: string, endpoint: string, request: any, method: any) => {
    const route: string = todoApiUri + endpoint;
    const requestedAction = Promise.resolve(
        axios({
            method: method,
            url: route,
            data: request
        })
    )

    return requestedAction;
};

/* ----------------------------------
    Async thunks for todos.
---------------------------------- */
export const createTodo = createAsyncThunk(
    'todo/createTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, 'create', request, 'post');
            if (response.status === 201) {  // 'Created'
                return (await response.data);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data);
            }
            else {
                console.error(error);
            }
        }
    }
);

export const getTodos = createAsyncThunk(
    'todo/getTodos',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, 'getAll', request, 'get');
            if (response.status === 200) {  // 'OK'
                return (await response.data);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data);
            }
            else {
                console.error(error);
            }
        }
    }
);

export const updateTodo = createAsyncThunk(
    'todo/updateTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, 'update', request, 'patch');
            if (response.status === 200) {  // 'OK'
                return (await response.data);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data);
            }
            else {
                console.error(error);
            }
        }
    }
);

export const removeTodo = createAsyncThunk(
    'todo/removeTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, 'delete', request, 'delete');
            if (response.status === 200) {  // 'OK'
                return (await response.data);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data);
            }
            else {
                console.error(error);
            }
        }
    }
);


/* ---------------------------------------------
    Slice for handling reducer logic for state.
--------------------------------------------- */
const initialState: TodoProps = {
    status: 'uninitialized',
    solid: null,            // spot, urgent ASAP tasks
    red: null,              // daily
    amber: null,            // tomorrow
    green: null,            // in 2, 3 days
    transparent: null,      // in 4 days, not urgent
    blank: null,            // in 5+ days
    showOnly: 'all'
};

const todosSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        // Set todo state for mocked fetches.
        setTodos: (state, action) => {
            // Helper function to filter for targeted todo 'color'.
            const getTodoColors = (data: TodoType[], color: TodoType['color']): TodoType[] | null => {
                const todosOfColor: TodoType[] = data.filter((todo: TodoType) => {
                    return (todo.color === color);
                });

                if (todosOfColor.length > 0) {
                    return todosOfColor;
                }
                else {
                    return null;
                }
            };

            // Set 'color' states.
            const data: TodoType[] = action.payload;
            state.solid = getTodoColors(data, 'solid');
            state.red = getTodoColors(data, 'red');
            state.amber = getTodoColors(data, 'amber');
            state.green = getTodoColors(data, 'green');
            state.transparent = getTodoColors(data, 'transparent');
            // Update statuses.
            state.status = 'successful';
            state.showOnly = 'all';
        },
        // Handles filtering of todos to show by 'color'.
        handleColorSelect: (state, action) => {
            const onlyShowFor: TodoProps['showOnly'] = action.payload;
            state.showOnly = onlyShowFor;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------------------------
                Create (POST) reducer.
            --------------------------- */
            .addCase(createTodo.fulfilled, (state, action) => {

            })
            /* ---------------------------
                Read (GET) reducer.
            --------------------------- */
            .addCase(getTodos.fulfilled, (state, action) => {
                // Save fetched todos into state.
                const data = action.payload;
                const colors: {[index: string]: TodoType[]} = {
                    solid: [],
                    red: [],
                    amber: [],
                    green: [],
                    transparent: [],
                    blank: []
                };

                // Bin 'colored' todos from response to its corresponding array.
                for (let todo of data) {
                    if (Object.keys(colors).includes(todo.color)) {
                        colors[todo.color].push(todo);
                    }
                    else if (todo.color === null) {
                        colors.blank.push(todo);
                    }
                }

                // Update color states.
                state.solid = colors.solid;
                state.red = colors.red;
                state.amber = colors.amber;
                state.green = colors.green;
                state.transparent = colors.transparent;
                state.blank = colors.blank;
                // Update statuses.
                state.status = 'successful';
                state.showOnly = 'all';
            })
            /* ---------------------------
                Update (PATCH) reducer.
            --------------------------- */
            .addCase(updateTodo.fulfilled, (state, action) => {

            })
            /* ---------------------------
                Delete (DELETE) reducer.
            --------------------------- */
            .addCase(removeTodo.fulfilled, (state, action) => {

            })
      }
});

export interface TodoProps {
    [index: string]: string | null | TodoType[]
    status: 'uninitialized' | 'successful' | 'error',
    solid: TodoType[] | null,
    red: TodoType[] | null,
    amber: TodoType[] | null,
    green: TodoType[] | null,
    transparent: TodoType[] | null,
    blank: TodoType[] | null,
    showOnly: 'all' | 'solid' | 'red' | 'amber' | 'green' | 'transparent' | 'blank'
};

export interface TodoType {
    id: string,
    title: string,
    date: Date,
    tasks: string[],
    color?: 'all' | 'solid' | 'red' | 'amber' | 'green' | 'transparent' | 'blank',
    completed: boolean
};

// Selector for todos state.
export const todoState = (state: RootState) => state.todo;

// Export actions, reducers.
const { actions, reducer } = todosSlice;
export const { setTodos, handleColorSelect } = actions;
export default reducer;