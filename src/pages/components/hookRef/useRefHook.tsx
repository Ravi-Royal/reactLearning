/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useState } from "react";

function useRefHook() {
    const [count, setCount] = useState(0);
    const previousCount = useRef<number>(0);
    const [, setDummy] = useState(0);

    console.log('use ref hooks function component called', count);

    useEffect(() => {
        console.log('use ref useEffect called', count);
        previousCount.current = count;
    }, [count]);

    console.log('before return');
    return (
        <div>
            <h2 className="mb-4">useRef Hook Page</h2>
            
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Why previousCount.current appears "one value behind":</h3>
                <div className="text-sm text-gray-700 space-y-2">
                    <div>
                        <strong>React's Render Cycle Behavior:</strong>
                        <ol className="list-decimal list-inside mt-1 ml-4 space-y-1">
                            <li>When you click "Increment Count":</li>
                            <ul className="list-disc list-inside ml-8 space-y-1">
                                <li>setCount updates the state</li>
                                <li>Component re-renders immediately with the new count value</li>
                                <li>During this render, previousCount.current still holds the old value</li>
                                <li>Only after the render completes does useEffect run and update previousCount.current</li>
                            </ul>
                        </ol>
                    </div>
                    
                    <div>
                        <strong>Example Timeline:</strong>
                        <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                            <li>Render 1: count = 0, previousCount.current = 0 → Shows "Current: 0, Previous: 0"</li>
                            <li>Click Increment → count becomes 1</li>
                            <li>Render 2: count = 1, previousCount.current = 0 (still old) → Shows "Current: 1, Previous: 0"</li>
                            <li>After Render 2: useEffect runs → previousCount.current = 1</li>
                            <li>Next Click → count becomes 2</li>
                            <li>Render 3: count = 2, previousCount.current = 1 → Shows "Current: 2, Previous: 1"</li>
                        </ul>
                    </div>
                    
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                        <strong>Key Insight:</strong> This is the CORRECT behavior for useRef - it tracks values across renders without causing re-renders. The "one behind" behavior is exactly what makes it useful for comparing current vs previous states.
                    </div>
                </div>
            </div>
            
            <div>
                <p>Current Count: {count}</p>
                <p>Previous Count: {previousCount ? previousCount!.current : 'N/A'}
                </p>
            </div>
            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setCount((prevCount) => prevCount + 1)}>Increment Count</button>
            <button className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={() => setCount(0)}>Reset Count</button>
            <button className="ml-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-700" onClick={() => console.log('Current Count:', count, 'Previous Count:', previousCount.current)}>Console use Ref</button>
            <button className="ml-2 p-2 bg-purple-500 text-white rounded hover:bg-purple-700" onClick={() => setDummy((d) => d + 1)}>Force Re-render</button>
        </div>
    );
}

export default useRefHook;