import React from "react";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirect ไปยัง Bussing Authen Center
    window.location.href =
      import.meta.env.AUTH_SERVICE_UUID ||
      "https://authen-center.lab.bussing.app/login?service=32c4c2eb-2037-474f-8c75-2042ea85222f";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "linear-gradient(135deg, #0052CC 0%, #1E88E5 50%, #00BCD4 100%)",
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
          maxWidth: "360px",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "20px",
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
          padding: "0",
          overflow: "hidden",
          animation: "slideUp 0.6s ease-out",
        }}
      >
        {/* Header with Gradient Background */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)",
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
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Log in to access your account
          </p>
        </div>

        {/* Login Button */}
        <div style={{ padding: "40px" }}>
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              background: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            เข้าสู่ระบบด้วย Bussing Authen Center
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: "13px",
              marginTop: "24px",
            }}
          >
            คุณจะถูกนำไปยังหน้าเข้าสู่ระบบกลาง
          </p>
        </div>
      </div>
    </div>
  );
}
