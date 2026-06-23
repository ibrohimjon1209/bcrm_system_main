import React, { useState } from 'react';
import { FiClipboard, FiSearch, FiUser, FiClock, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { useAuditLogs, useAuditStats } from '../../hooks/useAudit';
import { fmtDateTime } from '../../utils/formatters';

const ACTION_COLORS = {
  login:   'bg-blue-900/40 text-blue-400',
  create:  'bg-green-900/40 text-green-400',
  update:  'bg-amber-900/40 text-amber-400',
  delete:  'bg-red-900/40 text-red-400',
  logout:  'bg-gray-700 text-gray-400',
};

const SAAuditLog = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [limit, setLimit] = useState(50);

  const { data, isLoading } = useAuditLogs({
    action: actionFilter || undefined,
    module: moduleFilter || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit,
  });
  const { data: stats } = useAuditStats();

  const logs = Array.isArray(data) ? data : data?.results || data?.logs || [];
  const filtered = search
    ? logs.filter(l =>
        (l.user || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.module || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.description || '').toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const statsData = stats ? Object.entries(stats).slice(0, 6) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-xl font-black">Audit Log</h1>
        <p className="text-gray-400 text-sm">Platform bo'yicha barcha harakatlar</p>
      </div>

      {/* Stats */}
      {statsData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsData.map(([key, val]) => (
            <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-white">{val}</p>
              <p className="text-gray-400 text-[10px] font-bold mt-0.5 capitalize">{key.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Barcha harakatlar</option>
            {['login', 'logout', 'create', 'update', 'delete'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select value={limit} onChange={e => setLimit(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {[20, 50, 100, 200].map(n => <option key={n} value={n}>{n} ta</option>)}
          </select>
        </div>
      </div>

      {/* Log list */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FiActivity className="text-gray-400 w-4 h-4" />
            <span className="text-white font-black text-sm">{filtered.length} ta log</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiClipboard className="text-gray-600 w-10 h-10 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">Log topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {filtered.map((log, i) => (
              <div key={log.id || i} className="px-5 py-3.5 hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-3">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg shrink-0 mt-0.5 ${ACTION_COLORS[log.action?.toLowerCase()] || 'bg-purple-900/40 text-purple-400'}`}>
                    {(log.action || '—').toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <div className="flex items-center gap-1">
                        <FiUser className="text-gray-500 w-3 h-3" />
                        <span className="text-white text-xs font-bold">{log.user || '—'}</span>
                      </div>
                      {log.module && (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-700 px-2 py-0.5 rounded-lg">
                          {log.module}
                        </span>
                      )}
                      {log.company && (
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-lg">
                          {log.company}
                        </span>
                      )}
                    </div>
                    {log.description && (
                      <p className="text-gray-400 text-xs truncate">{log.description}</p>
                    )}
                    {log.ip_address && (
                      <p className="text-gray-600 text-[10px] mt-0.5">IP: {log.ip_address}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <FiClock className="text-gray-600 w-3 h-3" />
                      <span className="text-[10px] text-gray-500">{fmtDateTime(log.created_at || log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SAAuditLog;
