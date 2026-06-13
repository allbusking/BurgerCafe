import { Navigate, Route, Routes } from "react-router-dom";

import { BackToTop } from "./components/BackToTop";
import { ToastProvider } from "./context/ToastContext";
import { useAuth } from "./context/AuthContext";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AboutPage } from "./routes/about";
import { AdminDashboard } from "./routes/admin";
import { AuthPage } from "./routes/auth";
import { CartPage } from "./routes/cart";
import { CheckoutPage } from "./routes/checkout";
import { HomePage } from "./routes";
import { MenuPage } from "./routes/menu";
import { AddressesPage } from "./pages/AddressesPage";
import { MyOrdersPage } from "./routes/my-orders";
import { OrderConfirmationPage } from "./routes/order-confirmation";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <BackToTop />
    </ToastProvider>
  );
}
