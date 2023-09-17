import {
    useState,
    useEffect,
    useRef
} from 'react';
import { 
    TypedUseSelectorHook, 
    useDispatch, 
    useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* -----------------------------------------------
    Throttling hook to filter rapid-fire events.
----------------------------------------------- */
export function useThrottleCallback<A extends any[]>(
    callback: (...args: A) => void, delayMs: number) {
    // Track delay state and args on repeated calls.
    const [ shouldDelayCall, setShouldDelayCall ] = useState<boolean>();
    const argsRef = useRef<A>();

    useEffect(() => {
        setShouldDelayCall(false);
        
        // Cleanup on unmount.
        return () => setShouldDelayCall(undefined);
    }, []);

    return (...args: A) => {
        // Get current args.
        argsRef.current = args;

        // Ignore call if timeout hasn't passed.
        if (shouldDelayCall) {
            return;
        }

        // Immediately call the function.
        callback(...argsRef.current);
        // Delay subsequent calls if timeout hasn't passed. 
        setShouldDelayCall(true);

        setTimeout(() => {
            setShouldDelayCall(false);
            callback(...args);
        }, delayMs);
    };
}