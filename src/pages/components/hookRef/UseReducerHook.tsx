
import { useReducer } from 'react';

type ReducerAction = { type: 'increment' | 'decrement'; payload: number };

const reducer = (state: number, action: ReducerAction): number => {
    switch (action.type) {
        case 'increment': return state + action.payload;
        case 'decrement': return state - action.payload;
        default: return state;
    }
};

function UseReducerHook(): React.ReactElement {
    const [count, dispatch] = useReducer(reducer, 0);

    return (
        <div>
            useReducer Hook:
            <h3>Count: {count}</h3>
            <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => dispatch({ type: 'increment', payload: 1 })}
            >
                Increment
            </button>
            <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => dispatch({ type: 'decrement', payload: 1 })}
            >
                Decrement
            </button>
        </div>
    );
}

export default UseReducerHook;