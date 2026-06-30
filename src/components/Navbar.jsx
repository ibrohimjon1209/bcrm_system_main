import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  House, ShoppingCart, Package, Users, ChartBar, Truck,
  Gear, ClipboardText, Bell, User, List, X, SignOut
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { useUnreadCount } from '../hooks/useNotifications';
import mainLogo from '../assets/main_logo.svg';

const mainNavItems = [
  { path: '/',          icon: House,         label: 'Asosiy'   },
  { path: '/sales',     icon: ShoppingCart,  label: 'Sotuv'    },
  { path: '/warehouse', icon: Package,       label: 'Ombor'    },
  { path: '/purchases', icon: Truck,         label: 'Xarid'    },
  { path: '/customers', icon: Users,         label: 'Mijozlar' },
  { path: '/reports',   icon: ChartBar,      label: 'Hisobot'  },
];

const mobileItems = [
  { path: '/',          icon: House,        label: 'Asosiy'   },
  { path: '/sales',     icon: ShoppingCart, label: 'Sotuv'    },
  { path: '/warehouse', icon: Package,      label: 'Ombor'    },
  { path: '/customers', icon: Users,        label: 'Mijozlar' },
  { path: '/reports',   icon: ChartBar,     label: 'Hisobot'  },
];

const SideLink = ({ to, icon: Icon, label, active, badge }) => (
  <Link to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
      active ? 'bg-[#1447E6] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" weight={active ? 'bold' : 'regular'} />
    {label}
    {badge > 0 && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOwner, logout } = useAuth();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = useMemo(() => {
    const count = unreadData?.count;
    if (typeof count === 'number') return count;
    return 0;
  }, [unreadData]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const at = (path) => location.pathname === path;

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const drawerLinks = [
    { to: '/notification', icon: Bell,          label: 'Bildirishnomalar', badge: unreadCount },
    { to: '/profile',      icon: User,          label: 'Profil'            },
    { to: '/audit',        icon: ClipboardText, label: 'Audit Log'         },
    ...(isOwner ? [{ to: '/settings', icon: Gear, label: 'Sozlamalar' }] : []),
  ];

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-white border-r border-slate-100 shadow-sm z-50">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
          <img src={mainLogo} alt="logo" className="w-8 h-8 object-contain shrink-0" />
          <div className="min-w-0">
            <h1 className="text-base font-black text-[#1447E6] tracking-tight truncate">Shaxrixon Balon</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">CRM Tizimi</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {mainNavItems.map((item) => (
            <SideLink key={item.path} to={item.path} icon={item.icon} label={item.label} active={at(item.path)} />
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-slate-50 space-y-0.5">
          <SideLink to="/notification" icon={Bell}          label="Bildirishnomalar" active={at('/notification')} badge={unreadCount} />
          <SideLink to="/audit"        icon={ClipboardText} label="Audit Log"         active={at('/audit')} />
          <SideLink to="/profile"      icon={User}          label="Profil"             active={at('/profile')} />
          {isOwner && <SideLink to="/settings" icon={Gear} label="Sozlamalar" active={at('/settings')} />}
        </div>

        <div className="px-5 py-3 border-t border-slate-50">
          <p className="text-[10px] text-slate-300 font-medium">v2.0.0 · NSD Corporation</p>
        </div>
      </aside>

      {/* ── Mobile bottom bar ──────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-black/10" />
            <div className="relative flex justify-around items-center h-[64px] px-1">
              {mobileItems.map((item) => {
                const Icon = item.icon;
                const active = at(item.path);
                return (
                  <Link key={item.path} to={item.path}
                    className="flex flex-col items-center justify-center gap-0.5 min-w-[44px]"
                  >
                    <div className={`flex items-center justify-center rounded-xl transition-all duration-200 ${
                      active ? 'bg-blue-50 p-2 text-[#1447E6]' : 'p-1.5 text-slate-400'
                    }`}>
                      <Icon
                        className={`transition-all duration-200 ${active ? 'w-5 h-5' : 'w-4 h-4'}`}
                        weight={active ? 'bold' : 'regular'}
                      />
                    </div>
                    <span className={`font-medium leading-none text-[9px] ${active ? 'text-[#1447E6]' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {/* Hamburger → drawer */}
              <button onClick={() => setDrawerOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[44px]"
              >
                <div className="relative flex items-center justify-center rounded-xl p-1.5 text-slate-400">
                  <List className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="font-medium leading-none text-[9px] text-slate-400">Ko'proq</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer (slide-up) ───────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[70] md:hidden"
            style={{ animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <div className="bg-white rounded-t-3xl shadow-2xl">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <img src={mainLogo} alt="" className="w-7 h-7 object-contain" />
                  <p className="text-sm font-black text-slate-800">Shaxrixon Balon</p>
                </div>
                <button onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-3 space-y-1.5">
                {drawerLinks.map((item) => {
                  const Icon = item.icon;
                  const active = at(item.to);
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                        active ? 'bg-[#1447E6] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#1447E6]'}`} />
                      </div>
                      <span className="text-sm font-bold flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="h-px bg-slate-100" />

                <button onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <SignOut className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm font-bold">Tizimdan chiqish</span>
                </button>
              </div>

              <div className="h-6" />
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
