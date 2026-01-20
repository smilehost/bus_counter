import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ManageCamera from "./pages/ManageCamera";
import ManageBusDoor from "./pages/ManageBusDoor";
import AuthCallback from "./pages/AuthCallback";
import LogoutPage from "./pages/LogoutPage";
// ✅ Import แค่ตัวนี้ตัวเดียวพอ (เพราะข้างในมันจัดการ Notistack + Configurator ให้แล้ว)
import { ToastProvider } from "./components/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Public Routes - ไม่มี Sidebar */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Protected Routes - มี Sidebar */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute allowRoles={[1, 2, 3]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-camera"
              element={
                <ProtectedRoute allowRoles={[1, 2]}>
                  <ManageCamera />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-busdoor"
              element={
                <ProtectedRoute allowRoles={[1, 2]}>
                  <ManageBusDoor />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
