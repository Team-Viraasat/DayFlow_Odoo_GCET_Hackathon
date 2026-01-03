import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import EmployeeList from "./pages/EmployeeList";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import AdminAttendance from "./pages/AdminAttendance";
import EmployeeLeave from "./pages/EmployeeLeave";
import AdminLeave from "./pages/AdminLeave";
import EmployeePayroll from "./pages/EmployeePayroll";
import AdminPayroll from "./pages/AdminPayroll";
import AdminAddEmployee from "./pages/AdminAddEmployee";

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { profile, loading } = useAuth();

  if (loading) return null;

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { profile, loading } = useAuth();

  if (loading) return null;

  const isAuthenticated = !!profile;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />

      {/* Onboarding kept for structure, but demo skips it */}
      <Route
        path="/onboarding"
        element={isAuthenticated ? <Onboarding /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {profile?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <EmployeeDashboard />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute adminOnly>
            <EmployeeList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/:employeeId"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            {profile?.role === "admin" ? (
              <AdminAttendance />
            ) : (
              <EmployeeAttendance />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            {profile?.role === "admin" ? <AdminLeave /> : <EmployeeLeave />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            {profile?.role === "admin" ? (
              <AdminPayroll />
            ) : (
              <EmployeePayroll />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-employee"
        element={
          <ProtectedRoute adminOnly>
            <AdminAddEmployee />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
