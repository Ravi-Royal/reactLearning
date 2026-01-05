/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useState } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';

function UseRefHook() {
  const [count, setCount] = useState(0);
  const previousCount = useRef<number>(0);
  const [, setDummy] = useState(0);

  console.warn('use ref hooks function component called', count);

  useEffect(() => {
    console.warn('use ref useEffect called', count);
    previousCount.current = count;
  }, [count]);

  console.warn('before return');
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">useRef Hook Page</h2>

        <div className="mb-6 p-4 sm:p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h3 className="font-semibold text-yellow-800 mb-3 text-base sm:text-lg">Why previousCount.current appears "one value behind":</h3>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 sm:space-y-3">
            <div>
              <strong className="block mb-1">React's Render Cycle Behavior:</strong>
              <ol className="list-decimal list-inside mt-2 ml-2 sm:ml-4 space-y-1 sm:space-y-2">
                <li>When you click "Increment Count":</li>
                <ul className="list-disc list-inside ml-4 sm:ml-8 space-y-1 mt-1">
                  <li>setCount updates the state</li>
                  <li>Component re-renders immediately with the new count value</li>
                  <li>During this render, previousCount.current still holds the old value</li>
                  <li>Only after the render completes does useEffect run and update previousCount.current</li>
                </ul>
              </ol>
            </div>

            <div>
              <strong className="block mb-1">Example Timeline:</strong>
              <ul className="list-disc list-inside mt-2 ml-2 sm:ml-4 space-y-1">
                <li>Render 1: count = 0, previousCount.current = 0 → Shows "Current: 0, Previous: 0"</li>
                <li>Click Increment → count becomes 1</li>
                <li>Render 2: count = 1, previousCount.current = 0 (still old) → Shows "Current: 1, Previous: 0"</li>
                <li>After Render 2: useEffect runs → previousCount.current = 1</li>
                <li>Next Click → count becomes 2</li>
                <li>Render 3: count = 2, previousCount.current = 1 → Shows "Current: 2, Previous: 1"</li>
              </ul>
            </div>

            <div className="mt-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded">
              <strong className="block mb-1">Key Insight:</strong>
              <span className="block">This is the CORRECT behavior for useRef - it tracks values across renders without causing re-renders. The "one behind" behavior is exactly what makes it useful for comparing current vs previous states.</span>
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-100 rounded-lg space-y-2">
          <p className="text-sm sm:text-base">Current Count: <span className="font-bold text-blue-600 text-lg sm:text-xl">{count}</span></p>
          <p className="text-sm sm:text-base">Previous Count: <span className="font-bold text-purple-600 text-lg sm:text-xl">{previousCount ? previousCount!.current : 'N/A'}</span></p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors"
            onClick={() => setCount((prevCount) => prevCount + 1)}
          >
            Increment Count
          </button>
          <button
            className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-colors"
            onClick={() => setCount(0)}
          >
            Reset Count
          </button>
          <button
            className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors"
            onClick={() => console.warn('Current Count:', count, 'Previous Count:', previousCount.current)}
          >
            Console use Ref
          </button>
          <button
            className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded text-xs sm:text-sm hover:bg-purple-700 transition-colors"
            onClick={() => setDummy((d) => d + 1)}
          >
            Force Re-render
          </button>
        </div>
      </div>
    </div>
  );
}

export default UseRefHook;