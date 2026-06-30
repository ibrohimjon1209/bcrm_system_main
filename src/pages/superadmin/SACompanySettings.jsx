import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiGlobe, FiDollarSign, FiClock, FiMapPin } from 'react-icons/fi';
import { useCompany, useUpdateCompanySettings } from '../../hooks/useCompany';
import { showToast } from '../../utils/toast';

const EMPTY_SETTINGS = {
  currency: 'UZS',
  language: 'uz',
  timezone: 'Asia/Tashkent',
  address: '',
  logo: null,
};

const SACompanySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading: companyLoading } = useCompany(id);
  const updateSettings = useUpdateCompanySettings();

  const [form, setForm] = useState({
    currency: company?.settings?.currency || 'UZS',
    language: company?.settings?.language || 'uz',
    timezone: company?.settings?.timezone || 'Asia/Tashkent',
    address: company?.settings?.address || '',
  });

  // Update form when company data loads
  React.useEffect(() => {
    if (company?.settings) {
      setForm({
        currency: company.settings.currency || 'UZS',
        language: company.settings.language || 'uz',
        timezone: company.settings.timezone || 'Asia/Tashkent',
        address: company.settings.address || '',
      });
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({ id, data: form });
      showToast('success', 'Sozlamalar saqlandi');
    } catch (error) {
      // Error handled by api.js
    }
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/base_bcrm/companies/${id}`)}
          className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white text-xl font-black">Sozlamalar</h1>
          <p className="text-gray-400 text-sm">{company?.name || `Kompaniya #${id}`}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-black text-sm">Kompaniya sozlamalari</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1.5 block">Valyuta</label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="UZS">UZS (so'm)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1.5 block">Til</label>
            <div className="relative">
              <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="uz">O'zbek</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1.5 block">Vaqt zonasi</label>
            <div className="relative">
              <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                <option value="Asia/Samarkand">Asia/Samarkand (UTC+5)</option>
                <option value="Asia/Karachi">Asia/Karachi (UTC+5)</option>
                <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold mb-1.5 block">Manzil</label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Toshkent, O'zbekiston"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={updateSettings.isPending}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
          >
            <FiSave className="w-4 h-4" /> Saqlash
          </button>
          <button type="button" onClick={() => navigate(`/base_bcrm/companies/${id}`)}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            Bekor
          </button>
        </div>
      </form>
    </div>
  );
};

export default SACompanySettings;