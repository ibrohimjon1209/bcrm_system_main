import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, ShieldCheck, PencilSimple, LockKey, SignOut,
  ArrowLeft, Eye, EyeSlash, Check, CreditCard,
  Calendar, WarningCircle, CheckCircle,
} from '@phosphor-icons/react';
import { showToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { useMyCompany } from '../hooks/useCompany';
import { useMySubscription } from '../hooks/useSubscription';
import authService from '../services/auth.service';
import { ROLE_LABELS, fmtDate, daysLeft, SUB_STATUS_LABELS } from '../utils/formatters';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-50">
      <h2 className="text-sm font-black text-gray-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Field = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, isOwner, isAdmin, isSuperAdmin } = useAuth();
  const { data: company } = useMyCompany();
  const { data: sub } = useMySubscription();

  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => { if (user) setFullName(user.full_name || ''); }, [user]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    try {
      const updated = await authService.updateProfile({ full_name: fullName });
      updateUser({ ...user, ...updated });
      setEditMode(false);
      showToast('success', 'Profil yangilandi');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) { showToast('error', 'Parollar mos kelmadi'); return; }
    if (pwForm.new_password.length < 6) { showToast('error', 'Kamida 6 ta belgi kerak'); return; }
    setPwSaving(true);
    try {
      await authService.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password });
      showToast('success', "Parol o'zgartirildi");
      setPwForm({ old_password: '', new_password: '', confirm: '' });
    } finally { setPwSaving(false); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Subscription helpers
  const days = sub?.expires_at ? daysLeft(sub.expires_at) : null;
  const subStatus = sub?.status;
  const subColor =
    subStatus === 'active'  ? 'text-emerald-600' :
    subStatus === 'trial'   ? 'text-blue-600'    :
    subStatus === 'expired' ? 'text-red-500'      :
    subStatus === 'blocked' ? 'text-gray-400'     : 'text-gray-500';

  const subBg =
    subStatus === 'active'  ? 'bg-emerald-50 border-emerald-100' :
    subStatus === 'trial'   ? 'bg-blue-50 border-blue-100'       :
    subStatus === 'expired' ? 'bg-red-50 border-red-100'         :
    'bg-gray-50 border-gray-100';

  const SubIcon = subStatus === 'active' || subStatus === 'trial' ? CheckCircle : WarningCircle;

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 md:px-8 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute top-16 -right-4 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <button onClick={() => navigate(-1)}
            className="mb-4 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <User className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-white text-xl font-black leading-tight">
                {user?.full_name || user?.phone || '—'}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                  {ROLE_LABELS[user?.role] || user?.role}
                </span>
                {company && (
                  <span className="text-[11px] font-bold text-blue-100">
                    {company.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 relative z-10 max-w-2xl mx-auto space-y-4">

        {/* Subscription card */}
        {sub && (
          <div className={`rounded-2xl border p-4 flex items-start gap-3 ${subBg}`}>
            <SubIcon className={`w-5 h-5 shrink-0 mt-0.5 ${subColor}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className={`text-sm font-black ${subColor}`}>
                  {SUB_STATUS_LABELS[subStatus] || subStatus}
                  {sub.tariff?.name ? ` — ${sub.tariff.name}` : ''}
                </p>
                {days !== null && days >= 0 && (
                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    days <= 3 ? 'bg-red-100 text-red-600' :
                    days <= 7 ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {days} kun qoldi
                  </span>
                )}
                {days !== null && days < 0 && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-red-100 text-red-600">
                    Muddati tugagan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                {sub.started_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className={`w-3 h-3 ${subColor}`} />
                    <span className="text-xs text-gray-500">Boshlangan: {fmtDate(sub.started_at)}</span>
                  </div>
                )}
                {sub.expires_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className={`w-3 h-3 ${subColor}`} />
                    <span className="text-xs text-gray-500">Tugash: {fmtDate(sub.expires_at)}</span>
                  </div>
                )}
              </div>
              {sub.tariff && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {sub.tariff.max_admins && (
                    <span className="text-[10px] text-gray-500 bg-white/60 px-2 py-0.5 rounded-lg">
                      Adminlar: {sub.tariff.max_admins}
                    </span>
                  )}
                  {sub.tariff.max_products && (
                    <span className="text-[10px] text-gray-500 bg-white/60 px-2 py-0.5 rounded-lg">
                      Mahsulotlar: {sub.tariff.max_products}
                    </span>
                  )}
                  {sub.tariff.max_customers && (
                    <span className="text-[10px] text-gray-500 bg-white/60 px-2 py-0.5 rounded-lg">
                      Mijozlar: {sub.tariff.max_customers}
                    </span>
                  )}
                  {sub.tariff.analytics_enabled && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold">
                      Analitika ✓
                    </span>
                  )}
                </div>
              )}
            </div>
            <CreditCard className={`w-5 h-5 shrink-0 ${subColor}`} />
          </div>
        )}

        {/* Profile info */}
        <Section title="Shaxsiy ma'lumotlar">
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Ism familiya</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !fullName.trim()}
                  className="flex items-center gap-1.5 bg-[#1447E6] text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
                <button
                  onClick={() => { setEditMode(false); setFullName(user?.full_name || ''); }}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold"
                >
                  Bekor
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <Field label="Ism familiya" value={user?.full_name} />
                  <Field label="Telefon" value={user?.phone} mono />
                  <Field label="Rol" value={ROLE_LABELS[user?.role] || user?.role} />
                  {company && <Field label="Kompaniya" value={company.name} />}
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors shrink-0 ml-4"
                >
                  <PencilSimple className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* Company info */}
        {company && (
          <Section title="Kompaniya">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Kompaniya nomi" value={company.name} />
              {company.owner_name && <Field label="Egasi" value={company.owner_name} />}
              {company.phone && <Field label="Telefon" value={company.phone} />}
              {company.description && (
                <div className="col-span-2">
                  <Field label="Tavsif" value={company.description} />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Change password */}
        <Section title="Parolni o'zgartirish">
          <form onSubmit={handleChangePassword} className="space-y-3">
            {[
              { key: 'old_password', label: 'Joriy parol',   vis: 'old'     },
              { key: 'new_password', label: 'Yangi parol',   vis: 'new'     },
              { key: 'confirm',      label: 'Qaytaring',     vis: 'confirm' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-gray-500 mb-1 block">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw[f.vis] ? 'text' : 'password'}
                    required
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => ({ ...p, [f.vis]: !p[f.vis] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw[f.vis] ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={pwSaving}
              className="w-full bg-[#1447E6] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LockKey className="w-4 h-4" />
              {pwSaving ? 'Saqlanmoqda...' : "Parolni o'zgartirish"}
            </button>
          </form>
        </Section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 hover:bg-red-50 py-3.5 rounded-2xl text-sm font-black transition-colors shadow-sm"
        >
          <SignOut className="w-4 h-4" />
          Tizimdan chiqish
        </button>

        <p className="text-center text-[10px] text-gray-300 font-medium pb-2">v2.0.0 · NSD Corporation</p>
      </div>
    </div>
  );
};

export default Profile;
