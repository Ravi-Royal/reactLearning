import { createContext, useContext } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';

const MyContext = createContext<{ test: string } | null>(null);

export default function UseContextHook() {

  return (
    <MyContext.Provider value={{ test: 'from Context' }}>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">useContext Hook</h2>
          <ChildComponent />
        </div>
      </div>
    </MyContext.Provider>
  );
}

function ChildComponent() {
  const contextValue = useContext(MyContext);
  return (
    <div className="p-4 sm:p-6 bg-gray-100 rounded-lg">
      <p className="text-sm sm:text-base text-gray-700">
        {contextValue ? (
          <>
            <span className="font-semibold">Context Value: </span>
            <span className="font-bold text-blue-600">{contextValue.test}</span>
          </>
        ) : (
          'No Context Value'
        )}
      </p>
    </div>
  );
}