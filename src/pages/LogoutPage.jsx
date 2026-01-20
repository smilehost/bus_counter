import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    // ใช้ LogoutHandler จาก script ที่ load ใน index.html
    window.LogoutHandler.init({
      localStorageKeys: ["auth_token", "auth_user", "refresh_token"],
      defaultRedirectUrl: "https://authen-center.lab.bussing.app/login",
      onLogoutStart: () => {
        console.log("Logging out...");
      },
    }).execute();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">ออกจากระบบ</h2>
        <p className="text-gray-500">กำลังออกจากระบบ...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
