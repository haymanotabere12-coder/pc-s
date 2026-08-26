import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Heart, 
  Shield, 
  LogOut, 
  Package, 
  Laptop, 
  SlidersHorizontal,
  ChevronDown,
  Phone,
  Mail,
  HelpCircle,
  Truck,
  Bell,
  MessageSquare,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onNavigate, currentRoute, categories = [] }) {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount, wishlist } = useCart();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState({ total: 0, alerts: [], unread_messages: 0 });
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Poll for live notifications only when user is logged in
  useEffect(() => {
    if (!user) {
      setNotifications({ total: 0, alerts: [], unread_messages: 0 });
      return;
    }

    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setNotifications(data);
        }
      } catch (err) {
        // silent fail
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
        setShowCategoryDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 dark:bg-slate-950 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Truck className="w-3.5 h-3.5" /> Free Express Shipping on orders over 15,000 ETB
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 2-Year Full Hardware Warranty
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="tel:+251925692705" className="hover:text-white flex items-center gap-1 transition-colors">
              <Phone className="w-3 h-3" /> +(251) 925692705
            </a>
            <button 
              onClick={() => onNavigate('contact')} 
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3" /> Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 group text-left shrink-0"
            id="nav-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                PC STORE
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400">
                Tech & Gaming Hardware
              </span>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gaming laptops, RTX 4090, CPUs, SSDs..."
                className="w-full pl-10 pr-24 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold tracking-wide transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3" ref={dropdownRef}>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => onNavigate('shop', { wishlistOnly: true })}
              aria-label="Wishlist"
              className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hidden sm:flex"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Live Notifications Bell (Only when logged in as User or Admin) */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center"
                  title={isAdmin ? "Admin Notifications (Orders, Approvals, Messages)" : "My Notifications"}
                  id="nav-notif-btn"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.total > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {notifications.total > 99 ? '99+' : notifications.total}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {isAdmin ? 'Admin Alerts & Notifications' : 'Activity & Message Alerts'}
                        </h4>
                      </div>
                      {notifications.total > 0 && (
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await fetch('/api/notifications/clear-all', { method: 'POST' });
                              setNotifications({ total: 0, alerts: [], unread_messages: 0 });
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Clear All (አጥፋ)
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {notifications.alerts && notifications.alerts.length > 0 ? (
                        notifications.alerts.map((alert, idx) => (
                          <div
                            key={alert.id || idx}
                            onClick={async () => {
                              setShowNotificationDropdown(false);
                              if (alert.order_id) {
                                try {
                                  await fetch(`/api/chat/${alert.order_id}/read`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ role: isAdmin ? 'admin' : 'customer' })
                                  });
                                } catch (e) {}
                              }
                              // Immediately filter out clicked alert from UI
                              setNotifications(prev => ({
                                ...prev,
                                total: Math.max(0, prev.total - 1),
                                alerts: prev.alerts.filter(a => a.id !== alert.id)
                              }));

                              if (isAdmin) {
                                if (alert.target === 'orders' || alert.type === 'payment_proof') {
                                  onNavigate('admin-dashboard', { tab: 'orders', orderId: alert.order_id });
                                } else {
                                  onNavigate('admin-dashboard', { tab: 'messages', orderId: alert.order_id });
                                }
                              } else {
                                onNavigate('orders', { orderId: alert.order_id, openChat: alert.type === 'chat' });
                              }
                            }}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                                {alert.type === 'payment_proof' && <CreditCard className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                {alert.type === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                {alert.type === 'approval' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                {alert.title}
                              </span>
                              {alert.time && (
                                <span className="text-[9px] text-slate-400">
                                  {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">
                              {alert.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          No unread notifications at this time.
                        </div>
                      )}
                    </div>

                    <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                      <button
                        onClick={() => {
                          setShowNotificationDropdown(false);
                          if (isAdmin) onNavigate('admin-dashboard', { tab: 'messages' });
                          else onNavigate('orders');
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isAdmin ? 'Open Messages & Support Center →' : 'View All Orders & Messages →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => onNavigate('cart')}
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center"
              id="nav-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.username ? user.username.charAt(0) : 'U'
                      )}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                      {user.full_name || user.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.full_name || user.username}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => { onNavigate('admin-dashboard'); setShowUserDropdown(false); }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2.5 transition-colors"
                        >
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => { onNavigate('profile'); setShowUserDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile
                      </button>

                      {/* Only regular customer accounts have 'My Orders' - Admins manage all Customer Orders via Admin Dashboard */}
                      {!isAdmin && (
                        <button
                          onClick={() => { onNavigate('orders'); setShowUserDropdown(false); }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" /> My Orders
                        </button>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); onNavigate('home'); }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="hidden sm:inline-flex px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 py-2.5 text-xs font-medium">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 ${currentRoute === 'shop' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> All Products
            </button>

            {categories.slice(0, 7).map(cat => (
              <button
                key={cat.id || cat._id}
                onClick={() => onNavigate('shop', { categoryId: cat.id || cat._id })}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-normal">
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Contact & Store Location
            </button>
          </div>
        </nav>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="p-2 text-left font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
              className="p-2 text-left font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Products
            </button>
            <button
              onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}
              className="p-2 text-left font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Shopping Cart ({totalCount})
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="p-2 text-left font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Us
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {categories.map(cat => (
                <button
                  key={cat.id || cat._id}
                  onClick={() => { onNavigate('shop', { categoryId: cat.id || cat._id }); setMobileMenuOpen(false); }}
                  className="p-1.5 text-left text-slate-600 dark:text-slate-300 hover:text-blue-500 truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
