import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '@/components/LoadingStates';
import BaseNavigation from '@pages/navigation/BaseNavigation';

const HomePage = lazy(() => import('../Home'));
const AboutPage = lazy(() => import('../About'));

const HooksNavigation = lazy(() => import('../navigation/HooksNavigation'));
const InvestmentNavigation = lazy(() => import('../navigation/InvestmentNavigation'));
const StockNavigation = lazy(() => import('../navigation/StockNavigation'));
const MutualFundNavigation = lazy(() => import('../navigation/MutualFundNavigation'));
const CommoditiesNavigation = lazy(() => import('../navigation/CommoditiesNavigation'));
const CalculatorNavigation = lazy(() => import('../navigation/CalculatorNavigation'));

const UseStateHook = lazy(() => import('../components/hookRef/UseStateHook'));
const UseEffectHook = lazy(() => import('../components/hookRef/UseEffectHook'));
const UseRefHook = lazy(() => import('../components/hookRef/UseRefHook'));
const UseReducerHook = lazy(() => import('../components/hookRef/UseReducerHook'));
const UseContextHook = lazy(() => import('../components/hookRef/UseContextHook'));
const UseCallbackHook = lazy(() => import('../components/hookRef/UseCallbackHook'));

const Bonds = lazy(() => import('../components/investment/bonds/Bonds'));
const BeforeStartingBondCheckList = lazy(
  () => import('../components/investment/bonds/before-starting/BeforeStartingBondCheckList'),
);
const BondCheckList = lazy(() => import('../components/investment/bonds/checklist/BondCheckList'));

const StockAnalysis = lazy(() => import('../components/investment/stock/analysis/Analysis'));
const StockResult = lazy(() => import('../components/investment/stock/analysis/zerodha/StockResult'));
const StockCheckList = lazy(() => import('../components/investment/stock/checklist/StockCheckList'));
const MyFavStocks = lazy(() => import('../components/investment/stock/favorites/MyFavStocks'));
const AverageCalculator = lazy(() => import('../components/investment/stock/average-calculator/AverageCalculator'));
const StockProfitCalculator = lazy(
  () => import('../components/investment/stock/profit-calculator/StockProfitCalculator'),
);
const MutualFundCalculator = lazy(() => import('../components/investment/mutual-fund/calculator/MutualFundCalculator'));
const MutualFundChecklist = lazy(() => import('../components/investment/mutual-fund/checklist/MutualFundChecklist'));
const GoldVsSilverRatio = lazy(
  () => import('../components/investment/commodities/gold-silver-ratio/GoldVsSilverRatio'),
);

const RouteFallback = (): React.ReactElement => <PageSkeleton />;

function Routing(): React.ReactElement {
  return (
    <BrowserRouter basename="/reactLearning">
      <BaseNavigation />
      <Suspense fallback={<RouteFallback />}>
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
              <Route path="average-calculator" element={<AverageCalculator />} />
              <Route path="profit-calculator" element={<StockProfitCalculator />} />
            </Route>
            <Route path="mutual-fund" element={<Outlet />}>
              <Route index element={<MutualFundNavigation />} />
              <Route path="checklist" element={<MutualFundChecklist />} />
              <Route path="calculator" element={<MutualFundCalculator />} />
            </Route>
            <Route path="bonds" element={<Outlet />}>
              <Route index element={<Bonds />} />
              <Route path="before-starting" element={<BeforeStartingBondCheckList />} />
              <Route path="checklist" element={<BondCheckList />} />
            </Route>
            <Route path="commodities" element={<Outlet />}>
              <Route index element={<CommoditiesNavigation />} />
              <Route path="gold-silver-ratio" element={<GoldVsSilverRatio />} />
            </Route>
            <Route path="calculator" element={<Outlet />}>
              <Route index element={<CalculatorNavigation />} />
              <Route path="stock-average" element={<AverageCalculator />} />
              <Route path="stock-profit" element={<StockProfitCalculator />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Routing;
