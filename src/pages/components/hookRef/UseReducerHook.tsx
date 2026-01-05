
import { useReducer } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';

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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">useReducer Hook</h2>
        <h3 className="text-lg sm:text-xl mb-4">Count: <span className="font-bold text-blue-600">{count}</span></h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-blue-600 transition-colors"
            onClick={() => dispatch({ type: 'increment', payload: 1 })}
          >
            Increment
          </button>
          <button
            className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-red-600 transition-colors"
            onClick={() => dispatch({ type: 'decrement', payload: 1 })}
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
}

export default UseReducerHook;