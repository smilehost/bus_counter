import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { loginWithCallback } from "../services/authService";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState(null);
  const isCalledRef = useRef(false);

  useEffect(() => {
    // ป้องกัน fetch ซ้ำจาก StrictMode
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const handleCallback = async () => {
      try {
        // ดึง query parameters จาก URL
        const code = searchParams.get("code");
        const sessionId = searchParams.get("session_id");
        const service = searchParams.get("service");

        // ตรวจสอบว่ามี parameters ครบหรือไม่
        if (!code || !sessionId || !service) {
          setError("Missing required parameters");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // ส่งข้อมูลไป backend
        const response = await loginWithCallback(code, sessionId, service);

        if (response.success) {
          const { access_token, refresh_token, account_name, com_id } =
            response.data;

          // Decode JWT เพื่อดึง role
          const payload = JSON.parse(atob(access_token.split(".")[1]));

          // เก็บข้อมูล user
          const user = {
            account_name,
            com_id,
            role: payload.account_role,
            account_id: payload.account_id,
            account_username: payload.account_username,
          };

          // บันทึก token และ user ลง store
          login(access_token, user, refresh_token);

          // Redirect ไปหน้าหลัก
          navigate("/");
        } else {
          setError(response.message || "Login failed");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err.response?.data?.message || "Authentication failed");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {error ? (
          <>
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-400 mt-2">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Authenticating...
            </h2>
            <p className="text-gray-500 mt-2">Please wait</p>
          </>
        )}
      </div>
    </div>
  );
}
