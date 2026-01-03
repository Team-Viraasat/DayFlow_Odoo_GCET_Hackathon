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
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.needs_onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (adminOnly && profile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            profile?.needs_onboarding ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />

      <Route
        path="/onboarding"
        element={user ? <Onboarding /> : <Navigate to="/login" replace />}
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
