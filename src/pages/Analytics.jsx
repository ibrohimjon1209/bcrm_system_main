import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiActivity } from 'react-icons/fi';
import { useDashboardStats } from '../hooks/useReports';
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '../hooks/useProducts';
import { fmtUZS, fmtUSD, fmtNum } from '../utils/formatters';

const PERIODS = [
  { key: 'today', label: 'Bugun' },
  { key: '7kun',  label: '7 kun' },
  { key: 'oylik', label: '30 kun' },
  { key: 'yillik',label: 'Yil'   },
];

const COLORS = ['#1447E6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ icon: Icon, label, value, sub, color = 'blue' }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600'   },
    green:  { bg: 'bg-green-50',  text: 'text-green-600'  },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600'  },
    red:    { bg: 'bg-red-50',    text: 'text-red-600'    },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${c.text}`} />
      </div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
};

const Analytics = () => {
  const [period, setPeriod] = useState('oylik');
  const { data: stats, isLoading } = useDashboardStats(period);
  const { data: customersData } = useCustomers({ page_size: 1 });
  const { data: productsData } = useProducts({ page_size: 1 });

  const dailyData = stats?.daily_chart || stats?.chart_data || [];
  const topProducts = stats?.top_products || [];
  const topCustomers = stats?.top_customers || [];

  const revenueUZS = parseFloat(stats?.total_revenue_uzs || stats?.revenue_uzs || 0);
  const revenueUSD = parseFloat(stats?.total_revenue_usd || stats?.revenue_usd || 0);
  const profit = parseFloat(stats?.profit || stats?.total_profit || 0);
  const salesCount = stats?.sales_count || stats?.total_sales || 0;
  const debtUZS = parseFloat(stats?.total_debt_uzs || stats?.debt_uzs || 0);

  // Pie chart data from top products
  const pieData = topProducts.slice(0, 5).map((p, i) => ({
    name: p.name || p.product_name,
    value: parseFloat(p.revenue || p.total || 0),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 md:px-8 pt-10 pb-12 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute top-14 -right-4 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FiActivity className="text-white w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-white text-xl font-black">Analitika</h1>
              <p className="text-blue-200 text-xs">Biznes ko'rsatkichlari</p>
            </div>
          </div>
          {/* Period buttons */}
          <div className="flex gap-2 flex-wrap">
            {PERIODS.map((p) => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p.key ? 'bg-white text-[#1447E6]' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 relative z-10 max-w-5xl mx-auto space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 flex justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard icon={FiDollarSign} label="Tushum (so'm)" value={fmtUZS(revenueUZS)} color="blue" />
              <StatCard icon={FiDollarSign} label="Tushum ($)" value={fmtUSD(revenueUSD)} color="green" />
              <StatCard icon={FiTrendingUp} label="Foyda" value={fmtUZS(profit)} color="purple" />
              <StatCard icon={FiShoppingCart} label="Sotuvlar" value={fmtNum(salesCount)} sub="ta bitim" color="amber" />
              <StatCard icon={FiUsers} label="Mijozlar" value={fmtNum(customersData?.count || 0)} color="blue" />
              <StatCard icon={FiPackage} label="Mahsulotlar" value={fmtNum(productsData?.count || 0)} color="green" />
              <StatCard icon={FiDollarSign} label="Umumiy qarz" value={fmtUZS(debtUZS)} color="red" />
            </div>

            {/* Sales trend chart */}
            {dailyData.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-gray-800 mb-4">Sotuv trendi</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                    />
                    <Tooltip
                      formatter={(val) => [val?.toLocaleString() + ' so\'m', 'Sotuv']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#1447E6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    {dailyData[0]?.total_usd !== undefined && (
                      <Line type="monotone" dataKey="total_usd" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Top products */}
              {topProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 mb-4">Top mahsulotlar</h2>
                  <div className="space-y-3">
                    {topProducts.slice(0, 6).map((p, i) => {
                      const rev = parseFloat(p.revenue || p.total || 0);
                      const maxRev = parseFloat(topProducts[0]?.revenue || topProducts[0]?.total || 1);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs font-black text-gray-300 w-5 text-right">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-gray-800 truncate">{p.name || p.product_name}</p>
                              <p className="text-xs font-black text-[#1447E6] ml-2 shrink-0">{fmtUZS(rev)}</p>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1447E6] rounded-full"
                                style={{ width: `${maxRev > 0 ? (rev / maxRev) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Top customers */}
              {topCustomers.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 mb-4">Top mijozlar</h2>
                  <div className="space-y-3">
                    {topCustomers.slice(0, 6).map((c, i) => {
                      const spent = parseFloat(c.total_spent || c.total || 0);
                      const maxSpent = parseFloat(topCustomers[0]?.total_spent || topCustomers[0]?.total || 1);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs font-black text-gray-300 w-5 text-right">{i + 1}</span>
                          <div className="w-7 h-7 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <FiUsers className="text-blue-400 w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-gray-800 truncate">{c.name || c.customer_name}</p>
                              <p className="text-xs font-black text-emerald-600 ml-2 shrink-0">{fmtUZS(spent)}</p>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full"
                                style={{ width: `${maxSpent > 0 ? (spent / maxSpent) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pie chart for product share */}
            {pieData.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-gray-800 mb-4">Mahsulot ulushi</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        paddingAngle={3} dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [val?.toLocaleString() + ' so\'m', '']}
                        contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 shrink-0">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Revenue bar chart */}
            {dailyData.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-gray-800 mb-4">Kunlik taqqoslama</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyData.slice(-14)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                    />
                    <Tooltip
                      formatter={(val) => [val?.toLocaleString() + ' so\'m', '']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 11 }}
                    />
                    <Bar dataKey="total" fill="#1447E6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
