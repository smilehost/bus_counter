import React, { useState } from "react";

// ข้อมูลเว็บไซต์ในบริษัท
const companyWebsites = [
    {
        id: 1,
        name: "Bus Counter",
        description: "ระบบนับจำนวนผู้โดยสารด้วย AI และกล้อง CCTV ติดตามข้อมูลแบบ Real-time",
        icon: "🚌",
        url: "/login",
        color: "#1976D2",
        gradient: "linear-gradient(135deg, #1976D2 0%, #64B5F6 100%)",
        isInternal: true,
    },
    {
        id: 2,
        name: "Bus Ticket",
        description: "ระบบจำหน่ายตั๋วรถโดยสารออนไลน์ สะดวก รวดเร็ว ปลอดภัย",
        icon: "🎫",
        url: "https://busticket.example.com",
        color: "#7C3AED",
        gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
        isInternal: false,
    },
    {
        id: 3,
        name: "Fleet Management",
        description: "ระบบบริหารจัดการกองยานพาหนะ ติดตาม GPS และบำรุงรักษา",
        icon: "🗺️",
        url: "https://fleet.example.com",
        color: "#059669",
        gradient: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
        isInternal: false,
    },
    {
        id: 4,
        name: "Driver Portal",
        description: "ระบบจัดการพนักงานขับรถ ตารางเวลา และประสิทธิภาพการทำงาน",
        icon: "👨‍✈️",
        url: "https://driver.example.com",
        color: "#DC2626",
        gradient: "linear-gradient(135deg, #DC2626 0%, #F87171 100%)",
        isInternal: false,
    },
    {
        id: 5,
        name: "Revenue Analytics",
        description: "ระบบวิเคราะห์รายได้และสถิติธุรกิจ รายงานครบถ้วน",
        icon: "📊",
        url: "https://analytics.example.com",
        color: "#EA580C",
        gradient: "linear-gradient(135deg, #EA580C 0%, #FB923C 100%)",
        isInternal: false,
    },
    {
        id: 6,
        name: "Customer Support",
        description: "ศูนย์บริการลูกค้า ติดต่อสอบถาม และแจ้งปัญหา",
        icon: "📞",
        url: "https://support.example.com",
        color: "#0891B2",
        gradient: "linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)",
        isInternal: false,
    },
];

// Website Card Component
function WebsiteCard({ website, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={() => onClick(website)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "32px",
                minHeight: "180px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: isHovered
                    ? "0 16px 48px rgba(0, 0, 0, 0.12)"
                    : "0 2px 16px rgba(0, 0, 0, 0.06)",
                borderLeft: `4px solid ${website.color}`,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Title */}
            <h3
                style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    margin: "0 0 12px 0",
                    color: "#111827",
                    letterSpacing: "-0.3px",
                }}
            >
                {website.name}
            </h3>

            {/* Description */}
            <p
                style={{
                    color: "#6b7280",
                    lineHeight: "1.6",
                    fontSize: "15px",
                    margin: "0",
                    flex: 1,
                }}
            >
                {website.description}
            </p>

            {/* Divider */}
            <div
                style={{
                    height: "1px",
                    background: "#f3f4f6",
                    margin: "20px 0 16px 0",
                }}
            />

            {/* CTA Link */}
            <div
                style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: website.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "gap 0.2s ease",
                }}
            >
                <span>เข้าใช้งาน</span>
                <span
                    style={{
                        transition: "transform 0.2s ease",
                        transform: isHovered ? "translateX(4px)" : "translateX(0)",
                    }}
                >
                    →
                </span>
            </div>
        </div>
    );
}

