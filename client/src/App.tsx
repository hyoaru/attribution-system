import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Result from "./pages/Result";
import { Toaster } from "./components/ui/toaster";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/page" element={<Dashboard />} />
                <Route path="/result" element={<Result />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
