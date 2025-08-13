import React, { useState } from "react";
import "../App.css";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from '../utils.js';
import { handleError } from '../utils.js';
import { useNavigate } from "react-router-dom";

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        if (!email || !password) {
            return handleError("Email and Password are required");
        }

        try {
            const url = "http://localhost:8080/auth/login";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();
            const { success, msg, error, token, user } = result;
            if (success) {
                handleSuccess(msg || "Login successful");

                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userName", user?.name); // match Home.jsx
                }

                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            }

            else if (error && error.details && error.details.length > 0) {
                handleError(error.details[0].msg || "Invalid credentials");
            }
            else {
                handleError(msg || "Login failed");
            }
        } catch (err) {
            handleError(err.message || "Network error occurred");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginInfo.email}
                        onChange={handleChange}
                        autoFocus
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={loginInfo.password}
                        onChange={handleChange}
                    />

                    <button type="submit">Login</button>
                </form>

                <p className="login-text">
                    Don't have an account?{" "}
                    <a href="/signup" className="login-link">
                        Sign up here
                    </a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
