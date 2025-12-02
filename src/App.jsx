import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import ManageCamera from "./pages/ManageCamera";
import ManageBusDoor from "./pages/ManageBusDoor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
  );
}
