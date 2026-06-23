import React, { useState } from 'react';
import { FiLifeBuoy, FiSearch, FiMessageSquare, FiSend, FiX, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useTickets, useTicket, useUpdateTicket, useDeleteTicket, useAddMessage } from '../../hooks/useSupport';
import { fmtDateTime } from '../../utils/formatters';

const STATUS_LABELS = { open: 'Ochiq', pending: 'Kutilmoqda', resolved: 'Yechilgan', closed: 'Yopiq' };
const STATUS_COLORS = {
  open:     'bg-blue-900/40 text-blue-400',
  pending:  'bg-amber-900/40 text-amber-400',
  resolved: 'bg-green-900/40 text-green-400',
  closed:   'bg-gray-700 text-gray-400',
};
const PRIORITY_LABELS  = { low: 'Past', normal: "O'rta", high: 'Yuqori', urgent: 'Shoshilinch' };
const PRIORITY_COLORS  = {
  low:    'bg-gray-700 text-gray-400',
  normal: 'bg-blue-900/40 text-blue-400',
  high:   'bg-amber-900/40 text-amber-400',
  urgent: 'bg-red-900/40 text-red-400',
};

const SASupport = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  const { data: ticketsData, isLoading } = useTickets({ status: statusFilter || undefined });
  const { data: detail, isLoading: detailLoading } = useTicket(selected);
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const addMessage = useAddMessage();

  const tickets = Array.isArray(ticketsData) ? ticketsData : ticketsData?.results || [];
  const filtered = search ? tickets.filter(t => (t.subject || '').toLowerCase().includes(search.toLowerCase())) : tickets;

  const handleStatusChange = async (id, status) => {
    await updateTicket.mutateAsync({ id, data: { status } });
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    await addMessage.mutateAsync({ id: selected, body: reply });
    setReply('');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-xl font-black">Support Center</h1>
        <p className="text-gray-400 text-sm">Mijoz murojaatlari</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Mavzu bo'yicha..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Barcha holatlar</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Ticket list */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-white font-black text-sm">{filtered.length} ta murojaat</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <FiLifeBuoy className="text-gray-600 w-8 h-8 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Murojaatlar yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
              {filtered.map((t) => (
                <div key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`p-4 cursor-pointer transition-colors ${selected === t.id ? 'bg-blue-900/30 border-l-2 border-blue-500' : 'hover:bg-gray-750'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-white text-xs font-bold leading-tight line-clamp-2">{t.subject}</p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${STATUS_COLORS[t.status]}`}>
                      {STATUS_LABELS[t.status] || t.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${PRIORITY_COLORS[t.priority]}`}>
                      {PRIORITY_LABELS[t.priority] || t.priority}
                    </span>
                    <span className="text-gray-500 text-[10px]">{fmtDateTime(t.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <FiMessageSquare className="text-gray-600 w-10 h-10 mb-3" />
              <p className="text-gray-400 text-sm font-semibold">Murojaat tanlang</p>
            </div>
          ) : detailLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : detail ? (
            <>
              <div className="px-5 py-4 border-b border-gray-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-white font-black text-sm">{detail.subject}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{fmtDateTime(detail.created_at)}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white shrink-0">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                {/* Status controls */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <button key={k} onClick={() => handleStatusChange(detail.id, k)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors ${
                        detail.status === k ? STATUS_COLORS[k] : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                  <button onClick={() => { deleteTicket.mutate(detail.id); setSelected(null); }}
                    className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 ml-auto transition-colors"
                  >
                    O'chirish
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
                {(!detail.messages || detail.messages.length === 0) ? (
                  <p className="text-gray-500 text-sm text-center py-6">Xabarlar yo'q</p>
                ) : detail.messages.map((m, i) => (
                  <div key={m.id || i} className={`flex ${m.is_admin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.is_admin ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-700 text-gray-200 rounded-bl-md'
                    }`}>
                      <p>{m.body}</p>
                      <p className={`text-[10px] mt-1 ${m.is_admin ? 'text-blue-200' : 'text-gray-500'}`}>
                        {fmtDateTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              <form onSubmit={handleReply} className="px-4 py-3 border-t border-gray-700 flex gap-2">
                <input value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Javob yozing..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button type="submit" disabled={!reply.trim() || addMessage.isPending}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SASupport;
