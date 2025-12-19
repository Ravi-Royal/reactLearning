import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import AboutPage from "../About";
import HomePage from "../Home";
import UseCallbackHook from "../components/hookRef/UseCallbackHook";
import UseContextHook from "../components/hookRef/UseContextHook";
import UseEffectHook from "../components/hookRef/UseEffectHook";
import UseReducerHook from "../components/hookRef/UseReducerHook";
import UseRefHook from "../components/hookRef/UseRefHook";
import UseStateHook from "../components/hookRef/UseStateHook";
import Bonds from "../components/investment/bonds/Bonds";
import BeforeStartingBondCheckList from "../components/investment/bonds/before-starting/BeforeStartingBondCheckList";
import BondCheckList from "../components/investment/bonds/checklist/BondCheckList";
import StockAnalysis from "../components/investment/stock/analysis/Analysis";
import StockResult from "../components/investment/stock/analysis/zerodha/StockResult";
import StockCheckList from "../components/investment/stock/checklist/StockCheckList";
import MyFavStocks from "../components/investment/stock/favorites/MyFavStocks";
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
                    <Route path="analysis" element={<Outlet />}>
                        <Route index element={<StockAnalysis />} />
                        <Route path="zerodha" element={<StockResult />} />
                    </Route>
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