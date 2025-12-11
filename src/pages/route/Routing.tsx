import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import AboutPage from "../About";
import HomePage from "../Home";
import UseCallbackHook from "../components/hookRef/UseCallbackHook";
import UseContextHook from "../components/hookRef/UseContextHook";
import UseEffectHook from "../components/hookRef/UseEffectHook";
import UseReducerHook from "../components/hookRef/UseReducerHook";
import UseRefHook from "../components/hookRef/UseRefHook";
import UseStateHook from "../components/hookRef/UseStateHook";
import MyFavList from "../components/stock/MyFavList";
import StockResult from "../components/stock/excelBasedResult/StockResult";
import StockCheckList from "../components/stock/stockChecklist/StockCheckList";
import BaseNavigation from "../navigation/BaseNavigation";
import HooksNavigation from "../navigation/HooksNavigation";
import StockNavigation from "../navigation/StockNavigation";

function Routing() {
    return <BrowserRouter>
        <BaseNavigation />
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hooks" element={<Outlet />}>
                <Route index element={<HooksNavigation />} />
                <Route path="useState" element={<UseStateHook />} />
                <Route path="useEffect" element={<UseEffectHook />} />
                <Route path="useRef" element={<UseRefHook />} />
                <Route path="useReducer" element={<UseReducerHook />} />
                <Route path="useContext" element={<UseContextHook />} />
                <Route path="useCallback" element={<UseCallbackHook />} />
            </Route>
            <Route path="/stock" element={<Outlet />}>
                <Route index element={<StockNavigation />} />
                <Route path="analysis" element={<StockResult />} />
                <Route path="favorites" element={<MyFavList />} />
                <Route path="checklist" element={<StockCheckList />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
    </BrowserRouter>;
}

export default Routing;