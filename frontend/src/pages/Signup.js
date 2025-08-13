import React, { useState } from "react";
import "../App.css"; // Import custom CSS
import { ToastContainer } from "react-toastify";
import { handleSuccess } from '../utils.js'
import { handleError } from '../utils.js'
import { useNavigate } from "react-router-dom";

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo }
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;

        if (!name || !email || !password) {
            return handleError('Name, Email, and Password are required');
        }
        try {
            const url = 'http://localhost:8080/auth/signup';
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await response.json();
            const { success, msg, error } = result;

            if (success) {
                handleSuccess(msg || "Signup successful");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
            else if (error && error.details && error.details.length > 0) {
                handleError(error.details[0].msg || "Password length must be 4 Characters");
            }
            else {
                handleError(msg || "Email already Exist");
            }
        } catch (err) {
            handleError(err.message || "Network error occurred");
        }

    };


    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={signupInfo.name}
                        onChange={handleChange}
                        autoFocus
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={signupInfo.email}
                        onChange={handleChange}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={signupInfo.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Sign Up</button>
                </form>

                <p className="login-text">
                    Already have an account?{" "}
                    <a href="/login" className="login-link">
                        Login here
                    </a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
