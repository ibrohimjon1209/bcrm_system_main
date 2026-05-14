import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiPlus, FiSearch, FiPhone, FiEdit, 
  FiTrash2, FiMessageCircle, FiFileText, FiX, FiCheckCircle, 
  FiMapPin, FiCalendar, FiCreditCard, FiDownload, FiShare2, FiLoader
} from 'react-icons/fi';
import { FiSend } from 'react-icons/fi';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import { toast } from 'react-toastify';

const SwipeableCustomerCard = ({ customer, onClick, onEdit, onDelete }) => {
  const handleDragEnd = (event, info) => {
     // Optional: handle swipe gestures for quick actions
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-[24px]">
      <div className="absolute inset-0 flex justify-between items-center rounded-[24px]">
        <div className="w-1/2 h-full bg-gradient-to-r from-blue-500 to-blue-400 p-4 flex items-center justify-start gap-3 rounded-l-[24px]">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiPlus className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Sotuv</span>
          </div>
        </div>

        <div className="w-1/2 h-full bg-gradient-to-l from-blue-500 to-blue-400 p-4 flex items-center justify-end gap-3 rounded-r-[24px]">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); onEdit(customer); }}>
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiEdit className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Tahrir</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }}>
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiTrash2 className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">O'chirish</span>
          </div>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.2}
        className="relative bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50 z-10 flex flex-col cursor-pointer active:cursor-grabbing"
        onClick={() => onClick(customer)}
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${customer.is_vip ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-slate-800 leading-tight">{customer.name}</h3>
              <div className="text-[12px] text-slate-500 flex items-center gap-1 mt-0.5">
                <FiPhone className="text-[10px]" /> {customer.phone}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
             {customer.is_vip && (
               <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">VIP</span>
             )}
             <span className="text-[11px] text-slate-400">Oxirgi: {customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString() : 'Yaqinda'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Qarz holati:</span>
            <span className={`text-[13px] font-bold px-2 py-0.5 rounded-md ${parseFloat(customer.total_debt) > 0 ? 'text-red-500 bg-red-50' : 'text-blue-500 bg-blue-50'}`}>
              {parseFloat(customer.total_debt).toLocaleString()} so'm qarz
            </span>
          </div>
          <div className="text-right">
             <span className="text-[11px] text-slate-400 block mb-0.5">Jami harid:</span>
             <span className="text-[13px] font-bold text-slate-700">{parseFloat(customer.total_purchase).toLocaleString()} so'm</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CustomerDetailModal = ({ customer, onClose, onViewReceipt }) => {
  if (!customer) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col"
    >
      <div className="bg-blue-700 text-white px-5 pt-12 pb-6 flex items-center justify-between rounded-b-[32px] shadow-lg relative z-10">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white">
           <FiX className="text-2xl" />
        </button>
        <h2 className="text-lg font-semibold tracking-tight">Mijoz profili</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-5 -mt-4 relative z-20">
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-50 mb-6 flex flex-col items-center mt-8">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-inner mb-4 -mt-12 border-4 border-white ${customer.is_vip ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{customer.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
               <FiPhone /> {customer.phone}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-2">
               <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Jami xaridlar</span>
                  <span className="font-bold text-slate-700">{parseFloat(customer.total_purchase).toLocaleString()}</span>
               </div>
               <div className={`rounded-2xl p-4 text-center ${parseFloat(customer.total_debt) === 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
                  <span className={`text-xs block mb-1 ${parseFloat(customer.total_debt) === 0 ? 'text-blue-600' : 'text-red-600'}`}>Joriy qarz</span>
                  <span className={`font-bold ${parseFloat(customer.total_debt) === 0 ? 'text-blue-600' : 'text-red-600'}`}>{parseFloat(customer.total_debt).toLocaleString()} so'm</span>
               </div>
            </div>
        </div>

        <div className="mb-6 space-y-3">
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
               <FiMapPin />
             </div>
             <div>
               <span className="text-[11px] text-slate-400 block">Manzil</span>
               <span className="text-[14px] font-medium text-slate-700">{customer.address || 'Kiritilmagan'}</span>
             </div>
           </div>
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <FiCalendar />
             </div>
             <div>
               <span className="text-[11px] text-slate-400 block">Oxirgi savdo sanasi</span>
               <span className="text-[14px] font-medium text-slate-700">{customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString() : 'Yaqinda'}</span>
             </div>
           </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
               <FiMessageCircle /> SMS yuborish
            </button>
            <button 
              onClick={onViewReceipt}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
               <FiFileText /> Sotuvlar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AddEditCustomerModal = ({ initialData, onClose, onSave, isPending }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.name && formData.phone) {
      onSave(formData);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/40 flex flex-col justify-end"
    >
      <motion.div 
         initial={{ y: 300 }}
         animate={{ y: 0 }}
         exit={{ y: 300 }}
         className="bg-white rounded-t-[32px] p-6 pt-8 relative w-full max-w-md mx-auto h-[80vh] flex flex-col"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full">
          <FiX />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{initialData ? 'Mijoz tahrirlash' : "Mijoz qo'shish"}</h2>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Ism</label>
              <input required name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="Ismni kiriting" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Telefon</label>
              <input required name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="+998 90 123 45 67" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Manzil</label>
              <input name="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="Toshkent shahri" />
            </div>
          </div>

          <button type="submit" disabled={isPending} className="w-full bg-[#1D4ED8] hover:bg-blue-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center mt-6 transition-colors shadow-lg shadow-blue-500/30">
            {isPending ? <FiLoader className="animate-spin mr-2" /> : (initialData ? 'O\'zgarishlarni saqlash' : 'Saqlash')}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const Customers = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(location.state?.filter || 'Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // API Data
  const statusMap = {
    'Barchasi': null,
    'Qarzdorlar': 'QARZDOR',
    'Faol': 'FAOL',
    'VIP': 'VIP'
  };

  const { data: customersData, isLoading } = useCustomers({ 
    search: searchQuery, 
    status: statusMap[activeFilter] 
  });
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const customerList = customersData?.results || [];

  const handleSaveCustomer = async (data) => {
    try {
      if(customerToEdit) {
        await updateCustomerMutation.mutateAsync({ id: customerToEdit.id, data });
      } else {
        await createCustomerMutation.mutateAsync(data);
      }
      setIsAddEditModalOpen(false);
      setCustomerToEdit(null);
    } catch (error) {}
  };

  const handleDeleteCustomer = async (id) => {
    if(window.confirm('Haqiqatdan ham bu mijozni o\'chirmoqchimisiz?')) {
      try {
        await deleteCustomerMutation.mutateAsync(id);
        if(selectedCustomer?.id === id) setSelectedCustomer(null);
      } catch (error) {}
    }
  }

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setIsAddEditModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-32 text-slate-800">
      <div className="bg-blue-700 text-white px-5 pt-12 pb-6 rounded-b-[32px] shadow-lg relative z-10">
        <div className="flex justify-between items-center">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">Mijozlar</h1>
          <div className="w-[30px]"></div>
        </div>
      </div>

      <div className="px-5 mt-6">
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400 text-lg" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mijoz qidirish..." 
            className="w-full bg-white border border-slate-200 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-[0_4px_15px_rgb(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 mb-4">
           {['Barchasi', 'Qarzdorlar', 'Faol', 'VIP'].map((filter) => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`whitespace-nowrap px-5 py-2.5 rounded-[16px] text-[13px] font-bold transition-all
                 ${activeFilter === filter 
                   ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md shadow-blue-200' 
                   : 'bg-white text-slate-500 border border-slate-100 shadow-sm'
                 }`}
             >
               {filter}
             </button>
           ))}
        </div>

        {/* Customer List */}
        <div className="flex flex-col mt-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : customerList.length > 0 ? (
            customerList.map((customer) => (
               <SwipeableCustomerCard 
                 key={customer.id} 
                 customer={customer} 
                 onClick={setSelectedCustomer} 
                 onEdit={handleEditCustomer}
                 onDelete={handleDeleteCustomer}
               />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-slate-300">
               <p className="text-slate-500 text-sm font-medium mb-1">Mijozlar topilmadi</p>
               <p className="text-xs text-slate-400">Yangi mijoz qo'shish tugmasini bosing</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => { setCustomerToEdit(null); setIsAddEditModalOpen(true); }}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 text-white z-40 active:scale-95 transition-transform"
      >
         <FiPlus className="text-2xl" />
      </button>

      {/* Modals */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailModal 
            customer={selectedCustomer} 
            onClose={() => setSelectedCustomer(null)} 
            onViewReceipt={() => {}} // Could link to sales history
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
         {isAddEditModalOpen && (
            <AddEditCustomerModal 
               initialData={customerToEdit}
               onClose={() => setIsAddEditModalOpen(false)}
               onSave={handleSaveCustomer}
               isPending={createCustomerMutation.isPending || updateCustomerMutation.isPending}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
