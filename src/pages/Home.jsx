import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell, FiShoppingCart, FiUsers, FiPackage, FiBarChart2,
  FiLoader, FiTrendingUp, FiAlertCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../hooks/useReports';
import { useLowStockProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';

const Home = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats('today');
  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useLowStockProducts();
  const { data: recentSalesData, isLoading: salesLoading } = useSales({});

  const recentSales = (recentSalesData?.results || []).slice(0, 5);

  const chartData = stats?.daily_chart?.map(item => ({
    name: item.date,
    value: item.amount
  })) || [];

  const today = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (statsLoading || lowStockLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
        <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
      </div>
    );
  }

  const quickActions = [
    { label: 'Sotuv', icon: FiShoppingCart, path: '/sales', bg: 'bg-blue-50', color: 'text-[#1447E6]' },
    { label: 'Mijozlar', icon: FiUsers, path: '/customers', bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Ombor', icon: FiPackage, path: '/warehouse', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Hisobot', icon: FiBarChart2, path: '/reports', bg: 'bg-orange-50', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-28 font-sans">
      {/* Blue gradient header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 pt-12 pb-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute top-16 -right-6 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

        {/* Top bar */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">Xush kelibsiz!</h1>
            <p className="text-blue-200 text-xs mt-0.5 capitalize">{today}</p>
          </div>
          <button
            onClick={() => navigate('/notification')}
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white relative hover:bg-white/20 transition-colors"
          >
            <FiBell className="w-5 h-5" />
            {lowStockProducts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-[#1447E6]" />
            )}
          </button>
        </div>

        {/* Stats 2x2 grid inside header */}
        <div className="grid grid-cols-2 gap-3 relative z-10 mt-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-1">Tushum</p>
            <p className="text-white text-lg font-black leading-tight">{parseFloat(stats?.total_revenue || 0).toLocaleString()}</p>
            <p className="text-blue-300 text-[10px] font-medium">so'm</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-1">Foyda</p>
            <p className="text-white text-lg font-black leading-tight">{parseFloat(stats?.total_profit || 0).toLocaleString()}</p>
            <p className="text-blue-300 text-[10px] font-medium">so'm</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-1">Qarzdorlar</p>
            <p className="text-white text-lg font-black leading-tight">{stats?.debtors_count || 0}</p>
            <p className="text-blue-300 text-[10px] font-medium">ta mijoz</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest mb-1">Mahsulotlar</p>
            <p className="text-white text-lg font-black leading-tight">{stats?.total_products_count || 0}</p>
            <p className="text-blue-300 text-[10px] font-medium">dona</p>
          </div>
        </div>
      </div>

      {/* Content overlapping header */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Tezkor amallar */}
          <div className="p-5 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Tezkor amallar</h2>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="p-5 border-b border-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">Sotuv dinamikasi</h2>
                <FiTrendingUp className="text-[#1447E6] w-4 h-4" />
              </div>
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1447E6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5, fill: '#1447E6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent sales */}
          {!salesLoading && recentSales.length > 0 && (
            <div className="p-5 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-700 mb-3">So'nggi harakatlar</h2>
              <div className="space-y-2">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center font-bold text-[#1447E6] text-xs">
                        {sale.customer_name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{sale.customer_name}</p>
                        <p className="text-[10px] text-gray-400">{new Date(sale.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{parseFloat(sale.total || 0).toLocaleString()} so'm</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low stock */}
          {lowStockProducts.length > 0 && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <FiAlertCircle className="text-red-500 w-4 h-4" />
                  Kam qolgan mahsulotlar
                </h2>
                <button
                  onClick={() => navigate('/warehouse')}
                  className="text-[10px] font-bold text-[#1447E6] uppercase tracking-widest"
                >
                  Barchasini ko'rish
                </button>
              </div>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                        <FiPackage className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{product.name}</p>
                        <p className="text-[10px] text-gray-400">{product.category_name}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
