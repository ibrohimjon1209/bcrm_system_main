import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiBriefcase, FiCreditCard, FiLifeBuoy,
  FiClipboard, FiLogOut, FiMenu, FiX, FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const navItems = [
  { path: '/base_bcrm',               icon: FiGrid,        label: 'Dashboard'      },
  { path: '/base_bcrm/companies',     icon: FiBriefcase,   label: 'Kompaniyalar'   },
  { path: '/base_bcrm/subscriptions', icon: FiCreditCard,  label: 'Obunalar'       },
  { path: '/base_bcrm/support',       icon: FiLifeBuoy,    label: 'Support'        },
  { path: '/base_bcrm/audit',         icon: FiClipboard,   label: 'Audit Log'      },
];

const SuperAdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Chiqildi');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <FiShield className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm tracking-tight">BCRM Platform</h1>
            <p className="text-gray-400 text-[10px]">Super Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-4 py-2 mb-2">
          <p className="text-white text-xs font-semibold truncate">{user?.full_name || user?.phone}</p>
          <p className="text-gray-400 text-[10px]">Super Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-all duration-150"
        >
          <FiLogOut className="w-4 h-4 shrink-0" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-gray-900 border-r border-gray-800 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-gray-900 flex flex-col h-full z-10">
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
            <FiMenu className="w-5 h-5" />
          </button>
          <span className="text-white font-bold text-sm">BCRM Platform</span>
        </div>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
