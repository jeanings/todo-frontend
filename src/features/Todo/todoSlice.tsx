import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
// import { RootState } from '../../app/store';
import { todoApiUri } from '../../app/App';


/* ================================================
    Slice for handling CRUD operations for todos.
================================================ */

/* ---------------------------------
    Todos fetcher for async thunk.
--------------------------------- */
export const requestToApi = (todoApiUri: string, request: any, method: any) => {
    const requestedAction = Promise.resolve(
        axios({
            method: method,
            url: todoApiUri,
            data: request
        })
    )

    return requestedAction;
};

/* ----------------------------------
    Async thunks for todos.
---------------------------------- */
export const createTodo = createAsyncThunk(
    'todos/createTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, request, 'post');
            if (response.status === 201) {  // 'Created' status code.
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
    'todos/getTodos',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, request, 'get');
            if (response.status === 200) {  // OK.
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
    'todos/updateTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, request, 'patch');
            if (response.status === 200) {  // OK.
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
    'todos/removeTodo',
    async(request: any, { rejectWithValue }) => {
        try {
            const response: AxiosResponse = await requestToApi(todoApiUri, request, 'delete');
            if (response.status === 204) {  // 'No content' (removed) status code.
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
    showOnly: 'all'
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create thunks.
            .addCase(createTodo.fulfilled, (state, action) => {

            })
            // Read thunks.
            .addCase(getTodos.fulfilled, (state, action) => {
                // Save fetched todos into state.
                const data = action.payload;
                const { solid, red, amber, green, transparent } = data;
                state.solid = solid
                state.red = red
                state.amber = amber
                state.green = green
                state.transparent = transparent
                state.status = 'successful';
                state.showOnly = 'all';
            })
            // Update thunks.
            .addCase(updateTodo.fulfilled, (state, action) => {

            })
            // Delete thunks.
            .addCase(removeTodo.fulfilled, (state, action) => {

            })
      }
});

export interface TodoProps {
    [index: string]: string | null | TodoType
    'status': 'uninitialized' | 'successful' | 'error',
    'solid': TodoType | null,
    'red': TodoType | null,
    'amber': TodoType | null,
    'green': TodoType | null,
    'transparent': TodoType | null,
    'showOnly': 'all' | 'solid' | 'red' | 'amber' | 'green' | 'transparent'
};

export interface TodoType {
    'id': string,
    'title': string,
    'date': Date,
    'tasks': string[]
};

// Export actions, reducers.
const { actions, reducer } = todosSlice;
export const {} = actions;
export default reducer;