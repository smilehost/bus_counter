import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted:", formData);
        // TODO: Implement actual login logic
        navigate("/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "0 20px 60px rgba(25, 118, 210, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08)",
                    padding: "0",
                    overflow: "hidden",
                }}
            >
                {/* Header with Gradient Background */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)",
                        padding: "40px 40px 48px 40px",
                        textAlign: "center",
                    }}
                >
                    {/* Circular Ring Icon */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            border: "4px solid rgba(255, 255, 255, 0.9)",
                            borderRadius: "50%",
                            margin: "0 auto 20px auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                border: "3px solid rgba(255, 255, 255, 0.5)",
                                borderRadius: "50%",
                            }}
                        />
                    </div>

                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "white",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Bussing Authen Center
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px", margin: 0 }}>
                        Log in to access your account
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ padding: "32px 40px 40px 40px" }}>
                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "8px",
                            }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                fontSize: "15px",
                                border: "2px solid #e2e8f0",
                                borderRadius: "12px",
                                outline: "none",
                                transition: "all 0.2s",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#1976D2")}
                            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "8px",
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px 48px 14px 16px",
                                    fontSize: "15px",
                                    border: "2px solid #e2e8f0",
                                    borderRadius: "12px",
                                    outline: "none",
                                    transition: "all 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#1976D2")}
                                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#64748b",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "white",
                            background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(25, 118, 210, 0.5)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(25, 118, 210, 0.4)";
                        }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
