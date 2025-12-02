import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "../pages/About";
import HomePage from "../pages/Home";
import UseStateHook from "../pages/hookRef/UseStateHook";
import BaseNavigation from "../pages/navigation/BaseNavigation";
import HooksNavigation from "../pages/navigation/HooksNavigation";

function Routing() {
    return <BrowserRouter>
        <BaseNavigation />
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hooks" element={<HooksNavigation />} >
                <Route path="useState" element={<UseStateHook />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" />} />

        </Routes>
    </BrowserRouter>;
}

export default Routing;