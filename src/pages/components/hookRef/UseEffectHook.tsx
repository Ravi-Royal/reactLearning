import { useEffect, useState } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';
import { logger } from '../../../utils/logger';

function UseEffectHook() {
  const [count, setCount] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    logger.info('useEffect called');
    // Side effect logic here
    if (timerStarted) {
      const intervalRef = setInterval(() => {
        logger.info('set timeout called');
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      // Cleanup function
      return () => {
        clearInterval(intervalRef);
      };
    }
  }, [timerStarted]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">useEffect Hook Page</h2>

        <button
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded text-sm sm:text-base hover:bg-blue-700 transition-colors"
          onClick={() => setTimerStarted((prevValue) => !prevValue)}
        >
          {timerStarted ? 'Stop Timer' : 'Start Timer'}
        </button>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <span className="text-sm sm:text-base text-gray-700">Count: </span>
          <span className="font-bold text-blue-600 text-lg sm:text-xl">{count}</span>
        </div>

        <button
          className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded text-sm sm:text-base hover:bg-green-700 transition-colors"
          onClick={() => setCount(0)}
        >
          Reset Count
        </button>
      </div>
    </div>
  );
}

export default UseEffectHook;
