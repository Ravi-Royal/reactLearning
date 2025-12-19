import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import AboutPage from "../About";
import HomePage from "../Home";
import Bonds from "../components/bonds/Bonds";
import BeforeStartingBondCheckList from "../components/bonds/beforeStartingBondChecklist/BeforeStartingBondCheckList";
import BondCheckList from "../components/bonds/bondChecklist/BondCheckList";
import UseCallbackHook from "../components/hookRef/UseCallbackHook";
import UseContextHook from "../components/hookRef/UseContextHook";
import UseEffectHook from "../components/hookRef/UseEffectHook";
import UseReducerHook from "../components/hookRef/UseReducerHook";
import UseRefHook from "../components/hookRef/UseRefHook";
import UseStateHook from "../components/hookRef/UseStateHook";
import MyFavStocks from "../components/investment/MyFavStocks";
import StockCheckList from "../components/investment/StockCheckList";
import StockResult from "../components/investment/StockResult";
import BaseNavigation from "../navigation/BaseNavigation";
import HooksNavigation from "../navigation/HooksNavigation";
import InvestmentNavigation from "../navigation/InvestmentNavigation";
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
            <Route path="/investment" element={<Outlet />}>
                <Route index element={<InvestmentNavigation />} />
                <Route path="stock" element={<Outlet />}>
                    <Route index element={<StockNavigation />} />
                    <Route path="analysis" element={<StockResult />} />
                    <Route path="favorites" element={<MyFavStocks />} />
                    <Route path="checklist" element={<StockCheckList />} />
                </Route>
                <Route path="bonds" element={<Outlet />}>
                    <Route index element={<Bonds />} />
                    <Route path="before-starting" element={<BeforeStartingBondCheckList />} />
                    <Route path="checklist" element={<BondCheckList />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
    </BrowserRouter>;
}

export default Routing;