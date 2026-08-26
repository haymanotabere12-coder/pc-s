import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag, 
  Smartphone, 
  Building2, 
  DollarSign, 
  Package,
  Upload,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';

export default function CheckoutPage({ 
  checkoutData = {}, 
  onNavigate, 
  onOrderCompleted 
}) {
  const { cart, clearCart, subtotal } = useCart();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Addis Ababa');
  const [postalCode, setPostalCode] = useState('1000');
  
  // Payment Options
  const [selectedMethod, setSelectedMethod] = useState('cbe');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (!user) {
      showToast('Please sign in or create an account to proceed to checkout.', 'info');
      onNavigate('login');
    }
  }, [user]);

  const paymentOptions = [
    {
      id: 'cbe',
      name: 'Commercial Bank of Ethiopia (CBE)',
      shortName: 'CBE Bank Transfer',
      accountNumber: '1000 1234 56789',
      accountName: 'PC Store PLC (Haymanot A.)',
      branch: 'Addis Ababa Main Branch',
      icon: Building2,
      badge: 'Most Popular in Ethiopia',
      instructions: 'Send payment to the CBE account above using CBE Mobile or CBE Birr, then upload your transaction screenshot receipt below.'
    },
    {
      id: 'telebirr',
      name: 'Telebirr SuperApp',
      shortName: 'Telebirr Mobile Payment',
      accountNumber: '0925692705',
      accountName: 'PC Store Tech (Haymanot A.)',
      branch: 'Telebirr Merchant',
      icon: Smartphone,
      badge: 'Instant Transfer',
      instructions: 'Send payment to 0925692705 via Telebirr SuperApp, then upload your payment confirmation screenshot or enter the transaction reference.'
    },
    {
      id: 'boa',
      name: 'Bank of Abyssinia (BOA)',
      shortName: 'Bank of Abyssinia',
      accountNumber: '2000 9876 54321',
      accountName: 'PC Store PLC',
      branch: 'Bole Medhanealem Branch',
      icon: Building2,
      badge: 'BOA Mobile & Web',
      instructions: 'Transfer to the Bank of Abyssinia account via BOA Mobile or branch deposit, and attach the receipt screenshot.'
    },
    {
      id: 'awash',
      name: 'Awash Bank',
      shortName: 'Awash Bank Transfer',
      accountNumber: '0132 0876 5432 10',
      accountName: 'PC Store PLC',
      branch: 'Sarbet Branch',
      icon: Building2,
      badge: 'Awash Birr & Online',
      instructions: 'Transfer via Awash Bank Mobile or Awash Birr, and upload the payment receipt confirmation.'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery (Addis Ababa)',
      shortName: 'Cash on Delivery',
      accountNumber: 'PAY-ON-HANDOVER',
      accountName: 'Direct Payment to Courier',
      branch: 'Doorstep Service',
      icon: DollarSign,
      badge: 'Inspect First',
      instructions: 'Inspect your hardware upon doorstep delivery in Addis Ababa and pay securely in cash or instant bank transfer.'
    }
  ];

  const currentOption = paymentOptions.find(p => p.id === selectedMethod) || paymentOptions[0];

  const discountPercent = checkoutData.discountPercent || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 15000 || subtotal === 0 ? 0 : 500;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const grandTotal = checkoutData.grandTotal || Math.max(0, subtotal - discountAmount + shippingFee + estimatedTax);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName}: ${text}`, 'success');
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, JPEG, WEBP).', 'error');
      return;
    }

    setUploadingReceipt(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setPaymentProofUrl(data.url);
        showToast('Payment receipt screenshot uploaded successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to upload screenshot');
      }
    } catch (err) {
      showToast(err.message || 'Error uploading receipt', 'error');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !phone.trim()) {
      showToast('Please fill in all required shipping and contact fields.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping cart is empty.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customer_name: fullName.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        shipping_address: {
          address: address.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
          country: 'Ethiopia'
        },
        items: cart.map(item => ({
          product_id: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image
        })),
        subtotal,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        tax: estimatedTax,
        total_amount: grandTotal,
        payment_method: currentOption.name,
        payment_proof: paymentProofUrl || null,
        transaction_ref: transactionRef.trim() || null,
        notes: notes.trim()
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      setOrderSuccess(data.order);
      clearCart();
      showToast('Order placed successfully! Admin is reviewing your payment.', 'success');
      if (onOrderCompleted) onOrderCompleted(data.order);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error creating order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Order Submitted & Linked to Support
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Your hardware order reference is <strong className="text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">#{orderSuccess.id || orderSuccess._id}</strong>. A confirmation message and support thread have been created.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-left max-w-xl mx-auto space-y-4 text-xs">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-500">Recipient</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{orderSuccess.customer_name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-500">Delivery Address</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{orderSuccess.shipping_address?.address}, {orderSuccess.shipping_address?.city}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-500">Payment Option</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{orderSuccess.payment_method}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-500">Payment Proof</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {orderSuccess.payment_proof ? '✓ Screenshot Uploaded' : 'Pending Screenshot'}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Total Amount</span>
            <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400">
              {formatETB(orderSuccess.total_amount)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('orders')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" /> Track Order & View Admin Chat
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // If user is Admin, block checkout with clear instructions
  if (isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full">
            Admin Mode Active (የአድሚን አካውንት)
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Purchasing Restricted for Administrators
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            አድሚኖች እቃዎችን መግዛት አይችሉም። የአድሚን ዋና ኃላፊነት አዳዲስ እቃዎችን ማከል (Add Products) እና የደንበኞችን ትዕዛዞችና ክፍያዎች ማረጋገጥ (Process Orders & Payments) ብቻ ነው።
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> ወደ አድሚን ዳሽቦርድ (Go to Admin)
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
          >
            ወደ መነሻ ገጽ (Storefront)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <button
          onClick={() => onNavigate('cart')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Secure Hardware Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pay with Ethiopian Bank Transfer, Telebirr, or Cash on Delivery with payment screenshot verification
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Contact Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" /> 1. Shipping & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. abebe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number (Ethiopia) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0925692705 or +(251) 911223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Street / Area Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bole Subcity, Atlas / 22 Mazoria, Tech Mall"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Addis Ababa / Hawassa / Bahir Dar"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  disabled
                  value="Ethiopia 🇪🇹"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> 2. Ethiopian Payment Options
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                Official Account Numbers
              </span>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethod(opt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedPayment"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedMethod(opt.id)}
                      className="mt-1 text-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {opt.name}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {opt.accountNumber}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {opt.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Bank Account Information Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/90 dark:to-slate-800/50 border border-blue-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" /> Transfer Destination Details
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                  {currentOption.shortName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Number / Phone</span>
                    <strong className="text-slate-900 dark:text-white font-mono text-sm tracking-wide">
                      {currentOption.accountNumber}
                    </strong>
                  </div>
                  {currentOption.accountNumber !== 'PAY-ON-HANDOVER' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentOption.accountNumber, 'Account Number')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'Account Number' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Account Name / Beneficiary</span>
                  <strong className="text-slate-900 dark:text-white truncate block">
                    {currentOption.accountName}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                ℹ️ {currentOption.instructions}
              </p>
            </div>

            {/* Receipt Screenshot Upload Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" /> Upload Payment Screenshot / Receipt (የክፍያ ማረጋገጫ ስክሪን ሾት)
                </label>
                <span className="text-[10px] text-slate-400">Image (PNG, JPG, WEBP)</span>
              </div>

              {paymentProofUrl ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={paymentProofUrl} 
                      alt="Payment Proof" 
                      className="w-16 h-16 rounded-xl object-cover border border-emerald-300 dark:border-emerald-700 shadow-sm" 
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Screenshot Attached!
                      </span>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        Admin will review and approve this payment receipt.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentProofUrl('')}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors"
                    title="Remove Screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleReceiptUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center mb-2">
                    {uploadingReceipt ? <div className="animate-spin text-sm">⏳</div> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {uploadingReceipt ? 'Uploading payment screenshot...' : 'Click to select or drag & drop payment screenshot'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Attach Telebirr receipt SMS, CBE Mobile Banking confirmation, or deposit slip
                  </p>
                </div>
              )}

              {/* Transaction Ref Input */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Transaction Reference / FT Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. FT2605891048 or Telebirr Trans ID 19828472"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Order Notes */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Order Notes / Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Call before delivery, testing request, leave with front desk..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Items Summary & Submit */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm sticky top-24">
          
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Items in Order</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              {cart.length} hardware items
            </span>
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id || item._id} className="flex items-center gap-3 text-xs">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.image ? (item.image.startsWith('/') ? item.image : `/${item.image}`) : '/2.webp'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.currentTarget.src = '/2.webp'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                  <p className="text-slate-400 text-[11px]">{item.quantity} x {formatETB(item.price)}</p>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatETB((item.quantity || 1) * Number(item.price))}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatETB(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Savings</span>
                <span>-{formatETB(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Express Delivery Fee</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE SHIPPING</strong> : formatETB(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (5%)</span>
              <span>{formatETB(estimatedTax)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Grand Total</span>
              <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                {formatETB(grandTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            id="place-order-button"
          >
            <ShieldCheck className="w-5 h-5" />
            {submitting ? 'Placing Hardware Order...' : `Confirm & Place Order (${formatETB(grandTotal)})`}
          </button>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 space-y-1 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Instant Admin Chat Support
            </div>
            <p>After placing your order, an admin support thread will be opened where you can chat and track shipping in real time.</p>
          </div>

        </div>

      </form>

    </div>
  );
}
