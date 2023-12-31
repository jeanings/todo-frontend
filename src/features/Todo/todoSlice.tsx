import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { RootState } from '../../app/store';
import { todoApiUri } from '../../app/App';
import { EditorInputProps } from '../Editor/Editor';


/* ================================================
    Slice for handling CRUD operations for todos.
================================================ */

/* ---------------------------------
    Todos fetcher for async thunk.
--------------------------------- */
export const requestToApi = (todoApiUri: string, endpoint: string, request: any, method: any) => {
    let route: string = todoApiUri + endpoint;
    switch (endpoint) {
        case 'delete':
            route = `${route}/${request.id}`;
            break;
        case 'update':
            route = `${route}/${request.id}`;
            break;
        default: 
            break;
    }

    const requestedAction = Promise.resolve(
        axios({
            method: method,
            url: route,
            data: request
        })
    );
    return requestedAction;
};

/* ----------------------------------
    Async thunks for todos.
---------------------------------- */
export const createTodo = createAsyncThunk(
    'todo/createTodo',
    async(request: EditorInputProps, { rejectWithValue }) => {
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
    async(request: {}, { rejectWithValue }) => {
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
    async(request: EditorInputProps, { rejectWithValue }) => {
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

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    async(request: { id: TodoType['id'] }, { rejectWithValue }) => {
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
    todos: null,
    showOnly: 'all'
};

const todosSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
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
                const data = action.payload;
                // Update state with updated list of sorted todos.
                state.todos = removeWeekends(data);
            })
            /* ---------------------------
                Read (GET) reducer.
            --------------------------- */
            .addCase(getTodos.fulfilled, (state, action) => {
                // Save fetched todos into state.
                const data = action.payload;
                state.todos = removeWeekends(data);
                // Update statuses.
                state.status = 'successful';
                state.showOnly = 'all';
            })
            /* ---------------------------
                Update (PATCH) reducer.
            --------------------------- */
            .addCase(updateTodo.fulfilled, (state, action) => {
                const data = action.payload;
                // Update state with updated list of sorted todos.  
                state.todos = removeWeekends(data);
            })
            /* ---------------------------
                Delete (DELETE) reducer.
            --------------------------- */
            .addCase(deleteTodo.fulfilled, (state, action) => {
                const data = action.payload;
                
                if (state.todos) {
                    const todosWithoutDeleted = state.todos.filter((todo: TodoType) => todo.id !== data.id);
                    state.todos = todosWithoutDeleted;
                }
            })
            /* --------------------------------------- 
                Catches errors on fetching from API.
            --------------------------------------- */
            .addMatcher(isRejectedWithValue(getTodos), (state, action) => {
                state.status = 'error';
            })
      }
});


const removeWeekends = (todos: TodoType[]): TodoType[] => {
    let todosForWeekdays: TodoType[] = todos.filter((todo: TodoType) => {
        if (!todo.date) {
            return true;
        }
        
        const dateString = todo.date as string;
        const weekends = ['Sat', 'Sun'];
        const isWeekend = weekends.includes(dateString.slice(0, 3));
        return !isWeekend;
    });
    return todosForWeekdays;
};

export interface TodoProps {
    [index: string]: string | null | TodoType[]
    status: 'uninitialized' | 'successful' | 'error',
    todos: TodoType[] | null,
    showOnly: 'all' | 'solid' | 'red' | 'amber' | 'green' | 'transparent' | 'blank'
};

export interface TodoType {
    id: string,
    title: string,
    date: Date | string,
    tasks: string[],
    color?: 'all' | 'grey' | 'solid' | 'red' | 'amber' | 'green' | 'transparent' | 'blank',
    completed: boolean
};

// Selector for todos state.
export const todoState = (state: RootState) => state.todo;

// Export actions, reducers.
const { actions, reducer } = todosSlice;
export const { handleColorSelect } = actions;
export default reducer;