// Modal Component
function WebsiteModal({ website, onClose, onGo }) {
    if (!website) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                animation: "fadeIn 0.3s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "40px",
                    maxWidth: "440px",
                    width: "90%",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
                    animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        color: "#6b7280",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "#f3f4f6";
                        e.target.style.color = "#1f2937";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "#ffffff";
                        e.target.style.color = "#6b7280";
                    }}
                >
                    ×
                </button>

                {/* Title */}
                <h2
                    style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        marginBottom: "12px",
                        color: "#1f2937",
                    }}
                >
                    {website.name}
                </h2>

                {/* Description */}
                <p
                    style={{
                        color: "#6b7280",
                        lineHeight: "1.7",
                        fontSize: "15px",
                        marginBottom: "28px",
                    }}
                >
                    {website.description}
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: "14px 20px",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            color: "#374151",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#ffffff";
                        }}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onGo(website)}
                        style={{
                            flex: 1,
                            padding: "16px 24px",
                            background: website.gradient,
                            border: "none",
                            borderRadius: "14px",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: `0 8px 25px ${website.color}50`,
                            transition: "all 0.3s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.02)";
                            e.target.style.boxShadow = `0 12px 35px ${website.color}60`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = `0 8px 25px ${website.color}50`;
                        }}
                    >
                        <span>Go</span>
                        <span style={{ fontSize: "18px" }}>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [selectedWebsite, setSelectedWebsite] = useState(null);

    const handleCardClick = (website) => {
        setSelectedWebsite(website);
    };

    const handleCloseModal = () => {
        setSelectedWebsite(null);
    };

    const handleGo = (website) => {
        if (website.isInternal) {
            window.location.href = website.url;
        } else {
            window.open(website.url, "_blank");
        }
        setSelectedWebsite(null);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0052CC 0%, #1E88E5 50%, #00BCD4 100%)",
                color: "white",
                fontFamily: "'Inter', sans-serif",
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
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.05); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
                        50% { box-shadow: 0 0 40px rgba(255,255,255,0.2); }
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
                    filter: "blur(100px)",
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

            {/* Navigation */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 48px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Logo */}
                <div>
                    <span
                        style={{
                            fontSize: "32px",
                            fontWeight: "800",
                            color: "#ffffff",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Bussing Center
                    </span>
                    <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", marginTop: "4px", letterSpacing: "0.5px" }}>
                        Transportation Solutions
                    </div>
                </div>

                {/* Contact */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <a
                        href="#contact"
                        style={{
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            padding: "10px 20px",
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        ติดต่อเรา
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "40px 48px 32px",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 18px",
                        borderRadius: "50px",
                        marginBottom: "24px",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#ffffff",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        animation: "pulse 2s infinite",
                    }} />
                    <span>ระบบบริหารจัดการขนส่งครบวงจร</span>
                </div>

                <h1
                    style={{
                        fontSize: "44px",
                        fontWeight: "800",
                        lineHeight: "1.15",
                        marginBottom: "16px",
                        color: "#ffffff",
                        letterSpacing: "-1px",
                    }}
                >
                    เลือกระบบที่ต้องการใช้งาน
                </h1>

                <p
                    style={{
                        fontSize: "17px",
                        color: "rgba(255, 255, 255, 0.85)",
                        lineHeight: "1.6",
                        maxWidth: "520px",
                        margin: "0 auto",
                    }}
                >
                    รวมทุกระบบบริหารจัดการขนส่งของบริษัทไว้ในที่เดียว เข้าถึงง่าย ใช้งานสะดวก
                </p>
            </section>

            {/* Website Cards Grid */}
            <section
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "16px 48px 80px",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {companyWebsites.map((website) => (
                        <WebsiteCard
                            key={website.id}
                            website={website}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "28px 48px",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "13px",
                    position: "relative",
                    background: "rgba(0, 0, 0, 0.1)",
                }}
            >
                <p>© 2024 SmileHost Transportation Solutions. All rights reserved.</p>
            </footer>

            {/* Modal */}
            <WebsiteModal
                website={selectedWebsite}
                onClose={handleCloseModal}
                onGo={handleGo}
            />
        </div>
    );
}
