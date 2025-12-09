import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
                color: "white",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Navigation */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 40px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                        >
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="6" cy="18" r="2" />
                            <circle cx="18" cy="18" r="2" />
                        </svg>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: "700" }}>Bus Counter</span>
                </div>

                {/* Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                    <a href="#features" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "15px" }}>
                        คุณสมบัติ
                    </a>
                    <a href="#about" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "15px" }}>
                        เกี่ยวกับ
                    </a>
                    <Link
                        to="/login"
                        style={{
                            padding: "10px 24px",
                            background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                            borderRadius: "10px",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "15px",
                            boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                            transition: "all 0.3s",
                        }}
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "80px 40px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "60px",
                    alignItems: "center",
                }}
            >
                {/* Left Content */}
                <div>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            background: "rgba(25, 118, 210, 0.2)",
                            borderRadius: "50px",
                            marginBottom: "24px",
                            fontSize: "14px",
                            color: "#64B5F6",
                        }}
                    >
                        <span>🚀</span>
                        <span>ระบบนับผู้โดยสารอัจฉริยะ</span>
                    </div>

                    <h1
                        style={{
                            fontSize: "56px",
                            fontWeight: "800",
                            lineHeight: "1.1",
                            marginBottom: "24px",
                            background: "linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        นับจำนวนผู้โดยสาร
                        <br />
                        <span style={{ color: "#64B5F6", WebkitTextFillColor: "#64B5F6" }}>
                            อัตโนมัติ
                        </span>
                    </h1>

                    <p
                        style={{
                            fontSize: "18px",
                            color: "#94a3b8",
                            lineHeight: "1.7",
                            marginBottom: "40px",
                            maxWidth: "500px",
                        }}
                    >
                        ระบบนับจำนวนผู้โดยสารด้วย AI และกล้อง CCTV
                        ช่วยให้การบริหารจัดการรถโดยสารเป็นเรื่องง่าย
                        ติดตามข้อมูลแบบ Real-time
                    </p>

                    <div style={{ display: "flex", gap: "16px" }}>
                        <Link
                            to="/login"
                            style={{
                                padding: "16px 32px",
                                background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                                borderRadius: "12px",
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "16px",
                                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
                                transition: "all 0.3s",
                            }}
                        >
                            เริ่มต้นใช้งาน
                        </Link>
                        <button
                            style={{
                                padding: "16px 32px",
                                background: "transparent",
                                border: "2px solid #475569",
                                borderRadius: "12px",
                                color: "white",
                                fontWeight: "600",
                                fontSize: "16px",
                                cursor: "pointer",
                                transition: "all 0.3s",
                            }}
                        >
                            ดูเพิ่มเติม →
                        </button>
                    </div>
                </div>

                {/* Right Content - Dashboard Preview */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(100, 181, 246, 0.1) 100%)",
                        borderRadius: "24px",
                        padding: "40px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <div
                        style={{
                            background: "rgba(30, 41, 59, 0.8)",
                            borderRadius: "16px",
                            padding: "24px",
                            marginBottom: "16px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <span style={{ color: "#94a3b8", fontSize: "14px" }}>ผู้โดยสารวันนี้</span>
                            <span style={{ color: "#22c55e", fontSize: "12px" }}>+12.5%</span>
                        </div>
                        <div style={{ fontSize: "36px", fontWeight: "700" }}>1,234</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                borderRadius: "12px",
                                padding: "16px",
                            }}
                        >
                            <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}>กล้องออนไลน์</div>
                            <div style={{ fontSize: "24px", fontWeight: "600", color: "#22c55e" }}>6</div>
                        </div>
                        <div
                            style={{
                                background: "rgba(30, 41, 59, 0.8)",
                                borderRadius: "12px",
                                padding: "16px",
                            }}
                        >
                            <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}>เส้นทาง</div>
                            <div style={{ fontSize: "24px", fontWeight: "600" }}>4</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "700", marginBottom: "60px" }}>
                    คุณสมบัติเด่น
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
                    {[
                        { icon: "📹", title: "AI Camera", desc: "ระบบกล้อง AI นับผู้โดยสารอัตโนมัติ แม่นยำสูง" },
                        { icon: "📊", title: "Real-time Data", desc: "ดูข้อมูลแบบเรียลไทม์ ผ่าน Dashboard ที่ใช้งานง่าย" },
                        { icon: "🔔", title: "Alert System", desc: "แจ้งเตือนเมื่อมีเหตุการณ์สำคัญหรือผิดปกติ" },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "32px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                transition: "all 0.3s",
                            }}
                        >
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    background: "linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px",
                                    marginBottom: "20px",
                                }}
                            >
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>{feature.title}</h3>
                            <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "14px",
                }}
            >
                <p>© 2024 Bus Counter System. All rights reserved.</p>
            </footer>
        </div>
    );
}
