import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DEV_BACKEND } from '../../app/App';
import { setTodos, TodoProps, TodoType } from './todoSlice';
import TodoTask, { TodoTaskProps } from './TodoTask';
import todos from '../../utils/mockTodos.json';
import './Todo.css';


/* =====================================================================
    A main component - container for all the todos which are fetched 
    and generated on initial load.
===================================================================== */
const Todo: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const todoState = useAppSelector(state => state.todo);
    const showOnly: TodoProps['showOnly'] = todoState.showOnly;
    
    // Fetch todos on init render.
    useEffect(() => {
        if (todoState.status === 'uninitialized') {
            if (DEV_BACKEND === 'Off') {
                // for development only, mocked action to set state.
                dispatch(setTodos(todos));
            }
        }
    }, [todoState.status]);


    // Build list of TodoTask elements.
    let todoTaskElems: React.ReactElement<TodoTaskProps>[] = [];
    if (todoState.status === 'successful') {
        const todosToBuild: (TodoType[] | null)[]= [
            todoState.solid,
            todoState.red,
            todoState.amber,
            todoState.green,
            todoState.transparent
        ];

        for (let colorToBuild of todosToBuild) {
            if (colorToBuild === null) {
                continue;
            }

            const todoElemsOfColor = buildTodoTasks(colorToBuild);
            todoTaskElems = [...todoTaskElems, ...todoElemsOfColor];
        };
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
        'all': 'within 5 days',
        'solid': 'as soon as possible',
        'red': 'for today',
        'amber': 'for tomorrow',
        'green': 'in 2~3 days',
        'transparent': 'in 4 days'
    };

    return greetingsForColors[showOnly];
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
                key={ `key-task-${coloredTodo.color}_${coloredTodo.id}` }
            />
        );
        return todoTask;
    });
    return todoTasks;
};

export default Todo;