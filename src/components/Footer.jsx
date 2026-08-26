import React from 'react';
import { Laptop, Phone, Mail, MapPin, Shield, RefreshCw, Truck, CreditCard } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fast Nationwide Delivery</h4>
              <p className="text-xs text-slate-400">Doorstep delivery within 24-48 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Hardware</h4>
              <p className="text-xs text-slate-400">Authentic parts with brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
              <p className="text-xs text-slate-400">Cards, Telebirr, Cash & PayPal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PC STORE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier hardware & computing destination. We provide cutting-edge gaming rigs, workstation laptops, monitors, GPUs, and certified peripherals at competitive prices.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+(251) 925692705</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>info@pcstore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop Hardware</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('shop', { categoryId: 1 })} className="hover:text-white transition-colors">
                  Laptops & Ultrabooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categoryId: 2 })} className="hover:text-white transition-colors">
                  Desktop Gaming PCs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categoryId: 7 })} className="hover:text-white transition-colors">
                  Graphics Cards (RTX GPUs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categoryId: 3 })} className="hover:text-white transition-colors">
                  Gaming Monitors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categoryId: 4 })} className="hover:text-white transition-colors">
                  Mechanical Keyboards
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Help & Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                  Account Settings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Hardware Warranty
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Tech News & Drops</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive hardware discounts, flash sale alerts, and tech drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to PC Store tech drops!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PC Store. All rights reserved. Powered by Node.js & React with MongoDB.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-400">Privacy Policy</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-400">Terms of Service</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-400">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
