import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import Navbar from './components/Navbar';
import SuperAdminLayout from './components/SuperAdminLayout';
import SplashScreen from './components/SplashScreen';

// Client pages
import Home from './pages/Home';
import Login from './pages/Login';
import Notification from './pages/Notification';
import Customers from './pages/Customers';
import Warehouse from './pages/Warehouse';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Purchases from './pages/Purchases';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import Profile from './pages/Profile';

// Super Admin pages
import SADashboard from './pages/superadmin/SADashboard';
import SACompanies from './pages/superadmin/SACompanies';
import SACompanyDetail from './pages/superadmin/SACompanyDetail';
import SACompanyProducts from './pages/superadmin/SACompanyProducts';
import SACompanyCustomers from './pages/superadmin/SACompanyCustomers';
import SACompanySales from './pages/superadmin/SACompanySales';
import SACompanyPurchases from './pages/superadmin/SACompanyPurchases';
import SACompanyUsers from './pages/superadmin/SACompanyUsers';
import SACompanySettings from './pages/superadmin/SACompanySettings';
import SASubscriptions from './pages/superadmin/SASubscriptions';
import SASupport from './pages/superadmin/SASupport';
import SAAuditLog from './pages/superadmin/SAAuditLog';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
  </div>
);

// Guard: must be logged in
const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Guard: must be superadmin
const RequireSuperAdmin = ({ children }) => {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return children;
};

// Guard: must be owner
const RequireOwner = ({ children }) => {
  const { isAuthenticated, isOwner, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOwner) return <Navigate to="/" replace />;
  return children;
};

// Redirect after login based on role
const LoginRedirect = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  if (!isAuthenticated) return null;
  return <Navigate to={isSuperAdmin ? '/base_bcrm' : '/'} replace />;
};

// Client layout wrapper
const ClientLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {isAuthenticated && <Navbar />}
      <main className={`flex-1 min-w-0 ${isAuthenticated ? 'md:ml-60' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={isSuperAdmin ? '/base_bcrm' : '/'} replace />
            : <Login />
        } />

        {/* Super Admin panel */}
        <Route path="/base_bcrm" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SADashboard /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanies /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanyDetail /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/products" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanyProducts /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/customers" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanyCustomers /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/sales" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanySales /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/purchases" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanyPurchases /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/users" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanyUsers /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/companies/:id/settings" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SACompanySettings /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/subscriptions" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SASubscriptions /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/support" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SASupport /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />
        <Route path="/base_bcrm/audit" element={
          <RequireSuperAdmin>
            <SuperAdminLayout><SAAuditLog /></SuperAdminLayout>
          </RequireSuperAdmin>
        } />

        {/* Client CRM */}
        <Route path="/" element={
          <RequireAuth>
            <ClientLayout><Home /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/sales" element={
          <RequireAuth>
            <ClientLayout><Sales /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/warehouse" element={
          <RequireAuth>
            <ClientLayout><Warehouse /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/purchases" element={
          <RequireAuth>
            <ClientLayout><Purchases /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/customers" element={
          <RequireAuth>
            <ClientLayout><Customers /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/reports" element={
          <RequireAuth>
            <ClientLayout><Reports /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/profile" element={
          <RequireAuth>
            <ClientLayout><Profile /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/notification" element={
          <RequireAuth>
            <ClientLayout><Notification /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/audit" element={
          <RequireAuth>
            <ClientLayout><AuditLog /></ClientLayout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireOwner>
            <ClientLayout><Settings /></ClientLayout>
          </RequireOwner>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {splashDone && (
        <AuthProvider>
          <CompanyProvider>
            <Router>
              <AppContent />
            </Router>
          </CompanyProvider>
        </AuthProvider>
      )}
    </>
  );
};

export default App;
