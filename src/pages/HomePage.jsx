import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Monitor, 
  Laptop, 
  HardDrive, 
  ShieldCheck, 
  Flame, 
  Zap, 
  TrendingUp,
  Award
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { formatETB } from '../utils/currency';

export default function HomePage({ 
  products = [], 
  categories = [], 
  onNavigate, 
  onSelectProduct, 
  onQuickView 
}) {
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  const latestDrops = [...products].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-8 mt-4 border border-slate-800 shadow-2xl">
        {/* Glow and Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen RTX 40 & Intel 14th Gen In Stock
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
              Unleash Maximum <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Computing Power.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Explore high-performance custom rigs, workstation laptops, 240Hz monitors, and authentic gaming hardware with manufacturer warranty and express delivery.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:translate-x-0.5 active:scale-95"
              >
                Shop All Hardware <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('shop', { categoryId: 1 })}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all active:scale-95"
              >
                Explore Laptops
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400">Authentic Parts</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">24/7</div>
                <div className="text-xs text-slate-400">Tech Support</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">2 Years</div>
                <div className="text-xs text-slate-400">Store Warranty</div>
              </div>
            </div>
          </div>

          {/* Hero Featured Card Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-800/60 to-slate-900/80 p-6 rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-md">
              <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                Best Seller
              </div>
              
              <div className="aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/40 mb-4 p-4">
                <img
                  src="/4.avif"
                  alt="Desktop Tower Beast"
                  className="max-h-64 object-contain hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = '/2.webp'; }}
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400">Flagship Gaming Rig</span>
                <h3 className="text-lg font-bold text-white leading-snug">Desktop Tower Beast RTX 4090</h3>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-extrabold text-white">{formatETB(295000)}</span>
                  <button
                    onClick={() => onNavigate('shop', { categoryId: 2 })}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    View Rigs
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Shop by Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Discover hardware tailored to your workflow and gaming style</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id || cat._id}
              onClick={() => onNavigate('shop', { categoryId: cat.id || cat._id })}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg dark:hover:border-blue-500 transition-all text-center group flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 block truncate">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Explore</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Featured Hardware</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hand-picked top tier machines and components</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('shop', { featuredOnly: true })}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            See All Featured <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* Promotional Specs Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md">
              Special Promotion
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Upgrade Your Battle Station with Custom RTX Rigs
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Every PC is hand-assembled, benchmarked under heavy synthetic loads, and ships with clean cable routing and genuine Windows 11 Pro.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop', { categoryId: 2 })}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Customize Your PC Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Drops / New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">New Arrivals</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fresh stock just added to our warehouse</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestDrops.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
