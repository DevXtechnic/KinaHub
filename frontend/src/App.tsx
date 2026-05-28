import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import AdminDashboard from './pages/AdminDashboard';
import CRMPage from './pages/CRMPage';
import OrdersPage from './pages/OrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="products" element={<Products />} />
                <Route path="product/:slug" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>

              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/orders" element={<OrdersPage mode="customer" />} />
                <Route path="/dashboard/tickets" element={<CRMPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={['seller', 'admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/orders" element={<OrdersPage mode="seller" />} />
                <Route path="/seller/customers" element={<CRMPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/orders" element={<OrdersPage mode="admin" />} />
                <Route path="/admin/crm" element={<CRMPage />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
