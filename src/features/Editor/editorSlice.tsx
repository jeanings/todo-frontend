import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TodoProps } from '../Todo/todoSlice';


/* ===================================
    Slice for handling editor usage.
=================================== */
const initialState: EditorProps = {
    editing: false,
    editFor: null,
    updateDefaults: null
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        // Handles filtering of todos to show by 'color'.
        toggleEditor: (state, action) => {
            const [ toggle, editFor, updateDefaults ] = action.payload;
            state.editing = toggle;
            state.editFor = editFor;
            state.updateDefaults = updateDefaults;
        },
    }
});

export interface EditorProps {
    [index: string]: boolean | null | 'create' | 'update' | TodoProps | undefined
    editing: boolean,
    editFor: 'create' | 'update' | null,
    updateDefaults:  | null
};

export interface EditorTodoProps {
    id?: string,
    title?: string,
    date?: string,
    tasks?: string
};

// Selector for todos state.
export const editorState = (state: RootState) => state.editor;

// Export actions, reducers.
const { actions, reducer } = editorSlice;
export const { toggleEditor } = actions;
export default reducer;