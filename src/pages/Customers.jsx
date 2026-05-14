import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiBell, FiPlus, FiSearch, FiPhone, FiEdit, 
  FiTrash2, FiMessageCircle, FiFileText, FiX, FiCheckCircle, 
  FiMapPin, FiCalendar, FiArrowRight, FiCreditCard, FiDownload, FiShare2
} from 'react-icons/fi';
import { FiSend } from 'react-icons/fi';

// Initial Mock Data
const initialStats = [
  { id: 1, title: 'Jami mijozlar', value: '245', label: 'ta', color: 'from-blue-500 to-blue-600' },
  { id: 2, title: 'Qarzdorlar', value: '18', label: 'ta', color: 'from-blue-500 to-blue-600' },
  { id: 3, title: 'VIP mijozlar', value: '12', label: 'ta', color: 'from-blue-500 to-blue-700' },
  { id: 4, title: 'Bugungi buyurt', value: '9', label: 'ta', color: 'from-blue-400 to-blue-500' },
];

const initialCustomers = [
  {
    id: 1,
    name: 'Dilshodbek',
    phone: '+998 90 123 45 67',
    address: 'Toshkent, Chilonzor',
    lastPurchase: '24.05.2026',
    debt: '1,200,000',
    totalSpent: '12,450,000',
    status: 'Qarzdor',
  },
  {
    id: 2,
    name: 'Oybek',
    phone: '+998 91 234 56 78',
    address: 'Toshkent, Yunusobod',
    lastPurchase: '20.05.2026',
    debt: '0',
    totalSpent: '45,600,000',
    status: 'VIP',
    isVIP: true,
  },
  {
    id: 3,
    name: 'Madina',
    phone: '+998 93 456 78 90',
    address: 'Toshkent, Sergeli',
    lastPurchase: '18.05.2026',
    debt: '500,000',
    totalSpent: '8,300,000',
    status: 'Faol',
  }
];

