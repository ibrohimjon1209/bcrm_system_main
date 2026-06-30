import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiSearch, FiPlus, FiEdit2, FiTrash2, FiPower, FiLogIn, FiX, FiCheck, FiPackage, FiUsers, FiDollarSign, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, useToggleCompanyActive, useLoginAs } from '../../hooks/useCompany';
import { fmtDate, fmtDateTime } from '../../utils/formatters';
import { showToast } from '../../utils/toast';

const EMPTY_FORM = { name: '', owner_name: '', phone: '', description: '' };

const SACompanies = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading } = useCompanies({ search, page, page_size: 20 });
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();
  const toggleActive = useToggleCompanyActive();
  const loginAs = useLoginAs();

  const companies = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 20);

  const openEdit = (c) => { setEditItem(c); setForm({ name: c.name, owner_name: c.owner_name || '', phone: c.phone || '', description: c.description || '' }); };
  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editItem) {
      await updateCompany.mutateAsync({ id: editItem.id, data: form });
      setEditItem(null);
    } else {
      await createCompany.mutateAsync(form);
      setShowForm(false);
    }
    setForm(EMPTY_FORM);
  };

  const handleLoginAs = async (id) => {
    try {
      const data = await loginAs.mutateAsync(id);
      if (data?.access) {
        const prev = { access: localStorage.getItem('access_token'), refresh: localStorage.getItem('refresh_token'), user: localStorage.getItem('user') };
        sessionStorage.setItem('sa_prev_session', JSON.stringify(prev));
        localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        showToast('success', 'Kompaniyaga kirildi');
        window.location.href = '/';
      }
    } catch { /* error handled by api.js */ }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-black">Kompaniyalar</h1>
          <p className="text-gray-400 text-sm">Jami: {totalCount} ta</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Yangi kompaniya
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Nomi, telefon, egasi..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      {/* Create/Edit form */}
      {(showForm || editItem) && (
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-black text-sm">{editItem ? 'Kompaniyani tahrirlash' : 'Yangi kompaniya'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'name',       label: 'Kompaniya nomi *', req: true  },
              { key: 'owner_name', label: 'Egasi',            req: false },
              { key: 'phone',      label: 'Telefon',          req: false },
            ].map(f => (
              <div key={f.key}>
                <label className="text-gray-400 text-xs font-bold mb-1 block">{f.label}</label>
                <input type="text" required={f.req} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">Tavsif</label>
            <textarea rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={createCompany.isPending || updateCompany.isPending}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
            >
              <FiCheck className="w-4 h-4" /> {editItem ? 'Saqlash' : 'Yaratish'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <FiX className="w-4 h-4" /> Bekor
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <FiBriefcase className="text-gray-600 w-10 h-10 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">Kompaniyalar topilmadi</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    {['Kompaniya', 'Egasi', 'Telefon', 'Holat', 'Yaratilgan', 'Amallar'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-bold">{c.name}</p>
                        <p className="text-gray-500 text-[10px]">#{c.id}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{c.owner_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{c.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${c.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                          {c.is_active ? 'Faol' : 'To\'xtatilgan'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(c.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button onClick={() => navigate(`/base_bcrm/companies/${c.id}/products`)} title="Mahsulotlar"
                            className="w-7 h-7 bg-indigo-900/40 rounded-lg flex items-center justify-center text-indigo-400 hover:bg-indigo-900/70 transition-colors"
                          >
                            <FiPackage className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => navigate(`/base_bcrm/companies/${c.id}/customers`)} title="Mijozlar"
                            className="w-7 h-7 bg-teal-900/40 rounded-lg flex items-center justify-center text-teal-400 hover:bg-teal-900/70 transition-colors"
                          >
                            <FiUsers className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => navigate(`/base_bcrm/companies/${c.id}/sales`)} title="Sotuvlar"
                            className="w-7 h-7 bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-900/70 transition-colors"
                          >
                            <FiDollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => navigate(`/base_bcrm/companies/${c.id}/purchases`)} title="Xaridlar"
                            className="w-7 h-7 bg-orange-900/40 rounded-lg flex items-center justify-center text-orange-400 hover:bg-orange-900/70 transition-colors"
                          >
                            <FiShoppingCart className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => navigate(`/base_bcrm/companies/${c.id}/users`)} title="Foydalanuvchilar"
                            className="w-7 h-7 bg-pink-900/40 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-900/70 transition-colors"
                          >
                            <FiUser className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleLoginAs(c.id)} title="Kirish sifatida"
                            className="w-7 h-7 bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-900/70 transition-colors"
                          >
                            <FiLogIn className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(c)} title="Tahrirlash"
                            className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleActive.mutate(c.id)} title={c.is_active ? "To'xtatish" : 'Faollashtirish'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              c.is_active ? 'bg-amber-900/40 text-amber-400 hover:bg-amber-900/70' : 'bg-green-900/40 text-green-400 hover:bg-green-900/70'
                            }`}
                          >
                            <FiPower className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(c.id)} title="O'chirish"
                            className="w-7 h-7 bg-red-900/40 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-900/70 transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs">{totalCount} ta kompaniyadan {(page - 1) * 20 + 1}–{Math.min(page * 20, totalCount)}</p>
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
          </>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-white text-base font-black mb-2">O'chirishni tasdiqlang</h3>
            <p className="text-gray-400 text-sm mb-5">Bu kompaniyani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteCompany.mutate(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold"
              >O'chirish</button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-xl text-sm font-bold"
              >Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SACompanies;
