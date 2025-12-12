import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useSnackbar } from "notistack";

export default function LoginPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const authLogin = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Map role string to number for ProtectedRoute
    const roleMap = {
        admin: 1,
        user: 2,
        viewer: 3,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock login - just call the endpoint, no credentials needed
            const response = await login();

            // Backend returns { success: true, data: { token: "..." } }
            const token = response.data?.token || response.token;

            // User data from backend payload: { user, com_id, role }
            // role comes as string "admin", need to convert to number
            const backendRole = "admin"; // This comes from token payload

            const user = {
                id: 1,
                name: "artijom",
                com_id: 1,
                role: roleMap[backendRole] || 1, // Convert "admin" -> 1
            };

            // Store token and user in auth store + localStorage
            authLogin(token, user);

            enqueueSnackbar("Login successful!", { variant: "success" });
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            enqueueSnackbar(message, { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #0052CC 0%, #1E88E5 50%, #00BCD4 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* CSS Animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>

            {/* Background decorations */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "5%",
                    width: "400px",
                    height: "400px",
                    background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                    borderRadius: "50%",
                    opacity: 0.05,
                    filter: "blur(60px)",
                    animation: "pulse 8s infinite",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "5%",
                    width: "500px",
                    height: "500px",
                    background: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                    borderRadius: "50%",
                    opacity: 0.05,
                    filter: "blur(100px)",
                    animation: "pulse 10s infinite 2s",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "420px",
                    background: "rgba(255, 255, 255, 0.98)",
                    borderRadius: "20px",
                    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
                    padding: "0",
                    overflow: "hidden",
                    animation: "slideUp 0.6s ease-out",
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
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "white",
                            background: isLoading
                                ? "linear-gradient(135deg, #90CAF9 0%, #90CAF9 100%)"
                                : "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
                            borderRadius: "12px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.3s",
                            boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(25, 118, 210, 0.5)";
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(25, 118, 210, 0.4)";
                        }}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    style={{ animation: "spin 1s linear infinite", width: 20, height: 20 }}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>
            </div>
        </div>
    );
}
