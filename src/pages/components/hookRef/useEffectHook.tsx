import { useEffect, useState } from "react";

function UseEffectHook() {

    const [count, setCount] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        // Side effect logic here
        if (timerStarted) {
            const intervalRef = setInterval(() => {
                console.log('set timeout called');
                setCount((prevCount) => prevCount + 1);
            }, 1000);

            // Cleanup function
            return () => {
                clearInterval(intervalRef);
            };
        }
    }, [timerStarted]);

    return (
        <div>
            <h2 className="mb-4">useEffect Hook Page</h2>

            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setTimerStarted((prevValue) => !prevValue)}>{timerStarted ? 'Stop Timer' : 'Start Timer'}</button>

            <div className="mt-4">
                count : {count}
            </div>
        </div>
    )
}

export default UseEffectHook;