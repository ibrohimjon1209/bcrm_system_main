import React, { useState } from 'react';
import { ClipboardText, Funnel, MagnifyingGlass, User, Clock, Pulse } from '@phosphor-icons/react';
import { useAuditLogs } from '../hooks/useAudit';
import { fmtDateTime } from '../utils/formatters';

const ACTION_COLORS = {
  login:   { bg: 'bg-blue-50',   text: 'text-blue-600'   },
  create:  { bg: 'bg-green-50',  text: 'text-green-600'  },
  update:  { bg: 'bg-amber-50',  text: 'text-amber-600'  },
  delete:  { bg: 'bg-red-50',    text: 'text-red-600'    },
  logout:  { bg: 'bg-gray-50',   text: 'text-gray-500'   },
};

const defaultColor = { bg: 'bg-purple-50', text: 'text-purple-600' };

const AuditLog = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [limit, setLimit] = useState(50);

  const { data, isLoading } = useAuditLogs({
    action: actionFilter || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit,
  });

  const logs = Array.isArray(data) ? data : data?.results || data?.logs || [];

  const filtered = search
    ? logs.filter(l =>
        (l.user || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.module || '').toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 md:px-8 pt-10 pb-12 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <ClipboardText className="text-white w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-white text-xl font-black">Audit Log</h1>
            <p className="text-blue-200 text-xs">Barcha harakatlar tarixi</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 relative z-10 max-w-4xl mx-auto space-y-3">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Foydalanuvchi, harakat, modul..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Barcha harakatlar</option>
              {['login', 'logout', 'create', 'update', 'delete'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Log list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Pulse className="text-gray-400 w-4 h-4" />
              <span className="text-sm font-black text-gray-700">{filtered.length} ta log</span>
            </div>
            <select value={limit} onChange={e => setLimit(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-500 focus:outline-none"
            >
              {[20, 50, 100, 200].map(n => <option key={n} value={n}>{n} ta</option>)}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardText className="text-gray-200 w-10 h-10 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-400">Log topilmadi</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((log, i) => {
                const c = ACTION_COLORS[log.action?.toLowerCase()] || defaultColor;
                return (
                  <div key={log.id || i} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 mt-0.5 ${c.bg} ${c.text}`}>
                        {(log.action || '—').toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <User className="text-gray-300 w-3 h-3" />
                            <span className="text-xs font-bold text-gray-700">{log.user || '—'}</span>
                          </div>
                          {log.module && (
                            <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
                              {log.module}
                            </span>
                          )}
                        </div>
                        {log.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{log.description}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="text-gray-300 w-3 h-3" />
                          <span className="text-[10px] text-gray-400">{fmtDateTime(log.created_at || log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
