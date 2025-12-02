import { useState } from "react";

function UseStateHook() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">useState Hook Example</h1>
            <p className="mb-4">Current Count: {count}</p>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleClick}
            >
                Increment
            </button>
        </div>
    );
}

export default UseStateHook;