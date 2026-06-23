import React, { useState } from 'react';
import { FiCreditCard, FiSearch, FiPlus, FiLock, FiShield, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import { useSubscriptions, useTariffs, useCreateSubscription, useBlockSubscription, useExtendSubscription } from '../../hooks/useSubscription';
import { fmtDate, fmtDateTime, SUB_STATUS_LABELS } from '../../utils/formatters';

const StatusBadge = ({ status }) => {
  const map = {
    active:  'bg-green-900/40 text-green-400',
    trial:   'bg-blue-900/40 text-blue-400',
    expired: 'bg-red-900/40 text-red-400',
    blocked: 'bg-gray-700 text-gray-400',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${map[status] || map.blocked}`}>
      {SUB_STATUS_LABELS[status] || status}
    </span>
  );
};

const SASubscriptions = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [extendModal, setExtendModal] = useState(null);
  const [extendDate, setExtendDate] = useState('');
  const [createForm, setCreateForm] = useState({ tariff_id: '', expires_at: '', is_yearly: false, price_paid: '' });

  const { data, isLoading } = useSubscriptions({ page, page_size: 20 });
  const { data: tariffs } = useTariffs();
  const createSub = useCreateSubscription();
  const blockSub = useBlockSubscription();
  const extendSub = useExtendSubscription();

  const subscriptions = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 20);
  const tariffList = Array.isArray(tariffs) ? tariffs : tariffs?.results || [];

  const filtered = search
    ? subscriptions.filter(s => (s.company_name || '').toLowerCase().includes(search.toLowerCase()))
    : subscriptions;

  const handleCreate = async (e) => {
    e.preventDefault();
    await createSub.mutateAsync({
      ...createForm,
      tariff_id: Number(createForm.tariff_id),
      price_paid: createForm.price_paid || '0',
    });
    setShowCreate(false);
    setCreateForm({ tariff_id: '', expires_at: '', is_yearly: false, price_paid: '' });
  };

  const handleExtend = async (e) => {
    e.preventDefault();
    if (!extendDate) return;
    await extendSub.mutateAsync({ id: extendModal, data: { expires_at: extendDate } });
    setExtendModal(null);
    setExtendDate('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-black">Obunalar</h1>
          <p className="text-gray-400 text-sm">Jami: {totalCount} ta</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Yangi obuna
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Kompaniya nomi..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-black text-sm">Yangi obuna</h2>
            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Tarif *</label>
              <select required value={createForm.tariff_id} onChange={e => setCreateForm(p => ({ ...p, tariff_id: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">Tanlang...</option>
                {tariffList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Tugash sanasi *</label>
              <input type="datetime-local" required value={createForm.expires_at}
                onChange={e => setCreateForm(p => ({ ...p, expires_at: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">To'langan summa</label>
              <input type="number" value={createForm.price_paid} placeholder="0"
                onChange={e => setCreateForm(p => ({ ...p, price_paid: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer self-end pb-2">
              <input type="checkbox" checked={createForm.is_yearly} onChange={e => setCreateForm(p => ({ ...p, is_yearly: e.target.checked }))}
                className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-300 font-semibold">Yillik obuna</span>
            </label>
          </div>
          <button type="submit" disabled={createSub.isPending}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
          >
            <FiCheck className="w-4 h-4" /> Yaratish
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="text-gray-600 w-10 h-10 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">Obunalar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  {['Kompaniya', 'Tarif', 'Holat', 'Boshlanish', 'Tugash', 'Qoldi', 'Amallar'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filtered.map((s) => {
                  const days = Number(s.days_left);
                  const daysColor = days <= 3 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-gray-300';
                  return (
                    <tr key={s.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-white text-sm font-bold">{s.company_name}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{s.tariff?.name || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(s.started_at)}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(s.expires_at)}</td>
                      <td className={`px-4 py-3 text-xs font-black ${daysColor}`}>
                        {isNaN(days) || days < 0 ? '—' : `${days} kun`}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setExtendModal(s.id); setExtendDate(''); }} title="Uzaytirish"
                            className="w-7 h-7 bg-green-900/40 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-900/70 transition-colors"
                          >
                            <FiCalendar className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => blockSub.mutate(s.id)} title="Bloklash"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              s.status === 'blocked'
                                ? 'bg-green-900/40 text-green-400 hover:bg-green-900/70'
                                : 'bg-red-900/40 text-red-400 hover:bg-red-900/70'
                            }`}
                          >
                            {s.status === 'blocked' ? <FiShield className="w-3.5 h-3.5" /> : <FiLock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
            <p className="text-gray-400 text-xs">{totalCount} ta</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-bold rounded-lg disabled:opacity-40"
              >← Oldingi</button>
              <span className="px-3 py-1.5 text-gray-300 text-xs font-bold">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs font-bold rounded-lg disabled:opacity-40"
              >Keyingi →</button>
            </div>
          </div>
        )}
      </div>

      {/* Extend modal */}
      {extendModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <form onSubmit={handleExtend} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black">Obuna uzaytirish</h3>
              <button type="button" onClick={() => setExtendModal(null)} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Yangi tugash sanasi</label>
              <input type="datetime-local" required value={extendDate} onChange={e => setExtendDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={extendSub.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
              >Uzaytirish</button>
              <button type="button" onClick={() => setExtendModal(null)}
                className="flex-1 bg-gray-700 text-gray-300 py-2.5 rounded-xl text-sm font-bold"
              >Bekor</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SASubscriptions;
