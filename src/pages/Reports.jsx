import React, { useState } from 'react';
import {
  FiTrendingUp, FiDollarSign, FiShoppingCart, FiCreditCard,
  FiCalendar, FiPackage, FiUser, FiArrowUpRight,
  FiArrowDownRight, FiBarChart2, FiLoader
} from 'react-icons/fi';
import { useDashboardStats, useProfitReport, useWarehouseReport } from '../hooks/useReports';

const Reports = () => {
  const [dateFilter, setDateFilter] = useState('7 kun');
  const [activeTab, setActiveTab] = useState('dashboard');

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [profitDateFrom, setProfitDateFrom] = useState(thirtyDaysAgo);
  const [profitDateTo, setProfitDateTo] = useState(today);

  const filterMap = {
    'Bugun': 'today',
    '7 kun': '7kun',
    '30 kun': 'oylik',
    'Yil': 'yillik'
  };

  const { data: stats, isLoading } = useDashboardStats(filterMap[dateFilter]);
  const { data: profitData, isLoading: profitLoading } = useProfitReport(profitDateFrom, profitDateTo);
  const { data: warehouseData, isLoading: warehouseLoading } = useWarehouseReport();

  const formatNumber = (num) => parseFloat(num || 0).toLocaleString('uz-UZ');

  const statCards = [
    {
      title: 'Umumiy Tushum',
      value: stats?.total_revenue || 0,
      trend: stats?.revenue_trend || 0,
      icon: FiDollarSign,
      bg: 'bg-blue-50',
      color: 'text-[#1447E6]',
      isCurrency: true,
    },
    {
      title: 'Sof Foyda',
      value: stats?.total_profit || 0,
      trend: stats?.profit_trend || 0,
      icon: FiTrendingUp,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
      isCurrency: true,
    },
    {
      title: 'Sotuvlar Soni',
      value: stats?.total_sales_count || 0,
      trend: stats?.sales_trend || 0,
      icon: FiShoppingCart,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
      isCurrency: false,
    },
    {
      title: 'Qarzdorlik',
      value: stats?.total_debt || 0,
      trend: stats?.debt_trend || 0,
      icon: FiCreditCard,
      bg: 'bg-orange-50',
      color: 'text-orange-600',
      isCurrency: true,
    },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Umumiy' },
    { id: 'profit', label: 'Foyda' },
    { id: 'warehouse', label: 'Ombor' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-32">
      {/* Blue gradient header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute top-12 -right-4 w-16 h-16 bg-white/5 rounded-full" />
        <h1 className="text-white text-2xl font-bold relative z-10">Hisobotlar</h1>
        <p className="text-blue-200 text-sm mt-0.5 relative z-10">Do'konginiz faoliyati tahlili</p>
      </div>

      <div className="px-4 -mt-5 relative z-10">
        {/* Pill tabs */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === tab.id ? 'bg-[#1447E6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Period filter — dashboard only */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1 mb-4">
            {['Bugun', '7 kun', '30 kun', 'Yil'].map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  dateFilter === period ? 'bg-[#1447E6] text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        )}

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-16">
                <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
              </div>
            ) : (
              <>
                {/* 2x2 stat cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${card.color}`} />
                          </div>
                          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${
                            card.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                          }`}>
                            {card.trend >= 0 ? <FiArrowUpRight className="w-2.5 h-2.5" /> : <FiArrowDownRight className="w-2.5 h-2.5" />}
                            {Math.abs(card.trend)}%
                          </div>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{card.title}</p>
                        <p className="text-base font-black text-gray-900 leading-tight">
                          {card.isCurrency ? formatNumber(card.value) : card.value}
                        </p>
                        {card.isCurrency && <p className="text-[9px] text-gray-400 font-medium">so'm</p>}
                      </div>
                    );
                  })}
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Sotuvlar Dinamikasi</h3>
                      <p className="text-[10px] text-gray-400">Kunlik ko'rsatkich</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                      <div className="w-2 h-2 bg-[#1447E6] rounded-full" />
                      <span className="text-[10px] font-semibold text-[#1447E6]">Tushum</span>
                    </div>
                  </div>

                  <div className="relative h-48 w-full">
                    {stats?.daily_chart && stats.daily_chart.length > 1 ? (
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1447E6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#1447E6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[25, 50, 75].map(tick => (
                          <line key={tick} x1="0" y1={tick} x2="100" y2={tick} stroke="#f1f5f9" strokeWidth="0.8" />
                        ))}
                        <path
                          d={`M 0 100 ${stats.daily_chart.map((s, i) => {
                            const x = (i / (stats.daily_chart.length - 1)) * 100;
                            const max = Math.max(...stats.daily_chart.map(d => d.amount)) || 1;
                            const y = 100 - (s.amount / max) * 80;
                            return `L ${x} ${y}`;
                          }).join(' ')} L 100 100 Z`}
                          fill="url(#chartGrad)"
                        />
                        <path
                          d={`M 0 ${100 - (stats.daily_chart[0].amount / (Math.max(...stats.daily_chart.map(s => s.amount)) || 1)) * 80} ${stats.daily_chart.map((s, i) => {
                            const x = (i / (stats.daily_chart.length - 1)) * 100;
                            const max = Math.max(...stats.daily_chart.map(d => d.amount)) || 1;
                            const y = 100 - (s.amount / max) * 80;
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke="#1447E6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : stats?.daily_chart && stats.daily_chart.length === 1 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#1447E6]">
                        <div className="text-3xl font-black mb-1">{formatNumber(stats.daily_chart[0].amount)}</div>
                        <span className="text-xs font-medium text-gray-400">{stats.daily_chart[0].date}</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <FiBarChart2 className="w-10 h-10 mb-2 opacity-30" />
                        <span className="text-xs">Ma'lumot yetarli emas</span>
                      </div>
                    )}
                  </div>

                  <div className="relative mt-4 h-5 w-full">
                    {stats?.daily_chart?.map((sale, i) => {
                      const total = stats.daily_chart.length;
                      const interval = Math.ceil(total / 5);
                      if (i % interval !== 0 && i !== total - 1) return null;
                      return (
                        <span
                          key={i}
                          className="absolute text-[9px] font-semibold text-gray-400"
                          style={{
                            left: `${(i / (total - 1)) * 100}%`,
                            transform: i === 0 ? 'none' : i === total - 1 ? 'translateX(-100%)' : 'translateX(-50%)'
                          }}
                        >
                          {sale.date}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Top Products + Top Customers */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-[#1447E6]">
                        <FiPackage className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">Top Mahsulotlar</h3>
                    </div>
                    <div className="space-y-3">
                      {stats?.top_products?.map((product, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-xs truncate">{product.name}</h4>
                            <p className="text-[10px] text-gray-400">{product.quantity} dona</p>
                          </div>
                          <p className="font-bold text-gray-900 text-xs shrink-0">{formatNumber(product.revenue)} so'm</p>
                        </div>
                      ))}
                      {(!stats?.top_products || stats.top_products.length === 0) && (
                        <p className="text-center text-gray-400 py-3 text-xs">Ma'lumot mavjud emas</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">Top Mijozlar</h3>
                    </div>
                    <div className="space-y-3">
                      {stats?.top_customers?.map((customer, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-white shadow-sm shrink-0">
                            <img src={`https://ui-avatars.com/api/?name=${customer.name}&background=random&color=fff&size=32`} alt={customer.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-xs truncate">{customer.name}</h4>
                            <p className="text-[10px] text-gray-400">{customer.orders} ta buyurtma</p>
                          </div>
                          <p className="font-bold text-gray-900 text-xs shrink-0">{formatNumber(customer.spent)} so'm</p>
                        </div>
                      ))}
                      {(!stats?.top_customers || stats.top_customers.length === 0) && (
                        <p className="text-center text-gray-400 py-3 text-xs">Ma'lumot mavjud emas</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ===== PROFIT TAB ===== */}
        {activeTab === 'profit' && (
          <div className="space-y-4 pb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Sana oralig'i</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dan</label>
                  <input type="date" value={profitDateFrom} onChange={e => setProfitDateFrom(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gacha</label>
                  <input type="date" value={profitDateTo} onChange={e => setProfitDateTo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]" />
                </div>
              </div>
            </div>

            {profitLoading ? (
              <div className="flex justify-center py-14">
                <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
              </div>
            ) : profitData ? (
              <>
                <div className="space-y-3">
                  {[
                    { label: 'Umumiy Tushum', value: profitData.total_revenue, bg: 'bg-blue-50', color: 'text-[#1447E6]' },
                    { label: 'Umumiy Xarajat', value: profitData.total_cost, bg: 'bg-orange-50', color: 'text-orange-600' },
                    { label: 'Sof Foyda', value: profitData.total_profit, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${item.bg} ${item.color}`}>{item.label}</div>
                      <span className={`text-base font-black ${item.color}`}>{formatNumber(item.value)} so'm</span>
                    </div>
                  ))}
                </div>

                {profitData.daily_data && profitData.daily_data.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Kunlik tahlil</h3>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {profitData.daily_data.map((day, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-xs font-semibold text-gray-500">{day.date}</span>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-900">{formatNumber(day.revenue)} so'm</p>
                            <p className="text-[10px] text-emerald-600 font-semibold">Foyda: {formatNumber(day.profit)} so'm</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 text-gray-400">
                <FiBarChart2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Ma'lumot topilmadi</p>
              </div>
            )}
          </div>
        )}

        {/* ===== WAREHOUSE TAB ===== */}
        {activeTab === 'warehouse' && (
          <div className="space-y-4 pb-4">
            {warehouseLoading ? (
              <div className="flex justify-center py-14">
                <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
              </div>
            ) : warehouseData ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Jami Mahsulotlar', value: warehouseData.total_products, bg: 'bg-blue-50', color: 'text-[#1447E6]', isCurrency: false },
                    { label: 'Jami Miqdor', value: warehouseData.total_quantity, bg: 'bg-purple-50', color: 'text-purple-600', isCurrency: false },
                    { label: 'Tan Narx Qiymati', value: warehouseData.total_cost_value, bg: 'bg-orange-50', color: 'text-orange-600', isCurrency: true },
                    { label: 'Sotuv Narx Qiymati', value: warehouseData.total_sale_value, bg: 'bg-emerald-50', color: 'text-emerald-600', isCurrency: true },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center mb-2`}>
                        <FiPackage className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className={`text-base font-black ${item.color}`}>
                        {item.isCurrency ? `${formatNumber(item.value)} so'm` : formatNumber(item.value)}
                      </p>
                    </div>
                  ))}
                </div>

                {warehouseData.low_stock_products && warehouseData.low_stock_products.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                        <FiPackage className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">Kam Qolgan Mahsulotlar</h3>
                    </div>
                    <div className="space-y-2">
                      {warehouseData.low_stock_products.map((product, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{product.name}</p>
                            <p className="text-[10px] text-gray-400">{product.category_name}</p>
                          </div>
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-xl">
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 text-gray-400">
                <FiPackage className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Ombor ma'lumoti topilmadi</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