const SwipeableCustomerCard = ({ customer, onClick, onEdit, onDelete }) => {
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (event, info) => {
     if (info.offset.x < -80) {
        // Swiped left sufficiently -> you could trigger the rightmost action, but let's just let it snap open or we can auto-delete.
        // For simplicity, we snap it or just keep default spring.
     }
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-[24px]">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center rounded-[24px]">
        {/* Right Swipe Background (Actions on left side) */}
        <div className="w-1/2 h-full bg-gradient-to-r from-blue-500 to-blue-400 p-4 flex items-center justify-start gap-3 rounded-l-[24px]">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiPlus className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Sotuv</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiCreditCard className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Qarz</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiSend className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Telegram</span>
          </div>
        </div>

        {/* Left Swipe Background (Actions on right side) */}
        <div className="w-1/2 h-full bg-gradient-to-l from-blue-500 to-blue-400 p-4 flex items-center justify-end gap-3 rounded-r-[24px]">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <div className="bg-white/20 p-2 rounded-full mb-1"><FiPhone className="text-white text-lg" /></div>
            <span className="text-[10px] text-white font-medium">Qo'ng'iroq</span>
          </div>
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

      {/* Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50 z-10 flex flex-col cursor-pointer active:cursor-grabbing"
        onClick={() => onClick(customer)}
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${customer.isVIP ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
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
             {customer.isVIP && (
               <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">VIP</span>
             )}
             {!customer.isVIP && customer.status === 'Faol' && (
               <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">FAOL</span>
             )}
             <span className="text-[11px] text-slate-400">Oxirgi: {customer.lastPurchase || 'Yaqinda'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Qarz holati:</span>
            {customer.debt === '0' ? (
              <span className="text-[13px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">0 so'm qarz</span>
            ) : (
              <span className="text-[13px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{customer.debt} so'm qarz</span>
            )}
          </div>
          <div className="text-right">
             <span className="text-[11px] text-slate-400 block mb-0.5">Jami harid:</span>
             <span className="text-[13px] font-bold text-slate-700">{customer.totalSpent || '0'} so'm</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CustomerDetailModal = ({ customer, onClose, onPayDebt, onViewReceipt }) => {
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
           <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-inner mb-4 -mt-12 border-4 border-white ${customer.isVIP ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-blue-600 to-blue-800'}`}>
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{customer.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
               <FiPhone /> {customer.phone}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-2">
               <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Jami xaridlar</span>
                  <span className="font-bold text-slate-700">{customer.totalSpent || '0'}</span>
               </div>
               <div className={`rounded-2xl p-4 text-center ${customer.debt === '0' ? 'bg-blue-50' : 'bg-blue-50'}`}>
                  <span className={`text-xs block mb-1 ${customer.debt === '0' ? 'text-blue-600' : 'text-blue-600'}`}>Joriy qarz</span>
                  <span className={`font-bold ${customer.debt === '0' ? 'text-blue-600' : 'text-blue-600'}`}>{customer.debt === '0' ? '0' : customer.debt} so'm</span>
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
               <span className="text-[14px] font-medium text-slate-700">{customer.address}</span>
             </div>
           </div>
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <FiCalendar />
             </div>
             <div>
               <span className="text-[11px] text-slate-400 block">Oxirgi savdo sanasi</span>
               <span className="text-[14px] font-medium text-slate-700">{customer.lastPurchase || 'Yaqinda'}</span>
             </div>
           </div>
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
               <FiSend />
             </div>
             <div>
               <span className="text-[11px] text-slate-400 block">Telegram orqali bog'lanish</span>
               <span className="text-[14px] font-medium text-blue-600 cursor-pointer">@{(customer.name || '').toLowerCase().replace(/\s+/g,'')}_tg</span>
             </div>
           </div>
        </div>

        <div className="space-y-3">
          {customer.debt !== '0' && (
            <button 
              onClick={() => onPayDebt(customer.id)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-200">
               <FiCheckCircle className="text-lg" /> Qarz to'landi
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
               <FiMessageCircle /> SMS yuborish
            </button>
            <button 
              onClick={onViewReceipt}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
               <FiFileText /> Chek ko'rish
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AddEditCustomerModal = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

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
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="Ismni kiriting" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Telefon</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="+998 90 123 45 67" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Manzil</label>
              <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" placeholder="Toshkent shahri" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1D4ED8] hover:bg-blue-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center mt-6 transition-colors shadow-lg shadow-blue-500/30">
            {initialData ? 'O\'zgarishlarni saqlash' : 'Saqlash'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const ReceiptModal = ({ isVisible, onClose }) => {
  if(!isVisible) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-5"
    >
       <motion.div 
         initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
         className="bg-white rounded-[24px] overflow-hidden w-full max-w-sm"
       >
          <div className="p-6 pb-4 border-b border-dashed border-slate-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800">BalonCRM</h3>
                <button onClick={onClose}><FiX className="text-slate-400 text-xl" /></button>
             </div>
             <p className="text-center text-sm text-slate-500 mb-6 block">Sotuv cheki</p>
             
             <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Sana:</span><span className="font-medium">24.05.2026 10:30</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Mijoz:</span><span className="font-medium">Dilshodbek</span></div>
             </div>

             <div className="mt-6 space-y-3">
               <div className="flex justify-between font-bold text-sm text-slate-800 border-b pb-2"><span className="flex-1">Mahsulot</span><span className="w-12 text-center">Miq</span><span className="w-16 text-right">Jami</span></div>
               <div className="flex justify-between text-sm text-slate-600"><span className="flex-1">Folga balon</span><span className="w-12 text-center">2</span><span className="w-16 text-right font-medium">6,000</span></div>
             </div>

             <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800">Barchasi:</span>
                <span className="font-bold text-xl text-blue-600">6,000 so'm</span>
             </div>
             <div className="mt-2 flex justify-between text-sm">
               <span className="text-slate-500">To'lov turi:</span>
               <span className="font-bold text-blue-500 bg-blue-50 px-2 rounded">Naqd</span>
             </div>
          </div>
          <div className="p-4 bg-slate-50 flex gap-3">
             <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-sm"><FiDownload /> PDF yuklash</button>
             <button className="flex-1 bg-[#1D4ED8] text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-sm shadow-blue-500/30"><FiShare2 /> Ulashish</button>
          </div>
       </motion.div>
    </motion.div>
  )
}

const Customers = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(location.state?.filter || 'Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [customerList, setCustomerList] = useState(initialCustomers);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const filters = ['Barchasi', 'Qarzdorlar', 'Faol', 'VIP'];

  // Add / Edit handler
  const handleSaveCustomer = (data) => {
    if(customerToEdit) {
      setCustomerList(customerList.map(c => c.id === customerToEdit.id ? { ...c, ...data } : c));
    } else {
      const newCustomer = {
        id: Date.now(),
        ...data,
        debt: '0',
        totalSpent: '0',
        status: 'Yangi',
        isVIP: false,
        lastPurchase: 'Hech narsa xarid qilmagan',
      };
      setCustomerList([newCustomer, ...customerList]);
    }
    setIsAddEditModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleDeleteCustomer = (id) => {
    if(window.confirm('Haqiqatdan ham bu mijozni o\'chirmoqchimisiz?')) {
      setCustomerList(customerList.filter(c => c.id !== id));
      if(selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  }

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setIsAddEditModalOpen(true);
  }

  const handlePayDebt = (id) => {
    setCustomerList(customerList.map(c => c.id === id ? { ...c, debt: '0' } : c));
    if(selectedCustomer?.id === id) setSelectedCustomer({...selectedCustomer, debt: '0'});
  }

  // Filter & Search Logic
  const filteredCustomers = customerList.filter(customer => {
    const q = searchQuery.toLowerCase();
    const searchMatch = (customer.name && customer.name.toLowerCase().includes(q)) || (customer.phone && customer.phone.includes(q));
    
    const filterMatch = 
      activeFilter === 'Barchasi' ? true :
      activeFilter === 'Qarzdorlar' ? customer.debt !== '0' :
      activeFilter === 'Faol' ? customer.status === 'Faol' :
      activeFilter === 'VIP' ? customer.isVIP : true;

    return searchMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-32 text-slate-800">
      
      {/* Top Navbar */}
      <div className="bg-blue-700 text-white px-5 pt-12 pb-6 rounded-b-[32px] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-0">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FiMenu className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">Mijozlar</h1>
          <div className="w-[30px] flex items-center gap-1">
            <button className="p-2 hover:bg-white/10 rounded-full transition-all relative">
              {/* <FiBell className="text-xl" /> */}
              {/* <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-blue-700"></span> */}
            </button>
          </div>
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
            className="w-full bg-white border border-slate-200 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-[0_4px_15px_rgb(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 mb-4 border-b border-transparent">
           {filters.map((filter) => (
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

        {/* Stats / Analytics cards horizonally scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-5 px-5">
           {initialStats.map(stat => (
             <div key={stat.id} className="min-w-[140px] bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50 flex-shrink-0">
               <span className="text-[11px] font-bold text-slate-400 block mb-2">{stat.title}</span>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-slate-800">{
                    stat.id === 1 ? customerList.length : 
                    stat.id === 2 ? customerList.filter(c=>c.debt !== '0').length :
                    stat.id === 3 ? customerList.filter(c=>c.isVIP).length : stat.value
                 }</span>
                 <span className="text-[11px] font-bold text-slate-400">{stat.label}</span>
               </div>
               <div className={`mt-3 h-1 w-8 rounded-full bg-gradient-to-r ${stat.color}`}></div>
             </div>
           ))}
        </div>

        {/* List header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-[15px] font-bold text-slate-800">Mijozlar ro'yxati ({filteredCustomers.length})</h2>
          <span className="text-[12px] font-medium text-blue-700 cursor-pointer">Barchasini ko'rish</span>
        </div>

        {/* Customer List */}
        <div className="flex flex-col">
          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
             <SwipeableCustomerCard 
               key={customer.id} 
               customer={customer} 
               onClick={setSelectedCustomer} 
               onEdit={handleEditCustomer}
               onDelete={handleDeleteCustomer}
             />
          )) : (
            <div className="text-center py-10 bg-white rounded-[24px] border border-dashed border-slate-300">
               <p className="text-slate-500 text-sm font-medium mb-1">Mijozlar topilmadi</p>
               <p className="text-xs text-slate-400">Boshqa so'z bilan qidirib ko'ring yoki yangi qo'shing</p>
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

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailModal 
            customer={selectedCustomer} 
            onClose={() => setSelectedCustomer(null)} 
            onPayDebt={handlePayDebt}
            onViewReceipt={() => setIsReceiptModalOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
         {isAddEditModalOpen && (
            <AddEditCustomerModal 
               initialData={customerToEdit}
               onClose={() => setIsAddEditModalOpen(false)}
               onSave={handleSaveCustomer}
            />
         )}
      </AnimatePresence>

      <AnimatePresence>
         <ReceiptModal 
           isVisible={isReceiptModalOpen}
           onClose={() => setIsReceiptModalOpen(false)}
         />
      </AnimatePresence>

    </div>
  );
};

export default Customers;
