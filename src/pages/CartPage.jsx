import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2,
  X,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';

export default function CartPage({ onNavigate, onSelectProduct }) {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'PCSTORE10') {
      setDiscountPercent(10);
      setAppliedPromo(code);
      showToast('Promo code applied! 10% discount added.', 'success');
    } else if (code === 'GAMER20') {
      setDiscountPercent(20);
      setAppliedPromo(code);
      showToast('Super Gamer Deal! 20% discount added.', 'success');
    } else {
      showToast('Invalid promo code. Try "PCSTORE10" or "GAMER20"', 'error');
    }
  };

  const removePromo = () => {
    setDiscountPercent(0);
    setAppliedPromo('');
    setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 15000 || subtotal === 0 ? 0 : 500;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + estimatedTax);

  const getImgSrc = (img) => {
    if (!img) return '/2.webp';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Looks like you haven't added any tech or components to your cart yet. Explore our latest arrivals or featured setups!
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping Hardware
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your selected hardware ({cart.length} unique items)
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Cart Grid: Items list + Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={item.id || item._id}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              {/* Product Thumbnail */}
              <div 
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <img
                  src={getImgSrc(item.image)}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.currentTarget.src = '/2.webp'; }}
                />
              </div>

              {/* Title & Info */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                  {item.category_name || 'Hardware'}
                </span>
                <h3 
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 cursor-pointer"
                >
                  {item.name}
                </h3>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {formatETB(item.price)} each
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => updateQuantity(item.id || item._id, (item.quantity || 1) - 1)}
                  className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[28px] text-center">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() => updateQuantity(item.id || item._id, (item.quantity || 1) + 1)}
                  className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                >
                  +
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-sm sm:text-base text-blue-600 dark:text-blue-400 min-w-[90px] text-right">
                  {formatETB((Number(item.price) || 0) * (item.quantity || 1))}
                </span>
                <button
                  onClick={() => {
                    removeFromCart(item.id || item._id);
                    showToast(`Removed "${item.name}" from cart`, 'info');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping For Hardware
            </button>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Order Summary
          </h2>

          {/* Promo Code Form */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Have a Discount / Promo Code?
            </label>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {appliedPromo} ({discountPercent}% OFF)
                </span>
                <button onClick={removePromo} className="text-emerald-700 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PCSTORE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Pricing Calculation Lines */}
          <div className="space-y-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatETB(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount ({discountPercent}%)</span>
                <span>-{formatETB(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatETB(shippingFee)}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Sales Tax (5%)</span>
              <span>{formatETB(estimatedTax)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline text-slate-900 dark:text-white">
              <span className="font-bold text-sm">Estimated Total</span>
              <span className="font-black text-xl text-blue-600 dark:text-blue-400">{formatETB(grandTotal)}</span>
            </div>
          </div>

          {/* Checkout Button / Admin Restriction */}
          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Admin Notice</span>
              </div>
              <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
                Store administrators cannot place customer purchases. Please use a customer account or use the dashboard to manage inventory.
              </p>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Go to Admin Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  showToast('Please sign in or create an account to proceed to checkout.', 'info');
                  onNavigate('login');
                  return;
                }
                onNavigate('checkout', { grandTotal, discountAmount, discountPercent, appliedPromo });
              }}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              id="proceed-checkout-btn"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted & Protected Checkout</span>
          </div>

        </div>

      </div>

    </div>
  );
}
