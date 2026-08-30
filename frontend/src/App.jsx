import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Public pages
import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/auth/LoginPage';
import RegisterPage    from './pages/auth/RegisterPage';
import VerifyOtpPage   from './pages/auth/VerifyOtpPage';
import ForgotPassword  from './pages/auth/ForgotPasswordPage';
import ResetPassword   from './pages/auth/ResetPasswordPage';

// Customer pages
import CustomerLayout     from './layouts/CustomerLayout';
import CustomerDashboard  from './pages/customer/Dashboard';
import CustomerRequests   from './pages/customer/Requests';
import NewRequest         from './pages/customer/NewRequest';
import RequestDetail      from './pages/customer/RequestDetail';
import CustomerChat       from './pages/customer/Chat';
import CustomerProfile    from './pages/customer/Profile';
import PaymentPage        from './pages/customer/Payment';
import CustomerNotifications from './pages/customer/Notifications';

// Technician pages
import TechnicianLayout    from './layouts/TechnicianLayout';
import TechnicianDashboard from './pages/technician/Dashboard';
import TechnicianTasks     from './pages/technician/Tasks';
import TechnicianTaskDetail from './pages/technician/TaskDetail';
import TechnicianChat      from './pages/technician/Chat';
import TechnicianProfile   from './pages/technician/Profile';

// Admin pages
import AdminLayout     from './layouts/AdminLayout';
import AdminLogin      from './pages/admin/Login';
import AdminDashboard  from './pages/admin/Dashboard';
import AdminUsers      from './pages/admin/Users';
import AdminTechnicians from './pages/admin/Technicians';
import AdminRequests   from './pages/admin/Requests';
import AdminRequestDetail from './pages/admin/RequestDetail';
import AdminPayments   from './pages/admin/Payments';
import AdminServices   from './pages/admin/Services';

// ─── Guards ───────────────────────────────────────────────────────────────────
function RequireAuth({ children, role }) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    if (user.role === 'admin')       return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'technician')  return <Navigate to="/technician/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user, token } = useAuthStore();
  if (token && user) {
    if (user.role === 'admin')      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'technician') return <Navigate to="/technician/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<LandingPage />} />
      <Route path="/login"          element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register"       element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/verify-otp"     element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
      <Route path="/reset-password"  element={<GuestOnly><ResetPassword /></GuestOnly>} />

      {/* Customer */}
      <Route path="/" element={<RequireAuth role="customer"><CustomerLayout /></RequireAuth>}>
        <Route path="dashboard"              element={<CustomerDashboard />} />
        <Route path="requests"               element={<CustomerRequests />} />
        <Route path="requests/new"           element={<NewRequest />} />
        <Route path="requests/:id"           element={<RequestDetail />} />
        <Route path="requests/:id/chat"      element={<CustomerChat />} />
        <Route path="requests/:id/pay"       element={<PaymentPage />} />
        <Route path="profile"                element={<CustomerProfile />} />
        <Route path="notifications"          element={<CustomerNotifications />} />
      </Route>

      {/* Technician */}
      <Route path="/technician" element={<RequireAuth role="technician"><TechnicianLayout /></RequireAuth>}>
        <Route path="dashboard"          element={<TechnicianDashboard />} />
        <Route path="tasks"              element={<TechnicianTasks />} />
        <Route path="tasks/:id"          element={<TechnicianTaskDetail />} />
        <Route path="tasks/:id/chat"     element={<TechnicianChat />} />
        <Route path="profile"            element={<TechnicianProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<GuestOnly><AdminLogin /></GuestOnly>} />
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"          element={<AdminDashboard />} />
        <Route path="users"              element={<AdminUsers />} />
        <Route path="technicians"        element={<AdminTechnicians />} />
        <Route path="requests"           element={<AdminRequests />} />
        <Route path="requests/:id"       element={<AdminRequestDetail />} />
        <Route path="payments"           element={<AdminPayments />} />
        <Route path="services"           element={<AdminServices />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
