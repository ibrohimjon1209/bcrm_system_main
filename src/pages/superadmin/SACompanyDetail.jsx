import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBriefcase, FiUsers, FiPackage, FiDollarSign, FiShoppingCart, FiSettings } from 'react-icons/fi';
import { useCompany, useCompanyStats } from '../../hooks/useCompany';
import { fmtDate, daysLeft, SUB_STATUS_LABELS } from '../../utils/formatters';

const SACompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading: companyLoading } = useCompany(id);
  const { data: stats } = useCompanyStats(id);

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">Kompaniya topilmadi</p>
      </div>
    );
  }

  const days = daysLeft(company.expires_at);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/base_bcrm/companies')}
          className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white text-xl font-black">{company.name}</h1>
          <p className="text-gray-400 text-sm">#{company.id} · {company.slug}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <div className="w-10 h-10 bg-blue-900/40 rounded-xl flex items-center justify-center mb-2">
            <FiUsers className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-medium">Foydalanuvchilar</p>
          <p className="text-white text-xl font-black">{company.users_count || 0}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <div className="w-10 h-10 bg-green-900/40 rounded-xl flex items-center justify-center mb-2">
            <FiPackage className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-medium">Mahsulotlar</p>
          <p className="text-white text-xl font-black">{stats?.products_count || 0}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <div className="w-10 h-10 bg-amber-900/40 rounded-xl flex items-center justify-center mb-2">
            <FiDollarSign className="text-amber-400 w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-medium">Sotuvlar</p>
          <p className="text-white text-xl font-black">{stats?.sales_count || 0}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <div className="w-10 h-10 bg-purple-900/40 rounded-xl flex items-center justify-center mb-2">
            <FiUsers className="text-purple-400 w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-medium">Mijozlar</p>
          <p className="text-white text-xl font-black">{stats?.customers_count || 0}</p>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-black text-sm">Kompaniya ma'lumotlari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Egasi</p>
            <p className="text-white text-sm">{company.owner_name || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Telefon</p>
            <p className="text-white text-sm">{company.phone || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Manzil</p>
            <p className="text-white text-sm">{company.settings?.address || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Valyuta</p>
            <p className="text-white text-sm">{company.settings?.currency || 'UZS'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Til</p>
            <p className="text-white text-sm">{company.settings?.language || 'uz'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Vaqt zonasi</p>
            <p className="text-white text-sm">{company.settings?.timezone || 'Asia/Tashkent'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Obuna holati</p>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
              company.is_subscription_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
            }`}>
              {company.is_subscription_active ? 'Faol' : 'Muddati tugagan'}
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Qolgan kunlar</p>
            <p className={`text-sm font-bold ${days !== null && days <= 7 ? 'text-red-400' : 'text-white'}`}>
              {days !== null ? `${days} kun` : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Yaratilgan</p>
            <p className="text-white text-sm">{fmtDate(company.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Holat</p>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
              company.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
            }`}>
              {company.is_active ? 'Faol' : 'To\'xtatilgan'}
            </span>
          </div>
        </div>
        {company.description && (
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">Tavsif</p>
            <p className="text-white text-sm">{company.description}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-white font-black text-sm mb-4">Tezkor amallar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/products`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiPackage className="w-4 h-4" /> Mahsulotlar
          </button>
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/customers`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiUsers className="w-4 h-4" /> Mijozlar
          </button>
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/sales`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiDollarSign className="w-4 h-4" /> Sotuvlar
          </button>
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/purchases`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiShoppingCart className="w-4 h-4" /> Xaridlar
          </button>
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/users`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiUsers className="w-4 h-4" /> Foydalanuvchilar
          </button>
          <button onClick={() => navigate(`/base_bcrm/companies/${id}/settings`)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <FiSettings className="w-4 h-4" /> Sozlamalar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SACompanyDetail;