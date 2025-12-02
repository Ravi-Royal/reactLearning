import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import Navigation from "../pages/navigation/Navigation";

function Routing() {
    return <BrowserRouter>
        <Navigation />
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </BrowserRouter>;
}

export default Routing;