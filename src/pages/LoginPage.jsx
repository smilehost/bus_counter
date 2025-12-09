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
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "24px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    padding: "48px 40px",
                    backdropFilter: "blur(10px)",
                }}
            >
                {/* Logo / Brand */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px",
                            boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)",
                        }}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="6" cy="18" r="2" />
                            <circle cx="18" cy="18" r="2" />
                        </svg>
                    </div>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#1e293b",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Bus Counter
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                        ระบบนับจำนวนผู้โดยสาร
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
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
                            อีเมล
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
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
                            รหัสผ่าน
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
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
                                }}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                            fontSize: "14px",
                        }}
                    >
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                            <span style={{ color: "#64748b" }}>จดจำฉัน</span>
                        </label>
                        <a href="#" style={{ color: "#1976D2", textDecoration: "none", fontWeight: "500" }}>
                            ลืมรหัสผ่าน?
                        </a>
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
                        เข้าสู่ระบบ
                    </button>
                </form>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "28px 0",
                        gap: "16px",
                    }}
                >
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>หรือ</span>
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                </div>

                {/* Back to Landing */}
                <div style={{ textAlign: "center" }}>
                    <Link
                        to="/landing"
                        style={{
                            color: "#64748b",
                            fontSize: "14px",
                            textDecoration: "none",
                        }}
                    >
                        กลับไปหน้าหลัก{" "}
                        <span style={{ color: "#1976D2", fontWeight: "500" }}>Landing Page →</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
