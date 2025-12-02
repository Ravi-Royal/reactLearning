import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import Navigation from "../pages/Navigation";

function Routing() {
    return <BrowserRouter>
        <Navigation />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* <Route path="/contact" element={<ContactPage />} /> */}
        </Routes>
    </BrowserRouter>;
}

export default Routing;