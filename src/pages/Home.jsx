import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronDown, FiAlertTriangle, FiLoader, FiTrendingUp, FiPackage, FiUsers } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../hooks/useReports';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats('today');
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 5 }); // Just to get some products

  const lowStockProducts = productsData?.results?.filter(p => p.quantity < 10) || [];

  const chartData = stats?.daily_chart?.map(item => ({
    name: item.date,
    value: item.amount
  })) || [];

  if (statsLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-28 text-slate-800">
      {/* Top Navbar */}
      <div className="bg-blue-700 text-white px-5 pt-12 pb-6 rounded-b-[32px] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">BalonCRM</h1>
          <button onClick={() => navigate('/notification')} className="p-2 hover:bg-white/10 rounded-full transition-all relative">
            <FiBell className="text-2xl" />
            {lowStockProducts.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-700"></span>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-20">
        <div className="bg-white/80 backdrop-blur-md rounded-[20px] px-4 py-2 inline-flex items-center gap-2 shadow-sm border border-white mb-6">
          <span className="font-bold text-sm text-slate-700">Bugun</span>
          <FiChevronDown className="text-slate-500" />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Tushum */}
          <div onClick={() => navigate('/sales')} className="bg-white rounded-[24px] p-5 shadow-sm border border-white cursor-pointer hover:shadow-md transition-all active:scale-95">
            <h2 className="text-blue-600 font-bold text-[11px] uppercase tracking-widest mb-2">Tushum</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{parseFloat(stats?.total_revenue || 0).toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-bold">so'm</span>
            </div>
          </div>

          {/* Qarzdorlar */}
          <div onClick={() => navigate('/customers', { state: { filter: 'Qarzdorlar' } })} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-50 cursor-pointer hover:shadow-md transition-all active:scale-95">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-orange-500 w-3 h-3" />
              <h2 className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Qarzdorlar</h2>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-orange-500">{stats?.debtors_count || 0}</span>
              <span className="text-[10px] text-slate-400 font-bold">ta</span>
            </div>
          </div>

          {/* Ombor qoldiq */}
          <div onClick={() => navigate('/warehouse')} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-50 cursor-pointer hover:shadow-md transition-all active:scale-95">
            <h2 className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mb-2">Ombor</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{stats?.total_products_count || 0}</span>
              <span className="text-[10px] text-slate-400 font-bold">dona</span>
            </div>
          </div>

          {/* Sof Foyda */}
          <div className="bg-blue-50/50 rounded-[24px] p-5 shadow-sm border border-blue-100">
            <h2 className="text-blue-600 font-bold text-[11px] uppercase tracking-widest mb-2">Sof Foyda</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-700">{parseFloat(stats?.total_profit || 0).toLocaleString()}</span>
              <span className="text-[10px] text-blue-400 font-bold">so'm</span>
            </div>
          </div>
        </div>

        {/* Sales Chart Section */}
        {chartData.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between px-1 mb-6">
              <h2 className="text-base font-bold text-slate-800">Haftalik sotuv</h2>
              <FiTrendingUp className="text-blue-500" />
            </div>
            <div className="h-[220px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1d4ed8" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Inventory warning section */}
        <div>
          <div className="flex items-center justify-between px-1 mb-4">
            <h2 className="text-base font-bold text-slate-800">Kam qolganlar</h2>
            <button onClick={() => navigate('/warehouse')} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Hammasi</button>
          </div>
          
          <div className="space-y-3">
             {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
               <div key={product.id} className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <FiPackage className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{product.category_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-black text-sm">{product.quantity} {product.unit}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Qoldiq</p>
                  </div>
               </div>
             )) : (
               <div className="text-center py-8 bg-blue-50/30 rounded-[24px] border border-dashed border-blue-200">
                 <p className="text-sm text-blue-400 font-medium">Barcha mahsulotlar yetarli</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
