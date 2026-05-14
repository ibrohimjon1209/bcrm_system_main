import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const Notification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-blue-100 rounded-full transition-all text-blue-500"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-slate-800">Kam qolgan ogohlantirish</h1>
        </div>
      </div>

      {/* List */}
      <div className="px-5 pt-4 flex flex-col gap-6">
        
        {/* Item 1 */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center p-2 shadow-inner">
               <span className="text-xl">🎈</span>
             </div>
             <div>
               <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Oddiy balon</h3>
               <p className="text-blue-500 font-semibold text-[13px]">Qoldiq: 5 ta</p>
             </div>
          </div>
          <FiAlertTriangle className="text-blue-500 text-xl" />
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-2 shadow-inner">
               <span className="text-xl">🎈</span>
             </div>
             <div>
               <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Folga balon</h3>
               <p className="text-blue-500 font-semibold text-[13px]">Qoldiq: 8 ta</p>
             </div>
          </div>
          <FiAlertCircle className="text-blue-400 text-xl" />
        </div>

        {/* Item 3 */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-2 shadow-inner">
               <span className="text-xl">🎈</span>
             </div>
             <div>
               <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Raqam balon</h3>
               <p className="text-blue-500 font-semibold text-[13px]">Qoldiq: 3 ta</p>
             </div>
          </div>
          <div className="bg-blue-500 rounded p-1">
             <FiAlertTriangle className="text-white text-sm" />
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center p-2 shadow-inner">
               <span className="text-xl">🎈</span>
             </div>
             <div>
               <h3 className="font-bold text-[15px] text-slate-900 mb-0.5">Geliy to'ldirish</h3>
               <p className="text-blue-500 font-semibold text-[13px]">Qoldiq: 8 ta</p>
             </div>
          </div>
          <FiAlertTriangle className="text-blue-400 text-xl" />
        </div>

      </div>
    </div>
  );
};

export default Notification;