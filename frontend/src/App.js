import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import "react-toastify/ReactToastify.css";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Routes with Navbar */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
