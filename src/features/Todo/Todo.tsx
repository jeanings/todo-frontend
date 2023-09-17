import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
    getTodos,
    TodoProps, 
    TodoType } from './todoSlice';
import TodoTask, { TodoTaskProps } from './TodoTask';
import './Todo.css';


/* =====================================================================
    A main component - container for all the todos which are fetched 
    and generated on initial load.
===================================================================== */
const Todo: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const todoState = useAppSelector(state => state.todo);
    const todos = todoState.todos;
    const showOnly: TodoProps['showOnly'] = todoState.showOnly;
    
    // Fetch todos on init render.
    useEffect(() => {
        if (todoState.status === 'uninitialized') {
            dispatch(getTodos({}));
        }
    }, []);


    // Build list of TodoTask elements.
    let todoTaskElems: React.ReactElement<TodoTaskProps>[] = [];
    if (todoState.status === 'successful' && todos) {
        const todosToBuild: TodoType[] = findTodosOfColor(todos, showOnly);
        todoTaskElems = buildTodoTasks(todosToBuild);
    }


    return (
        <div className="Todo"
            role="main"
            aria-label="todo tasks container">
            
            <h1 className="Todo__greet"
                role="heading"
                aria-label="todo greeter">
                {/* Dynamically change greeting based on selected 'color' */}
                { "ToDos" + " " + getGreeting(showOnly) }
            </h1>
        
            {/* Render list of todo item components */}
            <div className="Todo__tasks"
                role="list"
                aria-label="todo tasks list container">
                { todoTaskElems }
            </div>
                
          
        </div>
    );
}


export const getGreeting = (showOnly: TodoProps['showOnly']): string => {
    /* ------------------------------------------------------
        Helper to dynamically change heading text
        based on <todo.showOnly> state.
    ------------------------------------------------------ */
    const greetingsForColors = {
        'all': 'for the week, rolling',
        'solid': 'as soon as possible',
        'red': 'for today',
        'amber': 'for tomorrow',
        'green': 'in 2~3 days',
        'transparent': 'in 4 days',
        'blank': 'further out, 5+ days'
    };

    return greetingsForColors[showOnly];
};



const findTodosOfColor = (todosOfColor: TodoType[], targetColor: TodoProps['showOnly']): TodoType[] => {
    let foundTodosOfColor: TodoType[] = [];
    
    if (targetColor === 'all') {
        foundTodosOfColor = todosOfColor.filter((todo: TodoType) => {
            let result: boolean = false;
            switch (todo.color) {
                case 'grey':
                    break;
                case 'blank':
                    break;
                default:
                    result = true;
            }
            return result;
        });
    }
    else {
        foundTodosOfColor = todosOfColor.filter((todo: TodoType) => {
            return todo.color === targetColor;
        });
    }
    
    return foundTodosOfColor;
};



const buildTodoTasks = (todosOfColor: TodoType[]): React.ReactElement<TodoTaskProps>[] => {
    /* ------------------------------------------------------
        Helper to build TodoTask components for every todo in
        each 'color' lists in <todo>.
    ------------------------------------------------------ */
    // Build TodoTasks.
    let todoTasks: React.ReactElement<TodoTaskProps>[]= [];
    todoTasks = todosOfColor.map((coloredTodo: TodoType) => {
        const baseClassName: string = "Todo__tasks-" + coloredTodo.color;
        
        const todoTask: React.ReactElement<TodoTaskProps> = (
            <TodoTask 
                baseClassname={ baseClassName }
                id={ coloredTodo.id }
                color={ coloredTodo.color }
                title={ coloredTodo.title }
                date={ coloredTodo.date }
                tasks={ coloredTodo.tasks }
                completed={ coloredTodo.completed }
                key={ `key-task-${coloredTodo.color}_${coloredTodo.id}` }
            />
        );
        return todoTask;
    });
    return todoTasks;
};

export default Todo;