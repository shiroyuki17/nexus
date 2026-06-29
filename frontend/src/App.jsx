import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import PCStatus from '@/pages/PCStatus';
import Reservations from '@/pages/Reservations';
import Games from '@/pages/Games';
import FoodDrinks from '@/pages/FoodDrinks';
import Profile from '@/pages/Profile';
import Tournaments from '@/pages/Tournaments';
import Admin from '@/pages/Admin';
import Staff from '@/pages/Staff';
import SettingsPage from '@/pages/Settings';
import ArchitectureSaaS from '@/pages/ArchitectureSaaS';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicPaths.includes(location.pathname);

  if ((isLoadingPublicSettings || isLoadingAuth) && !isPublicRoute) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground font-display">Loading Nexus Server Lab...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required' && !isPublicRoute) {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<ArchitectureSaaS />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pc-status" element={<PCStatus />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/games" element={<Games />} />
          <Route path="/food-drinks" element={<FoodDrinks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route element={<ProtectedRoute roles={["admin","pc"]} unauthenticatedElement={<Navigate to="/dashboard" replace />} />}>
            <Route path="/staff" element={<Staff />} />
          </Route>
          <Route element={<ProtectedRoute roles={["admin"]} unauthenticatedElement={<Navigate to="/login" replace />} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
