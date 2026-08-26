import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  MessageSquare, 
  ArrowLeft,
  ShieldAlert,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar({ 
  currentSection, 
  onSelectSection, 
  onNavigate,
  pendingApprovalsCount = 0,
  unreadMessagesCount = 0
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { 
      id: 'orders', 
      label: 'Customer Orders', 
      icon: ShoppingCart,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} new` : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { 
      id: 'messages', 
      label: 'Messages & Support', 
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'security', label: 'Admin Security & Login', icon: KeyRound },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5" /> Admin Control
        </div>
        <p className="text-xs text-slate-500 mt-0.5">PC Store Management Console</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-blue-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
        <button
          onClick={() => onNavigate('home')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </button>
      </div>
    </aside>
  );
}
