import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Farmer pages
import Home              from './pages/Home';
import Browse            from './pages/Browse';
import PlantDetail       from './pages/PlantDetail';
import Cart              from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import Contact           from './pages/Contact';
import TrackOrder        from './pages/TrackOrder';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePlants   from './pages/admin/ManagePlants';
import ViewOrders      from './pages/admin/ViewOrders';
import Reports         from './pages/admin/Reports';
import Notifications   from './pages/admin/Notifications';

// Protected route wrapper
function AdminRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ── Farmer Routes ── */}
        <Route path="/"                      element={<Home />} />
        <Route path="/browse"                element={<Browse />} />
        <Route path="/plants/:id"            element={<PlantDetail />} />
        <Route path="/cart"                  element={<Cart />} />
        <Route path="/order-confirmation"    element={<OrderConfirmation />} />
        <Route path="/track"                 element={<TrackOrder />} />
        <Route path="/contact"               element={<Contact />} />

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/plants" element={<AdminRoute><ManagePlants /></AdminRoute>} />
        <Route path="/admin/orders"        element={<AdminRoute><ViewOrders /></AdminRoute>} />
        <Route path="/admin/reports"       element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
