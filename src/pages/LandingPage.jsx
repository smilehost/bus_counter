import React, { useState } from "react";

// ข้อมูลเว็บไซต์ในบริษัท
const companyWebsites = [
    {
        id: 1,
        name: "Bus Counter",
        description: "ระบบนับจำนวนผู้โดยสารด้วย AI และกล้อง CCTV ติดตามข้อมูลแบบ Real-time",
        icon: "🚌",
        url: "/",
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
            className="bg-white rounded-xl p-6 md:p-8 min-h-[180px] cursor-pointer flex flex-col transition-all duration-300 relative overflow-hidden"
            style={{
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: isHovered
                    ? "0 16px 48px rgba(0, 0, 0, 0.12)"
                    : "0 2px 16px rgba(0, 0, 0, 0.06)",
                borderLeft: `4px solid ${website.color}`,
            }}
        >
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 tracking-tight">
                {website.name}
            </h3>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed text-sm md:text-[15px] mb-0 flex-1">
                {website.description}
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-5" />

            {/* CTA Link */}
            <div
                className="text-sm font-semibold flex items-center gap-1.5 transition-all duration-200"
                style={{ color: website.color }}
            >
                <span>เข้าใช้งาน</span>
                <span
                    className="transition-transform duration-200"
                    style={{
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease]"
            style={{ padding: '0 20px' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 md:p-10 w-full max-w-md relative shadow-2xl animate-[slideUp_0.4s_cubic-bezier(0.4,0,0.2,1)]"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition-all"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                    {website.name}
                </h2>

                {/* Description */}
                <p className="text-gray-500 leading-relaxed text-sm md:text-[15px] mb-7">
                    {website.description}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm md:text-[15px] hover:bg-gray-50 transition-all"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onGo(website)}
                        className="flex-1 py-3.5 px-6 rounded-xl text-white font-semibold text-base shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                        style={{
                            background: website.gradient,
                            boxShadow: `0 8px 25px ${website.color}50`,
                        }}
                    >
                        <span>Go</span>
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Skeleton Card Component
function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl p-6 md:p-8 min-h-[180px] flex flex-col relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent" />

            {/* Title Skeleton */}
            <div className="h-7 w-2/3 bg-gray-200 rounded-md mb-4 animate-pulse" />

            {/* Description Skeleton */}
            <div className="space-y-2 mb-auto">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-5" />

            {/* CTA Skeleton */}
            <div className="flex items-center gap-2">
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate loading
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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
            className="min-h-screen relative overflow-hidden font-sans text-white"
            style={{
                background: "linear-gradient(135deg, #0052CC 0%, #1E88E5 50%, #00BCD4 100%)",
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
                    @keyframes pulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.05); }
                    }
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                `}
            </style>

            {/* Background decorations */}
            <div
                className="absolute top-[10%] left-[5%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full opacity-5 blur-[100px] pointer-events-none animate-[pulse_8s_infinite]"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)" }}
            />
            <div
                className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full opacity-5 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]"
                style={{ background: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)" }}
            />

            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 py-5 md:px-12 md:py-6 max-w-[1400px] mx-auto relative z-10">
                {/* Logo */}
                <div>
                    <span className="text-2xl md:text-[32px] font-extrabold tracking-tight">
                        Bussing Center
                    </span>
                    <div className="text-xs md:text-[13px] text-white/70 mt-1 tracking-wide">
                        Transportation Solutions
                    </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-4">
                    <a
                        href="#contact"
                        className="text-white text-sm font-medium px-4 py-2.5 md:px-5 md:py-2.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-md hover:bg-white/20 transition-all"
                    >
                        ติดต่อเรา
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-[1200px] mx-auto px-6 py-10 md:px-12 md:py-12 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[13px] font-medium text-white bg-white/10 border border-white/15 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>ระบบบริหารจัดการขนส่งครบวงจร</span>
                </div>

                <h1 className="text-3xl md:text-[44px] font-extrabold leading-tight mb-4 tracking-tight">
                    เลือกระบบที่ต้องการใช้งาน
                </h1>

                <p className="text-base md:text-[17px] text-white/85 leading-relaxed max-w-[520px] mx-auto">
                    รวมทุกระบบบริหารจัดการขนส่งของบริษัทไว้ในที่เดียว เข้าถึงง่าย ใช้งานสะดวก
                </p>
            </section>

            {/* Website Cards Grid */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        companyWebsites.map((website) => (
                            <WebsiteCard
                                key={website.id}
                                website={website}
                                onClick={handleCardClick}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-7 px-6 md:px-12 text-center text-white/60 text-[13px] relative z-10 bg-black/10">
                <p>© {new Date().getFullYear()} SmileHost Transportation Solutions. All rights reserved.</p>
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
