import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import AboutPage from "../About";
import HomePage from "../Home";
import UseStateHook from "../components/hookRef/UseStateHook";
import BaseNavigation from "../navigation/BaseNavigation";
import HooksNavigation from "../navigation/HooksNavigation";
import UseEffectHook from "../components/hookRef/useEffectHook";
import StockResult from "../components/stock/StockResult";

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
            </Route>
            <Route path="/stock" element={<StockResult />} />
            <Route path="*" element={<Navigate to="/home" replace/>} />

        </Routes>
    </BrowserRouter>;
}

export default Routing;