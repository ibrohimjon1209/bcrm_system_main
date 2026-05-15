import React, { useState } from 'react';
import { FiPlus, FiSearch, FiPackage, FiTruck, FiChevronRight, FiX, FiCheck, FiMinus, FiLoader, FiDollarSign } from 'react-icons/fi';
import { usePurchases, useCreatePurchase, useSuppliers } from '../hooks/usePurchases';
import { useProducts } from '../hooks/useProducts';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Purchases = () => {
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Purchase State
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [cart, setCart] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  // API Hooks
  const { data: purchasesData, isLoading: purchasesLoading } = usePurchases();
  const { data: suppliersData } = useSuppliers();
  const { data: productsData } = useProducts({ search: productSearch });
  const createPurchaseMutation = useCreatePurchase();

  const purchases = purchasesData?.results || [];
  const suppliers = suppliersData?.results || [];
  const products = productsData?.results || [];

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: parseFloat(product.cost_price || 0), quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);

  const handleCompletePurchase = async () => {
    if (!selectedSupplier) {
      toast.error('Yetkazib beruvchini tanlang');
      return;
    }
    if (cart.length === 0) {
      toast.error('Mahsulotlarni tanlang');
      return;
    }

    const payload = {
      supplier: selectedSupplier.id,
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        cost_price: item.price
      })),
      note: ''
    };

    try {
      await createPurchaseMutation.mutateAsync(payload);
      setIsNewPurchaseOpen(false);
      setCart([]);
      setSelectedSupplier(null);
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Xaridlar (Taminot)</h1>
            <p className="text-sm text-gray-500 font-medium">Omborni to'ldirish va taminot boshqaruvi</p>
          </div>
          <button 
            onClick={() => setIsNewPurchaseOpen(true)}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
          >
            <FiPlus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {purchasesLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : purchases.length > 0 ? (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-500 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <FiTruck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{purchase.supplier_name}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(purchase.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="text-lg font-black text-gray-900">{parseFloat(purchase.total || 0).toLocaleString()} so'm</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Qabul qilindi</p>
                  </div>
                  <FiChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <FiPackage className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Xaridlar yo'q</h3>
            <p className="text-gray-500">Omborga mahsulot qabul qilish uchun + tugmasini bosing</p>
          </div>
        )}
      </div>

      {/* New Purchase Modal */}
      <AnimatePresence>
        {isNewPurchaseOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white rounded-t-[3rem] w-full max-w-4xl mx-auto h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-black text-gray-900">Yangi Xarid Qabul Qilish</h2>
                <button onClick={() => setIsNewPurchaseOpen(false)} className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Supplier Section */}
                <section>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Yetkazib Beruvchi</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {suppliers.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedSupplier(s)}
                        className={`p-4 rounded-3xl border-2 transition-all text-left ${
                          selectedSupplier?.id === s.id ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <p className={`font-bold text-sm ${selectedSupplier?.id === s.id ? 'text-blue-600' : 'text-gray-700'}`}>{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{s.phone}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Product Search & Selection */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mahsulotlarni qo'shish</label>
                    <div className="relative w-64">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" placeholder="Qidirish..." 
                        value={productSearch} onChange={e => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {products.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => addToCart(p)}
                        className="shrink-0 w-32 p-4 bg-white border border-gray-100 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 mx-auto">
                          <FiPackage />
                        </div>
                        <p className="text-[10px] font-bold text-gray-900 truncate text-center">{p.name}</p>
                        <p className="text-[9px] text-blue-600 font-black text-center mt-1">{parseFloat(p.cost_price || 0).toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Cart Section */}
                {cart.length > 0 && (
                  <section className="bg-gray-50/50 rounded-[2.5rem] p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tanlangan Mahsulotlar</h3>
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{parseFloat(item.price || 0).toLocaleString()} so'm</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600"><FiMinus /></button>
                              <span className="w-10 text-center font-black text-gray-900 text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600"><FiPlus /></button>
                            </div>
                            <div className="text-right min-w-[100px]">
                              <p className="text-sm font-black text-blue-600">{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Umumiy Summa</p>
                    <p className="text-3xl font-black text-gray-900">{getTotal().toLocaleString()} <span className="text-sm font-bold opacity-30">so'm</span></p>
                  </div>
                  {selectedSupplier && (
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taminotchi</p>
                      <p className="text-sm font-bold text-blue-600">{selectedSupplier.name}</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleCompletePurchase}
                  disabled={createPurchaseMutation.isPending || cart.length === 0}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {createPurchaseMutation.isPending ? <FiLoader className="animate-spin" /> : <FiCheck className="w-6 h-6" />}
                  Xaridni Saqlash (Qabul)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Purchases;
