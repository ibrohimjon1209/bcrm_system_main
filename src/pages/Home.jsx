import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronDown, FiAlertTriangle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Du', value: 0 },
  { name: 'Se', value: 900000 },
  { name: 'Ch', value: 1500000 },
  { name: 'Pa', value: 1000000 },
  { name: 'Ju', value: 1900000 },
  { name: 'Sh', value: 2000000 },
  { name: 'Ya', value: 2600000 },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-28 text-slate-800">
      {/* Top Navbar */}
      <div className="bg-blue-700 text-white px-5 pt-12 pb-6 rounded-b-[32px] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold tracking-wide tracking-tight">BalonCRM</h1>
          <Link to="/notification" className="p-2 hover:bg-white/10 rounded-full transition-all relative">
            <FiBell className="text-2xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-blue-700"></span>
          </Link>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-20">
        <div className="bg-white/60 backdrop-blur-md rounded-[20px] px-4 py-2 inline-flex items-center gap-2 shadow-sm border border-white mb-6">
          <span className="font-medium text-sm text-slate-700">Bugun</span>
          <FiChevronDown className="text-slate-500" />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Tushum */}
          <div onClick={() => navigate('/sales')} className="bg-gradient-to-br from-blue-50 to-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white cursor-pointer hover:shadow-md transition-shadow">
            <h2 className="text-blue-700 font-semibold text-[13px] mb-2 font-medium">Tushum</h2>
            <div className="mt-1">
              <span className="text-xl font-bold text-slate-900">12,450,000</span>
              <span className="text-xs text-slate-500 ml-1 font-medium">so'm</span>
            </div>
          </div>

          {/* Qarzdorlar */}
          <div onClick={() => navigate('/customers', { state: { filter: 'Qarzdorlar' } })} className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-blue-500" />
              <h2 className="text-slate-600 text-[13px] font-medium">Qarzdorlar</h2>
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-blue-500">8</span>
              <span className="text-xs text-blue-500 ml-1 font-medium">ta</span>
            </div>
          </div>

          {/* Ombor qoldiq */}
          <div onClick={() => navigate('/warehouse')} className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 cursor-pointer hover:shadow-md transition-shadow">
            <h2 className="text-slate-600 text-[13px] font-medium mb-2">Ombor qoldiq</h2>
            <div className="mt-1">
              <span className="text-xl font-bold text-slate-900">128</span>
              <span className="text-xs text-slate-500 ml-1 font-medium">ta</span>
            </div>
          </div>

          {/* Oylik foyda */}
          <div className="bg-gradient-to-br from-[#F0FDF4] to-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <h2 className="text-slate-600 text-[13px] font-medium mb-2">Oylik foyda</h2>
            <div className="mt-1">
              <span className="text-xl font-bold text-slate-900">5,250,000</span>
              <span className="text-xs text-slate-500 ml-1 font-medium">so'm</span>
            </div>
          </div>
        </div>

        {/* Sales Chart Section */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-6 px-1">7 kunlik sotuv</h2>
          <div className="h-[220px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8b96a5', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8b96a5', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(val) => val === 0 ? '0' : `${val / 1000000}M`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1D4ED8" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#fff', strokeWidth: 2, stroke: '#1D4ED8' }}
                  activeDot={{ r: 7, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff' }}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory warning section */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-4 px-1">Kam qolgan mahsulotlar</h2>
          
          <div className="bg-gradient-to-r from-blue-50/80 to-blue-50/80 rounded-[28px] p-2 mt-4 shadow-sm border border-blue-50/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-[40px] opacity-60 -z-10 translate-x-10 -translate-y-10"></div>
             
             <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-4 flex items-center justify-between mb-2 shadow-[0_4px_15px_rgb(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-2 shadow-inner">
                     <span className="text-xl">🎈</span>
                  </div>
                  <span className="font-bold text-slate-800">Oddiy balon</span>
                </div>
                <div className="text-blue-500 font-semibold text-sm">
                  Qoldiq: 5 ta
                </div>
             </div>

             <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-4 flex items-center justify-between shadow-[0_4px_15px_rgb(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-2 shadow-inner">
                     <span className="text-xl">🎈</span>
                  </div>
                  <span className="font-bold text-slate-800">Folga balon</span>
                </div>
                <div className="text-blue-500 font-semibold text-sm">
                  Qoldiq: 3 ta
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
