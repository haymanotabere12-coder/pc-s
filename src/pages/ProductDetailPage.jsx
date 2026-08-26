import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Cpu, 
  Check, 
  Share2,
  MessageSquare,
  Shield,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatETB } from '../utils/currency';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ 
  product, 
  allProducts = [], 
  onBack, 
  onSelectProduct, 
  onQuickView,
  onNavigate
}) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Alex M.', rating: 5, date: '2 days ago', comment: 'Absolute powerhouse! Runs Cyberpunk 2077 at max 4K settings with smooth 120+ FPS. Silent cooling fans.' },
    { id: 2, author: 'David K.', rating: 5, date: '1 week ago', comment: 'Build quality is top notch. Delivery was fast and well-packaged. Highly recommended store!' }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500">Product not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id || product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
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
    addToCart(product, quantity);
    showToast(`Added ${quantity}x "${product.name}" to your cart!`, 'success');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast('Thank you! Your verified review has been submitted.', 'success');
  };

  const getImgSrc = (img) => {
    if (!img) return '/2.webp';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  const relatedProducts = allProducts
    .filter(p => (p.category_id === product.category_id || p.categoryId === product.categoryId) && (p.id !== product.id && p._id !== product._id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Navigation Bar */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </button>
      </div>

      {/* Main Product Showcase Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left Column: Product Visuals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-8 overflow-hidden">
            <img
              src={getImgSrc(product.image)}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.currentTarget.src = '/2.webp'; }}
            />
            {product.featured ? (
              <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                Featured Flagship
              </span>
            ) : null}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {product.category_name || 'Hardware'}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {product.rating || '4.9'}
                </span>
                <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                {formatETB(product.price)}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship ({product.stock} available)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex flex-col items-center text-center gap-1 text-slate-600 dark:text-slate-300">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-[11px]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-[11px]">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-slate-600 dark:text-slate-300">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-[11px]">30-Day Return</span>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {isAdmin ? (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Admin Stock & Hardware Inspection Mode</span>
                </div>
                <p className="text-xs text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
                  As an administrator, you cannot place customer purchase orders. This view is for inspecting inventory levels and technical specifications.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold border border-purple-200 dark:border-purple-800">
                    Current Stock: {product.stock} Units
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-xs font-semibold">
                    Category ID: {product.category_id || 1}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Quantity Picker */}
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(isFavorited ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
                  }}
                  className={`p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-colors ${
                    isFavorited ? 'bg-rose-50 border-rose-300 text-rose-500 dark:bg-rose-950/40' : 'text-slate-500'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Verified Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Hardware Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{product.category_name || 'PC Component'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Stock Availability</span>
              <span className="font-semibold text-emerald-600">{product.stock} Units Ready</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Condition</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Brand New (Factory Sealed)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Warranty Coverage</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">24 Months Full Hardware</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{rev.author}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Leave a review */}
            <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Write a Verified Review
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars - Exceptional</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Share your experience with this hardware..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Related Hardware in this Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id || p._id}
                product={p}
                onSelectProduct={onSelectProduct}
                onQuickView={onQuickView}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
