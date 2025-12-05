import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import AboutPage from "../About";
import HomePage from "../Home";
import UseStateHook from "../components/hookRef/UseStateHook";
import BaseNavigation from "../navigation/BaseNavigation";
import HooksNavigation from "../navigation/HooksNavigation";
import StockNavigation from "../navigation/StockNavigation";
import UseEffectHook from "../components/hookRef/useEffectHook";
import StockResult from "../components/stock/StockResult";
import MyFavList from "../components/stock/MyFavList";
import UseRefHook from "../components/hookRef/useRefHook";
import UseReducerHook from "../components/hookRef/UseReducerHook";

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
            </Route>
            <Route path="/stock" element={<Outlet />}>
                <Route index element={<StockNavigation />} />
                <Route path="analysis" element={<StockResult />} />
                <Route path="favorites" element={<MyFavList />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace/>} />

        </Routes>
    </BrowserRouter>;
}

export default Routing;