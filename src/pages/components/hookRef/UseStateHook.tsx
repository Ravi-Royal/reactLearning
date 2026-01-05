import { useState } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';

function UseStateHook(): React.ReactElement {
  const [count, setCount] = useState<number>(0);

  const handleClick = (): void => {
    setCount(count + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">useState Hook Example</h1>
        <p className="mb-4 text-sm sm:text-base text-gray-700">Current Count: <span className="font-bold text-blue-600 text-lg sm:text-xl">{count}</span></p>
        <button
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded text-sm sm:text-base hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export default UseStateHook;