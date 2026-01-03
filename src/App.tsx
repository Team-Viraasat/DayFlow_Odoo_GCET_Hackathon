import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import EmployeeList from './pages/EmployeeList';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeAttendance from './pages/EmployeeAttendance';
import AdminAttendance from './pages/AdminAttendance';
import EmployeeLeave from './pages/EmployeeLeave';
import AdminLeave from './pages/AdminLeave';
import EmployeePayroll from './pages/EmployeePayroll';
import AdminPayroll from './pages/AdminPayroll';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (adminOnly && currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            (currentUser?.needsOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />) 
            : <Login />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />
        } 
      />
      <Route
        path="/onboarding"
        element={
          isAuthenticated ? <Onboarding /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {currentUser?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
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
            {currentUser?.role === 'admin' ? <AdminAttendance /> : <EmployeeAttendance />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            {currentUser?.role === 'admin' ? <AdminLeave /> : <EmployeeLeave />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            {currentUser?.role === 'admin' ? <AdminPayroll /> : <EmployeePayroll />}
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