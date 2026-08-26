import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ShoppingBag, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Upload,
  Eye,
  Send,
  X,
  Building2,
  FileText,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';

export default function OrdersPage({ onNavigate }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Chat Modal State
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Proof Upload State
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.orders && data.orders.length > 0 && !expandedOrderId) {
          setExpandedOrderId(data.orders[0].id || data.orders[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const openOrderChat = async (order) => {
    setActiveChatOrder(order);
    setLoadingChat(true);
    try {
      const orderId = order.id || order._id;
      const res = await fetch(`/api/chat/order/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.chat?.messages || []);
      } else {
        setChatMessages([]);
      }
      // Mark as read by customer
      fetch(`/api/chat/${orderId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'customer' })
      }).catch(() => {});
    } catch (err) {
      console.error(err);
      showToast('Error loading chat messages', 'error');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeChatOrder) return;

    setSendingMessage(true);
    const orderId = activeChatOrder.id || activeChatOrder._id;
    const textToSend = chatInput.trim();
    setChatInput('');

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          sender: 'customer',
          sender_name: user?.full_name || user?.username || 'Customer',
          text: textToSend
        })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setChatMessages(prev => [...prev, data.message]);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      showToast(err.message || 'Could not send message', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTriggerUpload = (orderId) => {
    setUploadingOrderId(orderId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingOrderId) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      showToast('Uploading payment screenshot...', 'info');
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Screenshot upload failed');
      }

      // Update order with screenshot
      const updateRes = await fetch(`/api/orders/${uploadingOrderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_proof: uploadData.url,
          payment_status: 'proof_uploaded'
        })
      });

      if (updateRes.ok) {
        showToast('Payment screenshot updated! Admin notified.', 'success');
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Error uploading proof', 'error');
    } finally {
      setUploadingOrderId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    }
    if (s === 'shipped') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          <Truck className="w-3.5 h-3.5" /> In Transit / Dispatched
        </span>
      );
    }
    if (s === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          <Clock className="w-3.5 h-3.5" /> Assembling & Testing
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-3.5 h-3.5" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
        <Clock className="w-3.5 h-3.5" /> Payment Review / Pending
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hidden File Input for Receipt Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            My Orders & Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track hardware shipments, upload Ethiopian bank payment screenshots, and chat directly with Admin
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Shop More Hardware
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-500">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-500">
            You have not placed any hardware orders with this account yet.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
          >
            Explore Hardware & PCs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedOrderId === (order.id || order._id);
            const items = order.items || [];
            return (
              <div
                key={order.id || order._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                {/* Top Summary Bar */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : (order.id || order._id))}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        Order #{order.id || order._id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Placed on {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                        {formatETB(order.total_amount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderChat(order);
                      }}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Chat with Admin regarding this order"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Admin Chat</span>
                    </button>

                    <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-6 animate-in fade-in">
                    
                    {/* Items List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Ordered Items ({items.length})
                      </h4>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 flex items-center justify-center">
                                <img
                                  src={item.image ? (item.image.startsWith('/') ? item.image : `/${item.image}`) : '/2.webp'}
                                  alt={item.name || item.product_name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => { e.currentTarget.src = '/2.webp'; }}
                                />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{item.name || item.product_name}</span>
                                <span className="text-slate-400 text-[11px]">{item.quantity} x {formatETB(item.price)}</span>
                              </div>
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {formatETB((item.quantity || 1) * Number(item.price))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery, Payment & Screenshot Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* Shipping Info */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold uppercase text-[10px] text-slate-400 block">Shipping Recipient</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{order.customer_name || 'Valued Customer'}</p>
                        <p className="text-slate-500">{order.customer_phone || order.phone} • {order.customer_email}</p>
                        <p className="text-slate-500">
                          {typeof order.shipping_address === 'string' ? order.shipping_address : `${order.shipping_address?.address || ''}, ${order.shipping_address?.city || ''}`}
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold uppercase text-[10px] text-slate-400 block">Payment Method</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{order.payment_method}</p>
                        {order.transaction_ref && (
                          <p className="text-[11px] text-slate-500 font-mono">
                            Ref: <span className="text-slate-700 dark:text-slate-300 font-bold">{order.transaction_ref}</span>
                          </p>
                        )}
                        <div className="pt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.payment_proof || order.payment_status === 'approved'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {order.payment_status === 'approved' ? '✓ Payment Verified & Approved' : (order.payment_proof ? 'Proof Uploaded (Reviewing)' : 'Payment Proof Required')}
                          </span>
                        </div>
                      </div>

                      {/* Payment Proof Screenshot Section */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <span className="font-bold uppercase text-[10px] text-slate-400 block">
                          Payment Screenshot (የክፍያ ማረጋገጫ)
                        </span>

                        {order.payment_proof ? (
                          <div className="flex items-center gap-3">
                            <div 
                              onClick={() => setViewingReceiptUrl(order.payment_proof)}
                              className="relative group cursor-pointer w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0"
                            >
                              <img 
                                src={order.payment_proof} 
                                alt="Payment Screenshot" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                                Screenshot Attached
                              </span>
                              <button
                                type="button"
                                onClick={() => handleTriggerUpload(order.id || order._id)}
                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline block"
                              >
                                Replace Screenshot
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-500">No receipt screenshot attached.</p>
                            <button
                              type="button"
                              onClick={() => handleTriggerUpload(order.id || order._id)}
                              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload Screenshot
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Admin Message / Notes if any */}
                    {order.admin_message && (
                      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
                        <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Message from Store Administrator:
                          </strong>
                          <p className="mt-0.5">{order.admin_message}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => openOrderChat(order)}
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-90 shadow-sm transition-opacity"
                      >
                        <MessageSquare className="w-4 h-4" /> Live Chat with Admin about Order #{order.id || order._id}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Live Chat Modal */}
      {activeChatOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Order #{activeChatOrder.id || activeChatOrder._id} Support Chat
                  </h3>
                  <p className="text-[10px] text-slate-400">Direct message with PC Store support & technician</p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[250px] bg-slate-50/30 dark:bg-slate-950/30 text-xs">
              {loadingChat ? (
                <div className="text-center py-10 text-slate-400">Loading conversation...</div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-1">
                  <p className="font-semibold">No messages yet.</p>
                  <p className="text-[11px]">Send a message to inquire about shipping, payment verification, or hardware specs.</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isAdmin = msg.sender === 'admin' || (msg.sender_name && msg.sender_name.toLowerCase().includes('admin'));
                  const isSystem = msg.sender === 'system';
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        isSystem
                          ? 'items-center my-2'
                          : isAdmin
                          ? 'items-start'
                          : 'items-end'
                      }`}
                    >
                      {isSystem ? (
                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-3 py-1 rounded-full text-center max-w-sm">
                          {msg.text}
                        </div>
                      ) : (
                        <div className="max-w-[85%] space-y-1">
                          <div className={`flex items-center gap-1.5 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]">
                                <ShieldAlert className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Admin (አስተዳዳሪ)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                You (እርስዎ)
                              </span>
                            )}
                          </div>
                          <div
                            className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                              isAdmin
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-blue-200 dark:border-blue-900/60 shadow-sm rounded-tl-sm'
                                : 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
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
                })
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
              {[
                'Hello! When will my order be dispatched?',
                'I have uploaded my payment receipt.',
                'Is the warranty card included in the box?'
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setChatInput(sug)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg whitespace-nowrap border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                placeholder="Type your message to support..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={sendingMessage || !chatInput.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {viewingReceiptUrl && (
        <div 
          onClick={() => setViewingReceiptUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setViewingReceiptUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={viewingReceiptUrl} 
              alt="Payment Receipt Screenshot" 
              className="max-h-[80vh] w-auto rounded-2xl object-contain mx-auto" 
            />
            <div className="p-3 text-center text-xs text-slate-500">
              Payment Screenshot Verification Proof
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
