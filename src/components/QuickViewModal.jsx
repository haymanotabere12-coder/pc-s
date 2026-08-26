import React, { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Check, ShieldCheck, Truck, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';

export default function QuickViewModal({ product, onClose, onSelectProduct, onNavigate }) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id || product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please sign in or create an account to add items to your cart.', 'info');
      onClose();
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }
    if (isAdmin) {
      showToast('Admin Mode: Administrators cannot place purchase orders.', 'info');
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity}x "${product.name}" to your cart!`, 'success');
    onClose();
  };

  const getImgSrc = (img) => {
    if (!img) return '/2.webp';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Area */}
        <div className="md:w-1/2 bg-slate-50 dark:bg-slate-800/40 p-8 flex items-center justify-center relative">
          <img
            src={getImgSrc(product.image)}
            alt={product.name}
            className="max-h-72 w-full object-contain"
            onError={(e) => { e.currentTarget.src = '/2.webp'; }}
          />
          {product.featured ? (
            <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              Featured Tech
            </span>
          ) : null}
        </div>

        {/* Right Info Area */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {product.category_name || 'Hardware'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({product.reviews_count || 18} customer reviews)
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 pt-2">
              {formatETB(product.price)}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
              {product.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {isAdmin ? (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Admin Mode (Current Stock: {product.stock} units)</span>
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Purchasing disabled</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Quantity Picker */}
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(isFavorited ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
                  }}
                  className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-colors ${
                    isFavorited ? 'bg-rose-50 border-rose-300 text-rose-500 dark:bg-rose-950/40' : 'text-slate-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onSelectProduct(product);
              }}
              className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
            >
              View Full Product Specifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
