import React, { useState } from 'react';
import {
  FiTrendingUp, FiDollarSign, FiShoppingCart, FiCreditCard,
  FiDownload, FiCalendar, FiPackage, FiUser, FiArrowUpRight,
  FiArrowDownRight, FiBarChart2, FiLoader
} from 'react-icons/fi';
import { useDashboardStats } from '../hooks/useReports';

const Reports = () => {
  const [dateFilter, setDateFilter] = useState('7 kun');
  
  // Map UI filter to API period
  const filterMap = {
    'Bugun': 'today',
    '7 kun': '7kun',
    '30 kun': 'oylik',
    'Yil': 'yillik'
  };

  const { data: stats, isLoading } = useDashboardStats(filterMap[dateFilter]);

  const summaryCards = [
    {
      title: 'Umumiy Tushum',
      value: stats?.total_revenue || 0,
      trend: stats?.revenue_trend || 0,
      icon: FiDollarSign,
      color: 'from-blue-600 to-blue-700',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Sof Foyda',
      value: stats?.total_profit || 0,
      trend: stats?.profit_trend || 0,
      icon: FiTrendingUp,
      color: 'from-blue-500 to-teal-600',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Sotuvlar Soni',
      value: stats?.total_sales_count || 0,
      trend: stats?.sales_trend || 0,
      icon: FiShoppingCart,
      color: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-200',
      isCurrency: false
    },
    {
      title: 'Qarzdorlik',
      value: stats?.total_debt || 0,
      trend: stats?.debt_trend || 0,
      icon: FiCreditCard,
      color: 'from-blue-500 to-pink-600',
      shadow: 'shadow-blue-200'
    }
  ];

  const formatNumber = (num) => {
    return parseFloat(num || 0).toLocaleString('uz-UZ');
  };

  const handleExport = (type) => {
    console.log(`Exporting as ${type}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hisobotlar Markazi</h1>
            <p className="text-sm text-gray-500">Do'koningiz faoliyati haqida tahlillar</p>
          </div>
          <button 
            onClick={() => handleExport('pdf')}
            className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Filter Section */}
        <div className="px-4 mt-6 mb-8">
          <div className="bg-white rounded-3xl p-2 shadow-xl shadow-gray-200/50 flex gap-1">
            {['Bugun', '7 kun', '30 kun', 'Yil'].map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${dateFilter === period
                    ? 'bg-[#1447E6] text-white shadow-lg'
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {summaryCards.map((card, index) => {
                const Icon = card.icon;
                const colors = [
                  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
                  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
                  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' }
                ];
                const theme = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-3xl p-6 shadow-sm border ${theme.border} relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-14 h-14 shrink-0 ${theme.bg} ${theme.text} rounded-2xl flex items-center justify-center shadow-sm`}>
                        <Icon className="w-7 h-7" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 truncate">{card.title}</p>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1 truncate">
                          {formatNumber(card.value)}
                        </h2>
                        <div className={`inline-flex items-center px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${card.trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                          {card.trend >= 0 ? <FiArrowUpRight className="mr-0.5" /> : <FiArrowDownRight className="mr-0.5" />}
                          {Math.abs(card.trend)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="px-6 mb-10">
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Sotuvlar Dinamikasi</h3>
                    <p className="text-sm text-gray-400 mt-1">Kunlik o'sish ko'rsatkichi</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-xs font-semibold text-blue-700">Tushum</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-64 w-full">
                  {stats?.daily_chart && stats.daily_chart.length > 1 ? (
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {[0, 25, 50, 75, 100].map((tick) => (
                        <line
                          key={tick}
                          x1="0" y1={tick} x2="100" y2={tick}
                          stroke="#f1f5f9" strokeWidth="0.5"
                        />
                      ))}

                      <path
                        d={`
                          M 0 100
                          ${stats.daily_chart.map((sale, i) => {
                          const x = (i / (stats.daily_chart.length - 1)) * 100;
                          const maxAmount = Math.max(...stats.daily_chart.map(s => s.amount)) || 1;
                          const y = 100 - (sale.amount / maxAmount) * 80;
                          return `L ${x} ${y}`;
                        }).join(' ')}
                          L 100 100
                          Z
                        `}
                        fill="url(#chartGradient)"
                        className="transition-all duration-1000 ease-in-out"
                      />

                      <path
                        d={`
                          M 0 ${100 - (stats.daily_chart[0].amount / (Math.max(...stats.daily_chart.map(s => s.amount)) || 1)) * 80}
                          ${stats.daily_chart.map((sale, i) => {
                          const x = (i / (stats.daily_chart.length - 1)) * 100;
                          const maxAmount = Math.max(...stats.daily_chart.map(s => s.amount)) || 1;
                          const y = 100 - (sale.amount / maxAmount) * 80;
                          return `L ${x} ${y}`;
                        }).join(' ')}
                        `}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : stats?.daily_chart && stats.daily_chart.length === 1 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-600">
                      <div className="text-4xl font-black mb-2">{formatNumber(stats.daily_chart[0].amount)}</div>
                      <span className="text-sm font-medium text-gray-400">{stats.daily_chart[0].date} holatiga</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <FiBarChart2 className="w-12 h-12 mb-2 opacity-20" />
                      <span className="text-sm font-medium">Grafik uchun ma'lumot yetarli emas</span>
                    </div>
                  )}
                </div>

                {/* X-Axis Labels */}
                <div className="relative mt-6 h-6 w-full">
                  {stats?.daily_chart?.map((sale, i) => {
                    const totalPoints = stats.daily_chart.length;
                    const interval = Math.ceil(totalPoints / 6);
                    if (i % interval !== 0 && i !== totalPoints - 1) return null;

                    return (
                      <span
                        key={i}
                        className="absolute text-[10px] font-semibold text-gray-400 uppercase tracking-tighter"
                        style={{
                          left: `${(i / (totalPoints - 1)) * 100}%`,
                          transform: i === 0 ? 'none' : i === totalPoints - 1 ? 'translateX(-100%)' : 'translateX(-50%)'
                        }}
                      >
                        {sale.date}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Top Products */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Top Mahsulotlar</h3>
                </div>

                <div className="space-y-4">
                  {stats?.top_products?.map((product, index) => (
                    <div key={index} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-400">{product.quantity} dona sotilgan</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{formatNumber(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                  {(!stats?.top_products || stats.top_products.length === 0) && (
                    <p className="text-center text-gray-400 py-4 text-sm">Ma'lumot mavjud emas</p>
                  )}
                </div>
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Top Mijozlar</h3>
                </div>

                <div className="space-y-4">
                  {stats?.top_customers?.map((customer, index) => (
                    <div key={index} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://ui-avatars.com/api/?name=${customer.name}&background=random&color=fff`} alt={customer.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{customer.name}</h4>
                        <p className="text-xs text-gray-400">{customer.orders} ta buyurtma</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{formatNumber(customer.spent)}</p>
                      </div>
                    </div>
                  ))}
                  {(!stats?.top_customers || stats.top_customers.length === 0) && (
                    <p className="text-center text-gray-400 py-4 text-sm">Ma'lumot mavjud emas</p>
                  )}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {stats?.total_revenue === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-32 h-32 bg-gray-100 rounded-[3rem] flex items-center justify-center mb-6">
                  <FiCalendar className="w-16 h-16 text-gray-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hozircha ma'lumot yo'q</h3>
                  <p className="text-gray-500 max-w-[200px] mx-auto text-sm">
                    Tanlangan muddat uchun sotuv ma'lumotlari topilmadi.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
