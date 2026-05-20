import React from 'react';
import { FiShoppingCart, FiUsers, FiTrendingUp, FiPackage, FiArrowUpRight, FiLoader, FiActivity, FiCalendar } from 'react-icons/fi';
import { useDashboardStats, useProfitReport } from '../hooks/useReports';
import { useSales } from '../hooks/useSales';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats('today');
  const { data: profitData, isLoading: profitLoading } = useProfitReport('', '');
  const { data: recentSalesData, isLoading: salesLoading } = useSales({});

  const recentSales = recentSalesData?.results || [];

  const statCards = [
    {
      title: 'Umumiy Tushum',
      value: profitData?.revenue || 0,
      sub: `Jami tushum`,
      icon: FiShoppingCart,
      bg: 'bg-blue-50',
      color: 'text-[#1447E6]',
      isCurrency: true,
      onClick: () => navigate('/reports')
    },
    {
      title: 'Faol Mijozlar',
      value: stats?.active_customers_count || 0,
      sub: 'Jami faollik',
      icon: FiUsers,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
      isCurrency: false
    },
    {
      title: 'Sof Foyda',
      value: profitData?.net_profit || profitData?.profit || 0,
      sub: 'Jami foyda',
      icon: FiTrendingUp,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
      isCurrency: true,
      onClick: () => navigate('/reports')
    }
  ];

  if (statsLoading || salesLoading || profitLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
        <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
      </div>
    );
  }

  if (statsError && !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F4FF] gap-4 px-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <FiActivity className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-500 text-center text-sm">Statistika yuklanmadi. Server vaqtincha ishlamayapti.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1447E6] text-white rounded-2xl font-semibold text-sm hover:bg-blue-700"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Xush kelibsiz!</h1>
            <p className="text-gray-400 mt-0.5 flex items-center gap-2 text-sm">
              <FiActivity className="text-[#1447E6] w-4 h-4" />
              Tizim normal holatda ishlamoqda
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100">
            <div className="text-right">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Bugungi sana</p>
              <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('uz-UZ')}</p>
            </div>
            <FiCalendar className="text-[#1447E6] w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-7">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={card.onClick}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group hover:border-[#1447E6]/30 hover:shadow-md transition-all duration-300 ${card.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="bg-gray-50 p-1.5 rounded-xl text-gray-400 group-hover:text-[#1447E6] group-hover:bg-blue-50 transition-colors">
                  <FiArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{card.title}</p>
              <h2 className="text-2xl font-black text-gray-900 mb-1.5">
                {card.isCurrency ? `${parseFloat(card.value || 0).toLocaleString()} so'm` : card.value}
              </h2>
              <p className="text-xs font-medium text-gray-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">So'nggi Sotuvlar</h2>
            <button className="text-xs font-bold text-[#1447E6] hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors">
              Barchasini ko'rish
            </button>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <FiPackage className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium text-sm">Hali sotuvlar amalga oshirilmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50 rounded-xl">
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-l-xl">Mijoz</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Sana</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">To'lov</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right rounded-r-xl">Summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-[#1447E6] text-sm shrink-0">
                            {sale.customer_name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{sale.customer_name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">#{sale.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <p className="text-sm font-medium text-gray-700">{new Date(sale.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          sale.payment_method === 'cash' ? 'bg-emerald-50 text-emerald-600' :
                          sale.payment_method === 'card' ? 'bg-blue-50 text-blue-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {sale.payment_method_display || sale.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-black text-gray-900 text-sm">{parseFloat(sale.total || 0).toLocaleString()} so'm</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
