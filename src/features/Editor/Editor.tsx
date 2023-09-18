import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTodo, updateTodo } from '../Todo/todoSlice';
import { toggleEditor } from './editorSlice';
import './Editor.css';


/* =========================================================
    Editor window for both updating and creating new todos.
========================================================  */
const Editor: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const editorState = useAppSelector(state => state.editor);
    const updateDefaults = useAppSelector(state => state.editor.updateDefaults);
    const defaults = updateDefaults ? updateDefaults : { title: '', date: '', tasks: '' };
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditorInputProps>({
        defaultValues: {
            title: defaults.title,
            date: defaults.date,
            tasks: defaults.tasks
        }
    });


    const onCloseButtonClick = (event: React.SyntheticEvent) => {
        dispatch(toggleEditor([ false, editorState.editFor ]));
        // Clear fields.
        reset();
    };

    const onEditorSubmit: SubmitHandler<EditorInputProps> = (formData) => {
    /* ------------------------------------------------------
        Dispatches different actions depending on which of
        'create' or 'update' editor is open.
    ------------------------------------------------------ */
        const dateObj = parseTodoDate(formData.date as string);
        switch (editorState.editFor) {
            case 'create':
                const payloadCreate = {
                    title: formData.title,
                    date: dateObj,
                    tasks: formData.tasks   // string: if multiline, newline included 
                };
                dispatch(createTodo(payloadCreate));
                // Clear fields.
                reset();
                break;
            case 'update':
                if (!updateDefaults) {
                    break;
                }

                const payloadUpdate = {
                    id: updateDefaults.id,
                    title: formData.title,
                    date: dateObj,
                    tasks: formData.tasks   // string: if multiline, newline included
                };
                dispatch(updateTodo(payloadUpdate));
                
                // Clear fields.
                reset();
                break;
        }
    };


    return ( // Conditional render.
        <> { editorState.editing &&
        <div className="Editor"
            role="figure"
            aria-label="editor container">
            
            <h1>ToDo Editor</h1>

            <button className="Editor__close-button"
                aria-label="close editor"
                onClick={ onCloseButtonClick }>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z">
                    </path>
                </svg>
            </button>

            <form className="Editor__form"
                aria-label="editor form"
                onSubmit={ handleSubmit(onEditorSubmit) }>

                <label className={ `Editor__form__label title` }>
                    Title
                    <input { ...register("title", { required: true, maxLength: 40 }) } 
                        placeholder={ 
                            defaults.title
                                ? `${defaults.title} (editing)`
                                : "Add title for todo"
                        }
                    />
                        {
                            errors.title
                            && <span className="Editor__form__label__error">
                                Title required.
                            </span> 
                        }
                </label>

                <label className={ `Editor__form__label date` }>
                    Date {/*  { pattern: /^[A-Za-z]+$/i } */}
                    <input { ...register("date") } 
                        placeholder={ 
                            defaults.date
                                ? `${defaults.date} (editing)`
                                : editorState.editFor === 'create'
                                    ? "YYYY/MM/DD or blank for ASAP todos"
                                    : `"blank" (editing, format DD/MM/YYYY)`
                        }
                    />
                        {
                            errors.date
                            && <span className="Editor__form__label__error">
                                Date is needs to be in format ex: 31/10/2022.
                            </span> 
                        }
                </label>

                <label className={ `Editor__form__label task` }>
                    Tasks
                    <textarea className={ `Editor__form__label__textarea task`}
                        { ...register("tasks", { required: true, maxLength: 50 }) } 
                        placeholder={ 
                            defaults.tasks
                                ? `${defaults.tasks} \n (editing)`
                                : "Add task (tasks, if entered on new line)"
                        }
                    />
                        { 
                            errors.tasks
                            && <span className="Editor__form__label__error">
                                Task required.
                            </span> 
                        }
                </label>
                
                <input type="submit" value={ editorState.editFor ? editorState.editFor : "submit" } />

            </form>
        </div>
        } </>
    );
};


const parseTodoDate = (formDate: string) => {
/* --------------------------------------
    Parses date input and returns 
    - empty string (ASAP todos)
    - valid Date object
-------------------------------------- */
    if (formDate.length === 0) {
        // Blank date field -> ASAP todo, leave as-is.
        return formDate;
    }

    const [ year, month, day ] = formDate.split('/')
    const dateObj: Date = new Date( [year, month, day].join('-'));
    
    if (!dateObj.valueOf()) {
        // formDate not valid Date object.
        console.error("Date provided in Editor field is not valid.  YYYY/MM/DD or empty field accepted");
    }
    return dateObj;    
};

export interface EditorInputProps {
    id?: string,
    title: string,
    date: Date | string | undefined,
    tasks: string,
    completed?: boolean
};

type TasksValues = string[];

export interface EditorProps {
    
};

export default Editor;