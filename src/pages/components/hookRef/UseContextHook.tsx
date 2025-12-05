import { createContext, useContext } from "react";

const MyContext = createContext<{ test: string } | null>(null);

export default function UseContextHook() {

    return (
        <MyContext.Provider value={{ test: 'from Context' }}>
            <ChildComponent />
        </MyContext.Provider>
    );
}

function ChildComponent() {
    const contextValue = useContext(MyContext)
    return <>
        {contextValue ? `useContext Hook: ${contextValue.test}` : 'No Context Value'}
    </>;
}