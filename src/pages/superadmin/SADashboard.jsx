import React from 'react';
import { FiBriefcase, FiUsers, FiCreditCard, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useCompanies } from '../../hooks/useCompany';
import { useSubscriptions } from '../../hooks/useSubscription';
import { useTickets } from '../../hooks/useSupport';
import { fmtDate, SUB_STATUS_LABELS } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color = 'blue', to }) => {
  const colors = {
    blue:   { bg: 'bg-blue-900/40',   text: 'text-blue-400',   val: 'text-blue-300'   },
    green:  { bg: 'bg-green-900/40',  text: 'text-green-400',  val: 'text-green-300'  },
    amber:  { bg: 'bg-amber-900/40',  text: 'text-amber-400',  val: 'text-amber-300'  },
    red:    { bg: 'bg-red-900/40',    text: 'text-red-400',    val: 'text-red-300'    },
    purple: { bg: 'bg-purple-900/40', text: 'text-purple-400', val: 'text-purple-300' },
  };
  const c = colors[color] || colors.blue;
  const Wrapper = to ? Link : 'div';
  return (
    <Wrapper to={to} className={`bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all ${to ? 'cursor-pointer' : ''}`}>
      <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
      <p className={`text-2xl font-black ${c.val}`}>{value}</p>
    </Wrapper>
  );
};

const SubStatusBadge = ({ status }) => {
  const map = {
    active:  { bg: 'bg-green-900/40',  text: 'text-green-400'  },
    trial:   { bg: 'bg-blue-900/40',   text: 'text-blue-400'   },
    expired: { bg: 'bg-red-900/40',    text: 'text-red-400'    },
    blocked: { bg: 'bg-gray-700',      text: 'text-gray-400'   },
  };
  const c = map[status] || map.blocked;
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${c.bg} ${c.text}`}>
      {SUB_STATUS_LABELS[status] || status}
    </span>
  );
};

const SADashboard = () => {
  const { data: companiesData } = useCompanies({ page_size: 100 });
  const { data: subsData } = useSubscriptions({ page_size: 100 });
  const { data: ticketsData } = useTickets({ status: 'open' });

  const companies = companiesData?.results || [];
  const subscriptions = subsData?.results || [];
  const openTickets = Array.isArray(ticketsData) ? ticketsData : ticketsData?.results || [];

  const activeCompanies = companies.filter(c => c.is_active).length;
  const expiredSubs = subscriptions.filter(s => s.status === 'expired').length;
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;

  const recentCompanies = [...companies]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  const expiringSoon = subscriptions
    .filter(s => {
      const days = s.days_left !== undefined ? Number(s.days_left) : null;
      return days !== null && days >= 0 && days <= 7;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-black">Platform Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">BCRM SaaS boshqaruv paneli</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiBriefcase} label="Jami kompaniyalar" value={companies.length} color="blue" to="/base_bcrm/companies" />
        <StatCard icon={FiCheckCircle} label="Faol kompaniyalar" value={activeCompanies} color="green" />
        <StatCard icon={FiCreditCard} label="Faol obunalar" value={activeSubs} color="purple" to="/base_bcrm/subscriptions" />
        <StatCard icon={FiAlertCircle} label="Ochiq ticketlar" value={openTickets.length} color="amber" to="/base_bcrm/support" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent companies */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h2 className="text-white font-black text-sm">So'nggi kompaniyalar</h2>
            <Link to="/base_bcrm/companies" className="text-blue-400 text-xs font-bold hover:text-blue-300">
              Barchasi →
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentCompanies.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Kompaniyalar yo'q</p>
            ) : recentCompanies.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-750 transition-colors">
                <div className="w-9 h-9 bg-blue-900/50 rounded-xl flex items-center justify-center shrink-0">
                  {c.photo ? (
                    <img src={c.photo} className="w-full h-full rounded-xl object-cover" alt="" />
                  ) : (
                    <FiBriefcase className="text-blue-400 w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{c.name}</p>
                  <p className="text-gray-400 text-[10px]">{c.phone} · {fmtDate(c.created_at)}</p>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Expiring soon */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h2 className="text-white font-black text-sm">Muddati tugayotganlar</h2>
            <Link to="/base_bcrm/subscriptions" className="text-blue-400 text-xs font-bold hover:text-blue-300">
              Barchasi →
            </Link>
          </div>
          {expiringSoon.length === 0 ? (
            <div className="flex items-center justify-center py-10 flex-col gap-2">
              <FiCheckCircle className="text-green-500 w-8 h-8" />
              <p className="text-gray-400 text-sm font-semibold">Muddati tugayotgan yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {expiringSoon.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 bg-amber-900/40 rounded-xl flex items-center justify-center shrink-0">
                    <FiClock className="text-amber-400 w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold truncate">{s.company_name}</p>
                    <p className="text-gray-400 text-[10px]">Tugash: {fmtDate(s.expires_at)}</p>
                  </div>
                  <span className="text-amber-400 text-[10px] font-black bg-amber-900/40 px-2 py-1 rounded-lg shrink-0">
                    {s.days_left} kun
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expired subscriptions alert */}
      {expiredSubs > 0 && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-2xl p-4 flex items-center gap-3">
          <FiXCircle className="text-red-400 w-5 h-5 shrink-0" />
          <p className="text-red-300 text-sm font-semibold">
            <strong>{expiredSubs}</strong> ta kompaniyaning obuna muddati tugagan.{' '}
            <Link to="/base_bcrm/subscriptions" className="underline hover:text-red-200">Ko'rish →</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SADashboard;
