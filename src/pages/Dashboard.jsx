import React from 'react';
import { FiShoppingCart, FiUsers, FiTrendingUp, FiPackage, FiArrowUpRight, FiLoader, FiActivity } from 'react-icons/fi';
import { useDashboardStats } from '../hooks/useReports';
import { useSales } from '../hooks/useSales';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats('today');
  const { data: recentSalesData, isLoading: salesLoading } = useSales({ limit: 5 });

  const recentSales = recentSalesData?.results || [];

  const statCards = [
    {
      title: 'Bugungi Sotuv',
      value: stats?.total_revenue || 0,
      sub: `${stats?.total_sales_count || 0} ta buyurtma`,
      icon: FiShoppingCart,
      color: 'blue'
    },
    {
      title: 'Faol Mijozlar',
      value: stats?.active_customers_count || 0,
      sub: 'Jami faollik',
      icon: FiUsers,
      color: 'indigo',
      isCurrency: false
    },
    {
      title: 'Sof Foyda',
      value: stats?.total_profit || 0,
      sub: 'Bugungi ko\'rsatkich',
      icon: FiTrendingUp,
      color: 'emerald'
    }
  ];

  if (statsLoading || salesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Xush kelibsiz!</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <FiActivity className="text-blue-500" />
              Tizim normal holatda ishlamoqda
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
            <div className="text-right">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Bugungi sana</p>
              <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('uz-UZ')}</p>
            </div>
            <FiCalendar className="text-blue-600 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 bg-${card.color}-50 rounded-2xl flex items-center justify-center text-${card.color}-600`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-gray-400 group-hover:text-blue-500 transition-colors">
                  <FiArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{card.title}</p>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {card.isCurrency === false ? card.value : `${parseFloat(card.value).toLocaleString()} so'm`}
              </h2>
              <p className="text-sm font-medium text-gray-500">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">So'nggi Sotuvlar</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4">Barchasini ko'rish</button>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
              <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Hali sotuvlar amalga oshirilmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mijoz</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Sana</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">To'lov</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                            {sale.customer_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{sale.customer_name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">ID: #{sale.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <p className="text-sm font-medium text-gray-600">{new Date(sale.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          sale.payment_method === 'NAQD' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {sale.payment_method}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <p className="font-black text-gray-900 text-sm">{parseFloat(sale.final_amount).toLocaleString()} so'm</p>
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

// Mock FiCalendar for now if not imported
const FiCalendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

export default Dashboard;
