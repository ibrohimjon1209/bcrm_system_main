import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiLoader, FiPackage } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';

const Notification = () => {
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useProducts({ limit: 100 });

  const lowStockProducts = productsData?.results?.filter(p => p.quantity < 10) || [];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white px-5 pt-12 pb-6 sticky top-0 z-10 border-b border-gray-100 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-blue-100 rounded-full transition-all text-blue-500"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-slate-800">Ogohlantirishlar</h1>
        </div>
      </div>

      {/* List */}
      <div className="px-5 pt-4 flex flex-col gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : lowStockProducts.length > 0 ? (
          lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between group p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                   <FiPackage className="text-xl" />
                 </div>
                 <div>
                   <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">{product.name}</h3>
                   <p className="text-red-500 font-bold text-[13px]">Qoldiq: {product.quantity} {product.unit}</p>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <FiAlertTriangle className="text-orange-500 text-xl" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category_name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-blue-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hamma narsa joyida!</h3>
            <p className="text-gray-500 text-sm">Omboringizda kam qolgan mahsulotlar hozircha yo'q.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;