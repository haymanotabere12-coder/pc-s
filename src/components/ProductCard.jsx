import React from 'react';
import { ShoppingCart, Eye, Heart, Star, Check, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';

export default function ProductCard({ product, onSelectProduct, onQuickView, onNavigate }) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id || product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in or create an account to add items to your cart.', 'info');
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
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isFavorited ? `Removed "${product.name}" from wishlist` : `Added "${product.name}" to wishlist`,
      'info'
    );
  };

  // Image source resolver
  const getImgSrc = (img) => {
    if (!img) return '/2.webp';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) {
      return img;
    }
    return `/${img}`;
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      id={`product-card-${product.id || product._id}`}
    >
      {/* Top Media & Badges */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800/60 overflow-hidden flex items-center justify-center p-6">
        <img
          src={getImgSrc(product.image)}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = '/2.webp'; }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.featured ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm">
              Featured
            </span>
          ) : null}
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              Sold Out
            </span>
          ) : product.stock < 5 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        {/* Wishlist & Quick View Hover Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlist}
            aria-label="Wishlist"
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-transform active:scale-90 ${
              isFavorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              aria-label="Quick View"
              className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-blue-600 backdrop-blur-md shadow-md transition-transform active:scale-90"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider">
              {product.category_name || 'Hardware'}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                {product.rating || '4.8'}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400">
                {formatETB(product.price)}
              </span>
            </div>
          </div>

          {isAdmin ? (
            <span 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              title="Admin Mode: Product management & stock inspection"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Stock: {product.stock}</span>
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                isOutOfStock
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
