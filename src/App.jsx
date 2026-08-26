import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isAdmin } = useAuth();
  
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // App Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    navigate('product-detail');
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Global Navigation Bar */}
      <Navbar
        onNavigate={navigate}
        currentRoute={currentRoute}
        categories={categories}
      />

      {/* Main Routed Content View */}
      <div className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
          />
        )}

        {currentRoute === 'shop' && (
          <ShopPage
            products={products}
            categories={categories}
            initialFilters={routeParams}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => navigate('shop')}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'cart' && (
          <CartPage
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            checkoutData={routeParams}
            onNavigate={navigate}
            onOrderCompleted={() => fetchStoreData()}
          />
        )}

        {currentRoute === 'login' && (
          <LoginPage onNavigate={navigate} />
        )}

        {currentRoute === 'register' && (
          <RegisterPage onNavigate={navigate} />
        )}

        {currentRoute === 'profile' && (
          <ProfilePage onNavigate={navigate} />
        )}

        {currentRoute === 'orders' && (
          <OrdersPage onNavigate={navigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}

        {currentRoute === 'admin-dashboard' && (
          <AdminDashboardPage
            products={products}
            categories={categories}
            routeParams={routeParams}
            onRefreshData={fetchStoreData}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onSelectProduct={handleSelectProduct}
          onNavigate={navigate}
        />
      )}

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

    </div>
  );
}
