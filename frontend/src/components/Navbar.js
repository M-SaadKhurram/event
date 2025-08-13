import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const linkStyle = {
        color: "#fff",
        marginRight: "20px",
        fontSize: "18px",
        textDecoration: "none",
        transition: "color 0.3s"
    };

    const linkHover = (e, color) => (e.target.style.color = color);

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 40px",
                background: "#1e1e2f",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}
        >
            {/* Logo */}
            <div>
                <Link
                    to="/home"
                    style={{
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: "28px",
                        fontWeight: "bold",
                        letterSpacing: "1px"
                    }}
                >
                    MyApp
                </Link>
            </div>

            {/* Navigation Links */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link
                    to="/home"
                    style={linkStyle}
                    onMouseOver={(e) => linkHover(e, "#4fc3f7")}
                    onMouseOut={(e) => linkHover(e, "#fff")}
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    style={linkStyle}
                    onMouseOver={(e) => linkHover(e, "#4fc3f7")}
                    onMouseOut={(e) => linkHover(e, "#fff")}
                >
                    About
                </Link>
                <Link
                    to="/contact"
                    style={linkStyle}
                    onMouseOver={(e) => linkHover(e, "#4fc3f7")}
                    onMouseOut={(e) => linkHover(e, "#fff")}
                >
                    Contact
                </Link>
                {token && (
                    <Link
                        to="/profile"
                        style={linkStyle}
                        onMouseOver={(e) => linkHover(e, "#4fc3f7")}
                        onMouseOut={(e) => linkHover(e, "#fff")}
                    >
                        Profile
                    </Link>
                )}
            </div>

            {/* Auth Section */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {token ? (
                    <>
                        <span style={{ marginRight: "15px", fontSize: "18px" }}>
                            Hi, {userName}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "#e53935",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                cursor: "pointer",
                                transition: "background 0.3s"
                            }}
                            onMouseOver={(e) => (e.target.style.background = "#c62828")}
                            onMouseOut={(e) => (e.target.style.background = "#e53935")}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                ...linkStyle,
                                marginRight: "15px"
                            }}
                            onMouseOver={(e) => linkHover(e, "#4fc3f7")}
                            onMouseOut={(e) => linkHover(e, "#fff")}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            style={{
                                background: "#4fc3f7",
                                color: "#1e1e2f",
                                padding: "8px 16px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textDecoration: "none",
                                transition: "background 0.3s"
                            }}
                            onMouseOver={(e) => (e.target.style.background = "#29b6f6")}
                            onMouseOut={(e) => (e.target.style.background = "#4fc3f7")}
                        >
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
