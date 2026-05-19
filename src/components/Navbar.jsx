import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiTruck
} from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: FiHome,
      label: 'Asosiy',
      id: 'dashboard'
    },
    {
      path: '/sales',
      icon: FiShoppingCart,
      label: 'Sotuv',
      id: 'sales',
    },
    {
      path: '/warehouse',
      icon: FiPackage,
      label: 'Ombor',
      id: 'warehouse'
    },
    {
      path: '/purchases',
      icon: FiTruck,
      label: 'Xarid',
      id: 'purchases'
    },
    {
      path: '/customers',
      icon: FiUsers,
      label: 'Mijozlar',
      id: 'customers'
    },
    {
      path: '/reports',
      icon: FiBarChart2,
      label: 'Hisobot',
      id: 'reports'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-3 mb-3">
        <div className="relative">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-black/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-white/60 rounded-3xl" />

          {/* Navigation items */}
          <div className="relative flex justify-around items-center h-[68px] px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-out min-w-[48px]"
                >
                  {/* Icon container */}
                  <div
                    className={`
                      relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
                      ${isActive
                        ? 'bg-blue-50 p-2 text-[#1447E6]'
                        : 'p-1.5 text-gray-400 hover:text-gray-600'
                      }
                    `}
                  >
                    <Icon
                      className={`transition-all duration-300 ${isActive ? 'w-5 h-5' : 'w-4 h-4'}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`font-medium transition-all duration-300 leading-none ${
                      isActive
                        ? 'text-[#1447E6] text-[9px]'
                        : 'text-gray-400 text-[9px]'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active pill dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1447E6] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
