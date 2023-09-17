import { 
    combineReducers,
    configureStore,
    PreloadedState,
    ThunkAction, 
    Action } from '@reduxjs/toolkit';
import todoReducer from '../features/Todo/todoSlice';


// Create the root reducer independently to obtain the RootState type.
const rootReducer = combineReducers({
    todo: todoReducer
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
};

export const store = configureStore({
    reducer: {
        todo: todoReducer
    }
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
