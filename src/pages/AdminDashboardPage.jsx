import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  MessageSquare, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Search, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Shield,
  RefreshCw,
  Send,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  ExternalLink,
  ChevronRight,
  FileText,
  Lock,
  KeyRound,
  ShieldAlert,
  Key,
  SlidersHorizontal,
  BadgeCheck,
  Camera,
  Upload,
  Loader2
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB, formatBirr } from '../utils/currency';

export default function AdminDashboardPage({ 
  products = [], 
  categories = [], 
  routeParams = {},
  onRefreshData, 
  onNavigate 
}) {
  const { user, isAdmin, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState(() => {
    return routeParams?.tab || routeParams?.section || 'dashboard';
  });
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active Chat State in Admin
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Lightbox Image & Order
  const [previewProofUrl, setPreviewProofUrl] = useState(null);
  const [selectedOrderForApproval, setSelectedOrderForApproval] = useState(null);

  // Admin Security & Credentials Form State
  const [adminUsername, setAdminUsername] = useState(user?.username || 'admin');
  const [adminFullName, setAdminFullName] = useState(user?.full_name || 'Administrator');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@pcstore.com');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [uploadingAdminAvatar, setUploadingAdminAvatar] = useState(false);

  // Modals / Forms state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: 10,
    category_id: '',
    image: '2.webp',
    featured: false
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // Update credentials form initial values when user changes
  useEffect(() => {
    if (user) {
      setAdminUsername(user.username || 'admin');
      setAdminFullName(user.full_name || 'Administrator');
      setAdminEmail(user.email || 'admin@pcstore.com');
    }
  }, [user]);

  // Synchronize routeParams (e.g. clicking messages or orders from notifications)
  useEffect(() => {
    if (routeParams?.tab) {
      setActiveSection(routeParams.tab);
    } else if (routeParams?.section) {
      setActiveSection(routeParams.section);
    }
    if (routeParams?.orderId && chatThreads.length > 0) {
      const match = chatThreads.find(c => String(c.order_id) === String(routeParams.orderId));
      if (match) {
        setSelectedChat(match);
      }
    }
  }, [routeParams, chatThreads]);

  // Fetch admin data on mount or section switch
  useEffect(() => {
    fetchAdminData();
  }, [activeSection]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, messagesRes, chatsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/users'),
        fetch('/api/messages'),
        fetch('/api/chat')
      ]);

      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.orders || []);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsersList(d.users || []);
      }
      if (messagesRes.ok) {
        const d = await messagesRes.json();
        setMessagesList(d.messages || []);
      }
      if (chatsRes.ok) {
        const d = await chatsRes.json();
        setChatThreads(d.chats || []);
        if (d.chats && d.chats.length > 0 && !selectedChat) {
          setSelectedChat(d.chats[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: 15,
      category_id: categories[0]?.id || categories[0]?._id || 1,
      image: '2.webp',
      featured: false
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category_id: p.category_id || p.categoryId || 1,
      image: p.image || '2.webp',
      featured: Boolean(p.featured)
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id || editingProduct._id}` 
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          category_id: Number(productForm.category_id),
          featured: productForm.featured ? 1 : 0
        })
      });

      if (!res.ok) throw new Error('Failed to save product');
      showToast(editingProduct ? 'Product updated successfully!' : 'Product created successfully!', 'success');
      setShowProductModal(false);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Product removed from inventory', 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      showToast(`Order #${orderId} status set to "${newStatus}"`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Payment Proof Approval / Rejection
  const handleVerifyPayment = async (orderId, status, adminMsg = '') => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: status,
          status: status === 'approved' ? 'processing' : 'pending',
          admin_message: adminMsg || (status === 'approved' ? 'Payment verified and confirmed by Admin. Order is processing.' : 'Payment receipt was unclear. Please upload a clear screenshot.')
        })
      });
      if (!res.ok) throw new Error('Failed to update payment status');
      showToast(status === 'approved' ? `✅ Order #${orderId} payment APPROVED & verified!` : `Order #${orderId} payment marked as rejected`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Error updating payment status', 'error');
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve order');
      showToast(`✅ Order #${orderId} Payment APPROVED! Customer notified.`, 'success');
      fetchAdminData();
      if (previewProofOrder) setPreviewProofOrder(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Send Admin Chat Reply
  const handleSendAdminReply = async (e) => {
    if (e) e.preventDefault();
    if (!adminReplyText.trim() || !selectedChat) return;

    setSendingReply(true);
    const orderId = selectedChat.order_id;
    const text = adminReplyText.trim();
    setAdminReplyText('');

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          sender: 'admin',
          sender_name: 'Admin',
          text: text
        })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        // Update local state
        setSelectedChat(prev => ({
          ...prev,
          messages: [...(prev.messages || []), { ...data.message, is_read_by_admin: 1 }]
        }));
        setChatThreads(prev => prev.map(c => {
          if (String(c.order_id) === String(selectedChat.order_id) || String(c.id) === String(selectedChat.id)) {
            return {
              ...c,
              messages: [...(c.messages || []), { ...data.message, is_read_by_admin: 1 }]
            };
          }
          return c;
        }));
        showToast('Reply dispatched to customer as Admin!', 'success');
        if (onRefreshData) onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to dispatch reply');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const markChatAsRead = async (orderId) => {
    if (!orderId) return;
    try {
      await fetch(`/api/chat/${orderId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      });
      setChatThreads(prev => prev.map(c => {
        if (String(c.order_id) === String(orderId) || String(c.id) === String(orderId)) {
          return {
            ...c,
            messages: (c.messages || []).map(m => ({ ...m, is_read_by_admin: 1 }))
          };
        }
        return c;
      }));
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error('Error marking chat read', e);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (chat && (chat.order_id || chat.id)) {
      markChatAsRead(chat.order_id || chat.id);
    }
  };

  const handleMarkContactMessageRead = async (id) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'POST' });
      setMessagesList(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllMessagesRead = async () => {
    try {
      await Promise.all([
        fetch('/api/chat/mark-all-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'admin' })
        }),
        fetch('/api/messages/mark-all-read', { method: 'POST' })
      ]);
      setMessagesList(prev => prev.map(m => ({ ...m, is_read: 1 })));
      setChatThreads(prev => prev.map(c => ({
        ...c,
        messages: (c.messages || []).map(m => ({ ...m, is_read_by_admin: 1 }))
      })));
      if (selectedChat) {
        setSelectedChat(prev => ({
          ...prev,
          messages: (prev.messages || []).map(m => ({ ...m, is_read_by_admin: 1 }))
        }));
      }
      showToast('All messages and inquiries marked as read (ሁሉም መልዕክቶች እንደተነበቡ ተደርገዋል)', 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  // Open Chat from Orders Table
  const handleOpenOrderChat = (orderId) => {
    const thread = chatThreads.find(c => String(c.order_id) === String(orderId));
    if (thread) {
      handleSelectChat(thread);
      setActiveSection('messages');
    } else {
      // Create virtual thread view or switch tab
      const newThread = {
        order_id: orderId,
        customer_name: `Order #${orderId} Customer`,
        messages: []
      };
      setSelectedChat(newThread);
      setActiveSection('messages');
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      if (!res.ok) throw new Error('Failed to add category');
      showToast('Category created!', 'success');
      setShowCategoryModal(false);
      setCategoryForm({ name: '', description: '' });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // User promotion / deletion
  const handleToggleAdmin = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'customer' : 'admin';
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      showToast(`User role updated to ${newRole}`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Update Admin Security Credentials (Username & Password)
  const handleUpdateAdminCredentials = async (e) => {
    e.preventDefault();
    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (newAdminPassword && !currentAdminPassword) {
      showToast('Please enter your current administrator password to confirm change.', 'error');
      return;
    }
    if (!adminUsername.trim()) {
      showToast('Username cannot be empty.', 'error');
      return;
    }

    setSavingCredentials(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          full_name: adminFullName.trim(),
          email: adminEmail.trim(),
          current_password: currentAdminPassword,
          new_password: newAdminPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update admin credentials');
      
      showToast(data.message || 'Administrator security credentials updated successfully!', 'success');
      if (data.user && updateUser) {
        updateUser(data.user);
      }
      setCurrentAdminPassword('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingCredentials(false);
    }
  };

  // Upload Admin Profile Picture / Avatar
  const handleAdminPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }

    setUploadingAdminAvatar(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');

      const photoUrl = data.url;

      const updateRes = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username,
          avatar: photoUrl
        })
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || 'Failed to save admin profile picture');

      if (updateUser) updateUser({ avatar: photoUrl });
      showToast('Admin profile photo updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Error updating photo', 'error');
    } finally {
      setUploadingAdminAvatar(false);
    }
  };

  // STRICT ACCESS GUARD: Only authenticated admin can view this dashboard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-200 dark:border-rose-900/60 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <span className="px-3.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black rounded-full uppercase tracking-wider">
              የተከለከለ ገጽ (Access Restricted)
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              የአድሚን መግቢያ ብቻ (Store Admin Portal)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              ሌላ ማንኛውም ሰው ወደ አድሚን ዳሽቦርድ መግባት አይችልም። ይህ ገጽ ለተፈቀደለት የሱቅ አስተዳዳሪ (Store Admin) በራሱ መግቢያ Username እና Password ብቻ የተወሰነ ነው።
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Security Notice:
              </div>
              <p>Customers and unauthorized guests cannot manage inventory or review payment slips. Please sign in with administrator credentials.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-4 h-4" /> በአድሚን መለያ ይግቡ (Admin Sign In)
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
            >
              ወደ ሱቅ ይመለሱ (Storefront)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculations for dashboard
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingPayments = orders.filter(o => o.payment_proof && o.payment_status !== 'approved');
  const lowStockProducts = products.filter(p => p.stock < 10);

  // Exact unread messages calculation (unread customer chat messages + unread contact inquiries)
  const unreadChatsCount = chatThreads.filter(c => 
    c.messages?.some(m => m.sender === 'customer' && !m.is_read_by_admin)
  ).length;
  const unreadInquiriesCount = messagesList.filter(m => !m.is_read || m.is_read === 0).length;
  const totalUnreadMessages = unreadChatsCount + unreadInquiriesCount;

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-50 dark:bg-slate-950">
      
      {/* Admin Sidebar */}
      <AdminSidebar
        currentSection={activeSection}
        onSelectSection={setActiveSection}
        onNavigate={onNavigate}
        pendingApprovalsCount={pendingPayments.length}
        unreadMessagesCount={totalUnreadMessages}
      />

      {/* Main Admin Content Workspace */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              {activeSection.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-500">Live hardware inventory, payment approvals, and customer chat console</p>
          </div>
          <button
            onClick={() => { fetchAdminData(); if (onRefreshData) onRefreshData(); }}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* SECTION: OVERVIEW / DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Gross Sales</span>
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatETB(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last week
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Total Orders</span>
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {orders.length}
                </div>
                <div className="text-[11px] text-slate-400">Processed across CBE & Telebirr</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Payment Receipts</span>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {pendingPayments.length} Pending
                </div>
                <div className="text-[11px] text-amber-600 font-semibold">
                  Awaiting your review
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Active Chat Threads</span>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {chatThreads.length}
                </div>
                <div className="text-[11px] text-purple-600 font-semibold">
                  Real-time customer inquiries
                </div>
              </div>
            </div>

            {/* Pending Payment Proofs Action Box */}
            {pendingPayments.length > 0 && (
              <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Action Required: {pendingPayments.length} Payment Receipt(s) Awaiting Review</span>
                  </div>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs font-bold text-amber-700 dark:text-amber-300 underline"
                  >
                    View in Orders Table →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingPayments.slice(0, 3).map(po => (
                    <div key={po.id || po._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 space-y-3 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Order #{po.id || po._id}</span>
                        <span className="font-extrabold text-blue-600">{formatETB(po.total_amount)}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Customer: <strong className="text-slate-700 dark:text-slate-300">{po.customer_name}</strong>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Method: <span className="font-bold text-slate-700 dark:text-slate-300">{po.payment_method}</span>
                      </div>
                      
                      {po.payment_proof && (
                        <div 
                          onClick={() => setPreviewProofUrl(po.payment_proof)}
                          className="relative group cursor-pointer h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100"
                        >
                          <img src={po.payment_proof} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity">
                            <Eye className="w-4 h-4" /> Click to Zoom Screenshot
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyPayment(po.id || po._id, 'approved')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(po.id || po._id, 'rejected')}
                          className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-bold text-[11px]"
                          title="Reject screenshot"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders & Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Hardware Orders</h3>
                  <button onClick={() => setActiveSection('orders')} className="text-xs font-bold text-blue-600 hover:underline">
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id || o._id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Order #{o.id || o._id} • {o.customer_name}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {o.payment_method} • {o.customer_phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-blue-600">${Number(o.total_amount).toFixed(2)}</div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {o.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-xs text-slate-400 py-6 text-center">No orders registered yet.</p>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" /> Low Inventory Alerts
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lowStockProducts.map(p => (
                    <div key={p.id || p._id} className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{p.name}</h4>
                        <span className="text-rose-600 font-bold text-[11px]">{p.stock} units remaining</span>
                      </div>
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-[10px]"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <p className="text-xs text-slate-400">All inventory items are well-stocked!</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION: PRODUCTS MANAGEMENT */}
        {activeSection === 'products' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Product Inventory Catalog</h3>
                <p className="text-xs text-slate-500">{products.length} hardware units registered</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add New Hardware Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Featured</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map(p => (
                    <tr key={p.id || p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={p.image ? (p.image.startsWith('/') ? p.image : `/${p.image}`) : '/2.webp'}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => { e.currentTarget.src = '/2.webp'; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-slate-400">ID #{p.id || p._id}</div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                        {p.category_name || 'Hardware'}
                      </td>
                      <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                        {formatETB(p.price)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock < 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3">
                        {p.featured ? (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 rounded-lg"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id || p._id)}
                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: ORDERS & PAYMENT PROOFS */}
        {activeSection === 'orders' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Customer Orders & Payment Screenshots</h3>
                <p className="text-xs text-slate-500">Review CBE / Telebirr payment receipts and manage fulfillment lifecycle</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer & Phone</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3">Screenshot Proof (የክፍያ ማረጋገጫ)</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Fulfillment Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map(ord => (
                    <tr key={ord.id || ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 font-mono font-bold">
                        <div>#{ord.id || ord._id}</div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(ord.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{ord.customer_name}</div>
                        <div className="text-slate-400 text-[11px]">{ord.customer_phone}</div>
                        <div className="text-slate-400 text-[10px] truncate max-w-[140px]">
                          {typeof ord.shipping_address === 'string' ? ord.shipping_address : `${ord.shipping_address?.address || ''}`}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {ord.payment_method}
                        </span>
                        {ord.transaction_ref && (
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Ref: {ord.transaction_ref}
                          </span>
                        )}
                      </td>

                      {/* Payment Proof Column */}
                      <td className="py-4">
                        {ord.payment_proof ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div 
                                onClick={() => {
                                  setPreviewProofUrl(ord.payment_proof);
                                  setSelectedOrderForApproval(ord);
                                }}
                                className="relative group cursor-pointer w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0 shadow-sm"
                                title="Click to inspect receipt screenshot"
                              >
                                <img src={ord.payment_proof} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                  <Eye className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ord.payment_status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                }`}>
                                  {ord.payment_status === 'approved' ? '✓ Payment Approved' : '⏳ Proof Uploaded'}
                                </span>
                                {ord.payment_status !== 'approved' && (
                                  <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                    Needs Admin Approval
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* 1-Click Action Buttons */}
                            {ord.payment_status !== 'approved' ? (
                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleApproveOrder(ord.id || ord._id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1 transition-all"
                                  title="Approve payment & mark order processing"
                                >
                                  <CheckCircle2 className="w-3 h-3" /> Approve (አጽድቅ)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVerifyPayment(ord.id || ord._id, 'rejected')}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-600 dark:text-slate-300 font-bold text-[10px] rounded-lg transition-colors"
                                  title="Reject unclear receipt"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified & Approved
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[11px] text-slate-400 italic block">
                              No screenshot uploaded
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApproveOrder(ord.id || ord._id)}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              Manual Approve
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-4 font-extrabold text-blue-600 text-sm">
                        {formatETB(ord.total_amount)}
                      </td>

                      <td className="py-4">
                        <select
                          value={ord.status || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(ord.id || ord._id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleOpenOrderChat(ord.id || ord._id)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                          title="Open Customer Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">No orders received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: MESSAGES & LIVE ORDER CHATS */}
        {activeSection === 'messages' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[550px]">
            
            {/* Left Column: Chat Threads & Support Tickets */}
            <div className="w-full lg:w-80 border-r border-slate-100 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Order Chats ({chatThreads.length})</h3>
                  {unreadChatsCount > 0 && (
                    <span className="text-[10px] text-rose-500 font-bold">({unreadChatsCount} አዲስ ያልተነበበ)</span>
                  )}
                </div>
                {(unreadChatsCount > 0 || unreadInquiriesCount > 0) && (
                  <button
                    type="button"
                    onClick={handleMarkAllMessagesRead}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg transition-colors"
                    title="Mark all messages and contact inquiries as read"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {chatThreads.map(chat => {
                  const isSelected = selectedChat?.order_id === chat.order_id;
                  const lastMsg = chat.messages?.[chat.messages.length - 1];
                  const hasUnread = chat.messages?.some(m => m.sender === 'customer' && !m.is_read_by_admin);
                  return (
                    <div
                      key={chat.order_id || chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all text-xs space-y-1 relative ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : hasUnread
                          ? 'bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-slate-800 dark:text-slate-100 border border-blue-300 dark:border-blue-700/60'
                          : 'bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          Order #{chat.order_id}
                          {hasUnread && !isSelected && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>
                          )}
                        </span>
                        <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {lastMsg ? new Date(lastMsg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : hasUnread ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {lastMsg ? `${lastMsg.sender === 'admin' ? 'You: ' : ''}${lastMsg.text}` : 'No messages yet'}
                      </p>
                    </div>
                  );
                })}

                {chatThreads.length === 0 && (
                  <p className="text-slate-400 text-center py-6 text-xs">No active chat conversations yet.</p>
                )}
              </div>

              {/* Inquiries / Contact Form messages */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Form Inquiries ({messagesList.length})
                  </h4>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                  {messagesList.map(m => (
                    <div 
                      key={m.id || m._id} 
                      onClick={() => handleMarkContactMessageRead(m.id || m._id)}
                      className={`p-2.5 rounded-xl border space-y-0.5 cursor-pointer transition-colors ${
                        !m.is_read || m.is_read === 0 
                          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                        {(!m.is_read || m.is_read === 0) && (
                          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">New</span>
                        )}
                      </div>
                      <span className="text-blue-600 text-[11px] font-medium block">{m.subject}</span>
                      <p className="text-slate-500 text-[11px] line-clamp-2">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Chat Conversation Thread */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
              {selectedChat ? (
                <>
                  {/* Chat Top Banner */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                        #{selectedChat.order_id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Customer Support Thread for Order #{selectedChat.order_id}
                          </h4>
                          {(() => {
                            const ord = orders.find(o => o.id === selectedChat.order_id);
                            if (!ord) return null;
                            return (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.payment_status === 'approved' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {ord.payment_status === 'approved' ? '✓ Paid & Approved' : '⏳ Payment Needs Approval'}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-[11px] text-slate-400">Direct instant messaging channel with Customer</p>
                      </div>
                    </div>

                    {/* Quick Order Actions in Chat */}
                    {(() => {
                      const ord = orders.find(o => o.id === selectedChat.order_id);
                      if (!ord) return null;
                      return (
                        <div className="flex items-center gap-2">
                          {ord.payment_proof && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewProofUrl(ord.payment_proof);
                                setSelectedOrderForApproval(ord);
                              }}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Receipt
                            </button>
                          )}
                          {ord.payment_status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApproveOrder(ord.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payment ({formatETB(ord.total_amount)})
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Message History */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-3 min-h-[320px] bg-slate-50/20 dark:bg-slate-950/20 text-xs">
                    {(selectedChat.messages || []).map((msg, idx) => {
                      const isAdmin = msg.sender === 'admin' || (msg.sender_name && msg.sender_name.toLowerCase().includes('admin'));
                      const isSystem = msg.sender === 'system';
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${
                            isSystem
                              ? 'items-center my-2'
                              : isAdmin
                              ? 'items-end'
                              : 'items-start'
                          }`}
                        >
                          {isSystem ? (
                            <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-3 py-1 rounded-full text-center max-w-sm">
                              {msg.text}
                            </div>
                          ) : (
                            <div className="max-w-[80%] space-y-1">
                              <span className={`text-[10px] font-bold block ${isAdmin ? 'text-blue-600 dark:text-blue-400 text-right' : 'text-purple-600 dark:text-purple-400'}`}>
                                {isAdmin ? '🛡️ Admin (እርስዎ / Administrator)' : (msg.sender_name || 'Customer (ደንበኛ)')}
                              </span>
                              <div
                                className={`p-3.5 rounded-2xl leading-relaxed ${
                                  isAdmin
                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200/80 dark:border-slate-700 shadow-sm'
                                }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-400 block px-1">
                                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Admin Quick Response Suggestions */}
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
                    {[
                      'Hello! We have verified your Ethiopian bank payment and your order is currently processing.',
                      'Your order has been dispatched via express delivery in Addis Ababa.',
                      'Please provide a clearer screenshot of your payment receipt.'
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAdminReplyText(sug)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg whitespace-nowrap border border-slate-200 dark:border-slate-600 transition-colors"
                      >
                        {sug.slice(0, 45)}...
                      </button>
                    ))}
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendAdminReply} className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
                    <input
                      type="text"
                      placeholder={`Reply to customer regarding Order #${selectedChat.order_id}...`}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !adminReplyText.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Send className="w-4 h-4" /> Send Reply
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs text-center">
                  Select an order chat thread on the left to start messaging with the customer.
                </div>
              )}
            </div>

          </div>
        )}

        {/* SECTION: CATEGORIES MANAGEMENT */}
        {activeSection === 'categories' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Hardware Categories</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id || cat._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-slate-500">{cat.description || 'Hardware and accessories'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: USERS & ROLES */}
        {activeSection === 'users' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">User Accounts & Roles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map(u => (
                    <tr key={u.id || u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-bold">{u.full_name || u.username}</td>
                      <td className="py-3 text-slate-500">{u.email}</td>
                      <td className="py-3 text-slate-500">{u.phone || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.role || 'customer'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleAdmin(u.id || u._id, u.role)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px]"
                        >
                          {u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: ADMIN SECURITY & CREDENTIALS */}
        {activeSection === 'security' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" /> Root Security Control
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Administrator Credentials & Access Control (የአድሚን መግቢያ መረጃዎች)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ማንም ሌላ ሰው ወደ አድሚን እንዳይገባ የራስዎን ሚስጥራዊ Username እና Password እዚህ ያዋቅሩ።
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                  <span>Authenticated as @{user?.username || 'admin'}</span>
                </div>
              </div>

              {/* Admin Mandate & Restriction Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-600" /> 1. እቃዎችን ማከል (Add Hardware)
                  </div>
                  <p className="text-[11px] text-slate-500">አዳዲስ ፒሲ እቃዎችን፣ ዋጋ እና የክምችት መጠን መመዝገብ</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" /> 2. ትዕዛዝ ማስኬድ (Process Orders)
                  </div>
                  <p className="text-[11px] text-slate-500">የደንበኞችን የባንክ ደረሰኝ ስክሪንሾት ማረጋገጥና እቃዎችን መላክ</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> 3. ግዢ የተከለከለ (No Purchasing)
                  </div>
                  <p className="text-[11px] text-slate-500">የአድሚን መለያ እቃ ለመግዛት አይፈቀድለትም፤ ማስተዳደር ብቻ ነው</p>
                </div>
              </div>

              {/* Admin Avatar & Profile Photo Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black uppercase shadow-lg shadow-blue-500/20 overflow-hidden border-2 border-white dark:border-slate-800">
                    {uploadingAdminAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : user?.avatar ? (
                      <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.username ? user.username.charAt(0) : 'A'}</span>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-md cursor-pointer transition-transform">
                    <Camera className="w-3.5 h-3.5" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAdminPhotoUpload}
                      disabled={uploadingAdminAvatar}
                    />
                  </label>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Administrator Profile Photo (የአድሚን መገለጫ ፎቶ)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Upload a high-resolution avatar for your administrator profile.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    {uploadingAdminAvatar ? 'Uploading...' : 'Choose Photo (ፎቶ ጫን)'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAdminPhotoUpload}
                      disabled={uploadingAdminAvatar}
                    />
                  </label>
                </div>
              </div>

              {/* Form to update credentials */}
              <form onSubmit={handleUpdateAdminCredentials} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Administrator Username (የአድሚን መለያ ስም) *
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="e.g. store_admin"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Administrator Full Name
                    </label>
                    <input
                      type="text"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      placeholder="e.g. Head Store Administrator"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Admin Notification Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@pcstore.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Change Administrator Master Password (የይለፍ ቃል መቀየሪያ)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Current Password (የአሁኑ የይለፍ ቃል)
                      </label>
                      <input
                        type="password"
                        value={currentAdminPassword}
                        onChange={(e) => setCurrentAdminPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        New Password (አዲስ የይለፍ ቃል)
                      </label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="New strong password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Confirm New Password (ያረጋግጡ)
                      </label>
                      <input
                        type="password"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingCredentials}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {savingCredentials ? 'Saving Credentials...' : 'Save & Secure Admin Credentials (የይለፍ ቃልና መለያ ቀይር)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Lightbox Modal for Payment Proof Screenshot Zoom & Instant Approval */}
      {previewProofUrl && (
        <div 
          onClick={() => {
            setPreviewProofUrl(null);
            setSelectedOrderForApproval(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Payment Verification Receipt
                  {selectedOrderForApproval && (
                    <span className="text-blue-600">#{selectedOrderForApproval.id}</span>
                  )}
                </h3>
                {selectedOrderForApproval && (
                  <p className="text-xs text-slate-500">
                    Customer: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrderForApproval.customer_name}</span> • Amount: <span className="font-bold text-emerald-600">{formatETB(selectedOrderForApproval.total_amount)}</span> ({selectedOrderForApproval.payment_method})
                  </p>
                )}
              </div>

              <button 
                onClick={() => {
                  setPreviewProofUrl(null);
                  setSelectedOrderForApproval(null);
                }}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-2 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img 
                src={previewProofUrl} 
                alt="Payment Proof Receipt" 
                className="max-h-[55vh] w-auto rounded-xl object-contain" 
              />
            </div>

            {/* Modal Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                {selectedOrderForApproval?.transaction_ref && (
                  <span>Transaction Ref: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{selectedOrderForApproval.transaction_ref}</code></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedOrderForApproval && selectedOrderForApproval.payment_status !== 'approved' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleVerifyPayment(selectedOrderForApproval.id, 'rejected');
                        setPreviewProofUrl(null);
                        setSelectedOrderForApproval(null);
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                    >
                      Reject Proof
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleApproveOrder(selectedOrderForApproval.id);
                        setPreviewProofUrl(null);
                        setSelectedOrderForApproval(null);
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Confirm Payment
                    </button>
                  </>
                )}
                {selectedOrderForApproval && selectedOrderForApproval.payment_status === 'approved' && (
                  <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Already Approved & Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. GeForce RTX 4080 Gaming GPU"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category *</label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {categories.map(c => (
                    <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Price (ETB / Birr) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Image Filename or URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="e.g. 2.webp or https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Specifications / Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Feature this product on homepage</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Hardware Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Power Supplies)"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <textarea
                rows={2}
                placeholder="Short description..."
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
