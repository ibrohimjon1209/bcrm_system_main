import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useCompany, useCompanyPurchases } from '../../hooks/useCompany';
import { fmtMoney, fmtDate } from '../../utils/formatters';

const SACompanyPurchases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: company, isLoading: companyLoading } = useCompany(id);
  const { data, isLoading: purchasesLoading } = useCompanyPurchases(id, { search, page, page_size: 20 });

  const purchases = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 20);

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
        <button onClick={() => navigate('/base_bcrm/companies')}
          className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white text-xl font-black">Xaridlar</h1>
          <p className="text-gray-400 text-sm">{company?.name || `Kompaniya #${id}`}</p>
        </div>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Ta'minotchi, to'lov usuli..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        {purchasesLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingCart className="text-gray-600 w-10 h-10 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">Xaridlar topilmadi</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    {['ID', 'Ta\'minotchi', 'Summa', 'Sana', 'Holat'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-sm">#{p.id}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{p.supplier_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{fmtMoney(p.total_amount, p.currency)}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{fmtDate(p.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                          p.status === 'completed' ? 'bg-green-900/40 text-green-400' : 'bg-amber-900/40 text-amber-400'
                        }`}>
                          {p.status === 'completed' ? 'Yakunlangan' : p.status || 'Kutilmoqda'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs">{totalCount} tadan {(page - 1) * 20 + 1}–{Math.min(page * 20, totalCount)}</p>
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
    </div>
  );
};

export default SACompanyPurchases;