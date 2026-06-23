import React, { useState, useEffect, useRef } from 'react';
import { Gear, User, Users, LockKey, Bell, Globe, Plus, Trash, PencilSimple, Check, X, Eye, EyeSlash } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useMyCompany, useUpdateMyCompany, useMySettings, useUpdateMySettings } from '../hooks/useCompany';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import authService from '../services/auth.service';
import { ROLE_LABELS } from '../utils/formatters';
import { formatPhoneNumber, cleanPhoneNumber } from '../utils/phoneFormat';

const TABS = [
  { key: 'company',   label: 'Kompaniya',  icon: Globe  },
  { key: 'profile',   label: 'Profil',     icon: User   },
  { key: 'admins',    label: 'Adminlar',   icon: Users  },
  { key: 'security',  label: 'Xavfsizlik', icon: LockKey   },
  { key: 'alerts',    label: 'Ogohlantirishlar', icon: Bell },
];

const Settings = () => {
  const { user, updateUser, isOwner } = useAuth();
  const [tab, setTab] = useState('company');

  const { data: company, isLoading: companyLoading } = useMyCompany();
  const { data: settings } = useMySettings();
  const updateCompany = useUpdateMyCompany();
  const updateSettings = useUpdateMySettings();

  const { data: usersData } = useUsers();
  const createUser = useCreateUser();
  const updateUserMut = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Company form
  const [companyForm, setCompanyForm] = useState({ name: '', owner_name: '', phone: '', description: '' });
  const [settingsForm, setSettingsForm] = useState({ address: '', receipt_footer: '', currency: 'UZS', low_stock_alert_enabled: true, debt_reminder_enabled: true });
  const [logoFile, setLogoFile] = useState(null);
  const logoRef = useRef();

  useEffect(() => {
    if (company) setCompanyForm({ name: company.name || '', owner_name: company.owner_name || '', phone: company.phone || '', description: company.description || '' });
  }, [company]);

  useEffect(() => {
    if (settings) setSettingsForm({
      address: settings.address || '',
      receipt_footer: settings.receipt_footer || '',
      currency: settings.currency || 'UZS',
      low_stock_alert_enabled: settings.low_stock_alert_enabled ?? true,
      debt_reminder_enabled: settings.debt_reminder_enabled ?? true,
    });
  }, [settings]);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(companyForm).forEach(([k, v]) => fd.append(k, v));
    if (logoFile) fd.append('photo', logoFile);
    await updateCompany.mutateAsync(fd);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings.mutateAsync(settingsForm);
  };

  // Profile form
  const [profileForm, setProfileForm] = useState({ full_name: '' });
  useEffect(() => { if (user) setProfileForm({ full_name: user.full_name || '' }); }, [user]);
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = await authService.updateProfile(profileForm);
    updateUser({ ...user, ...updated });
    toast.success('Profil yangilandi');
  };

  // Password form
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) { toast.error('Parollar mos kelmadi'); return; }
    if (pwForm.new_password.length < 6) { toast.error('Kamida 6 ta belgi'); return; }
    await authService.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password });
    toast.success('Parol o\'zgartirildi');
    setPwForm({ old_password: '', new_password: '', confirm: '' });
  };

  // Admin management
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ phone: '', full_name: '', password: '', role: 'admin' });
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const users = Array.isArray(usersData) ? usersData : usersData?.results || [];

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    await createUser.mutateAsync({ ...newAdmin, phone: cleanPhoneNumber(newAdmin.phone) });
    setShowAddAdmin(false);
    setNewAdmin({ phone: '', full_name: '', password: '', role: 'admin' });
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    await updateUserMut.mutateAsync({ id: editAdmin.id, data: { full_name: editAdmin.full_name, role: editAdmin.role, is_active: editAdmin.is_active } });
    setEditAdmin(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 md:px-8 pt-10 pb-12 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Gear className="text-white w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-white text-xl font-black">Sozlamalar</h1>
            <p className="text-blue-200 text-xs">Tizim va profil sozlamalari</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 relative z-10 max-w-3xl mx-auto space-y-4">
        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1 flex gap-1 overflow-x-auto">
          {TABS.filter(t => t.key !== 'admins' || isOwner).map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  tab === t.key ? 'bg-[#1447E6] text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Company tab */}
        {tab === 'company' && (
          <div className="space-y-4">
            <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-gray-800">Kompaniya ma'lumotlari</h2>
              {/* Logo upload */}
              <div className="flex items-center gap-4">
                <div
                  onClick={() => logoRef.current?.click()}
                  className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 overflow-hidden"
                >
                  {logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} className="w-full h-full object-cover" alt="" />
                  ) : company?.photo || settings?.logo ? (
                    <img src={company?.photo || settings?.logo} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Plus className="text-gray-400 w-5 h-5" />
                  )}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files[0])} />
                <div>
                  <p className="text-xs font-bold text-gray-700">Logo yuklash</p>
                  <p className="text-[10px] text-gray-400">PNG, JPG — max 2MB</p>
                </div>
              </div>

              {[
                { key: 'name',       label: 'Kompaniya nomi', type: 'text'  },
                { key: 'owner_name', label: 'Egasi',          type: 'text'  },
                { key: 'phone',      label: 'Telefon',        type: 'text'  },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={companyForm[f.key]}
                    onChange={e => setCompanyForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Tavsif</label>
                <textarea
                  rows={3}
                  value={companyForm.description}
                  onChange={e => setCompanyForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>
              <button type="submit" disabled={updateCompany.isPending}
                className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {updateCompany.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>

            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-gray-800">Tizim sozlamalari</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Manzil</label>
                <input type="text" value={settingsForm.address}
                  onChange={e => setSettingsForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Asosiy valyuta</label>
                <select value={settingsForm.currency}
                  onChange={e => setSettingsForm(p => ({ ...p, currency: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="UZS">UZS (So'm)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Chek taglik matni</label>
                <textarea rows={2} value={settingsForm.receipt_footer}
                  onChange={e => setSettingsForm(p => ({ ...p, receipt_footer: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>
              <button type="submit" disabled={updateSettings.isPending}
                className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {updateSettings.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-800">Shaxsiy ma'lumotlar</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Telefon</label>
              <input type="text" value={user?.phone || ''} disabled
                className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Ism familiya</label>
              <input type="text" value={profileForm.full_name}
                onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Rol</label>
              <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 font-semibold">
                {ROLE_LABELS[user?.role] || user?.role}
              </div>
            </div>
            <button type="submit"
              className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Saqlash
            </button>
          </form>
        )}

        {/* Admins tab (owner only) */}
        {tab === 'admins' && isOwner && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-700">Adminlar ({users.length})</h2>
              <button onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-1.5 bg-[#1447E6] text-white px-3 py-2 rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                Qo'shish
              </button>
            </div>

            {showAddAdmin && (
              <form onSubmit={handleAddAdmin} className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-gray-800">Yangi admin</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Telefon</label>
                  <input type="text" required value={newAdmin.phone}
                    onChange={e => setNewAdmin(p => ({ ...p, phone: formatPhoneNumber(e.target.value) }))}
                    placeholder="+998 90 123 45 67"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Ism familiya</label>
                  <input type="text" value={newAdmin.full_name}
                    onChange={e => setNewAdmin(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Parol</label>
                  <input type="password" required minLength={6} value={newAdmin.password}
                    onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={createUser.isPending}
                    className="flex-1 bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
                  >
                    {createUser.isPending ? '...' : 'Qo\'shish'}
                  </button>
                  <button type="button" onClick={() => setShowAddAdmin(false)}
                    className="px-4 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Bekor
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  {editAdmin?.id === u.id ? (
                    <form onSubmit={handleUpdateAdmin} className="p-4 space-y-3">
                      <input type="text" value={editAdmin.full_name}
                        onChange={e => setEditAdmin(p => ({ ...p, full_name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                          <Check className="w-3.5 h-3.5" /> Saqlash
                        </button>
                        <button type="button" onClick={() => setEditAdmin(null)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                          <X className="w-3.5 h-3.5" /> Bekor
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <User className="text-blue-400 w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{u.full_name || '—'}</p>
                        <p className="text-xs text-gray-400">{u.phone} · {ROLE_LABELS[u.role] || u.role}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => setEditAdmin({ ...u })}
                          className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-100"
                        >
                          <PencilSimple className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== user?.id && (
                          <button onClick={() => setDeleteConfirm(u.id)}
                            className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-800">Parolni o'zgartirish</h2>
            {[
              { key: 'old_password', label: 'Joriy parol',   vis: 'old'     },
              { key: 'new_password', label: 'Yangi parol',   vis: 'new'     },
              { key: 'confirm',      label: 'Qaytaring',     vis: 'confirm' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-gray-500 mb-1 block">{f.label}</label>
                <div className="relative">
                  <input type={showPw[f.vis] ? 'text' : 'password'} required
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, [f.vis]: !p[f.vis] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPw[f.vis] ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit"
              className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Parolni o'zgartirish
            </button>
          </form>
        )}

        {/* Alerts tab */}
        {tab === 'alerts' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-800">Bildirishnoma sozlamalari</h2>
            {[
              { key: 'low_stock_alert_enabled', label: 'Kam qolish ogohlantirishasi', desc: 'Mahsulot kam qolganda bildirishnoma' },
              { key: 'debt_reminder_enabled',   label: 'Qarz eslatmasi',              desc: 'Telegram orqali qarz eslatmasi' },
            ].map(f => (
              <label key={f.key} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-gray-700">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${settingsForm[f.key] ? 'bg-[#1447E6]' : 'bg-gray-200'}`}
                  onClick={() => setSettingsForm(p => ({ ...p, [f.key]: !p[f.key] }))}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settingsForm[f.key] ? 'left-6' : 'left-1'}`} />
                </div>
              </label>
            ))}
            <button type="submit" disabled={updateSettings.isPending}
              className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {updateSettings.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-black text-gray-900 mb-2">O'chirishni tasdiqlang</h3>
            <p className="text-sm text-gray-500 mb-5">Ushbu adminni o'chirmoqchimisiz?</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteUser.mutate(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold"
              >
                O'chirish
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold"
              >
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
