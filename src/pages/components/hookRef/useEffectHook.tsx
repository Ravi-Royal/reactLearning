import { useEffect, useState } from "react";

function UseEffectHook() {

    const [count, setCount] = useState(0);
    const [timerstarted, setTimerStarted] = useState(false);

    useEffect(() => {
        // Side effect logic here
        if (timerstarted) {
            const intervalRef = setInterval(() => {
                console.log('set timeout called');
                setCount((prevCount) => prevCount + 1);
            }, 1000);

            // Cleanup function
            return () => {
                clearInterval(intervalRef);
            };
        }
    }, [timerstarted]);

    return (
        <div>
            <h2 className="mb-4">useEffect Hook Page</h2>

            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setTimerStarted((prevValue) => !prevValue)}>Toggle Timer</button>
            <div>
                current timer status : {timerstarted ? 'Started' : 'Stopped'}
            </div>
            <div className="mt-4">
                count : {count}
            </div>
        </div>
    )
}

export default UseEffectHook;