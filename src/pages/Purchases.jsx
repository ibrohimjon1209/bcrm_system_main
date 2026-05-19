import React, { useState } from 'react';
import {
  FiPlus, FiSearch, FiPackage, FiTruck, FiX, FiCheck,
  FiMinus, FiLoader, FiTrash2
} from 'react-icons/fi';
import { usePurchases, useCreatePurchase, useDeletePurchase, useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../hooks/usePurchases';
import { useProducts } from '../hooks/useProducts';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const paymentMethodLabel = (method) => {
  const map = { cash: 'Naqd', card: 'Karta', debt: 'Nasiya' };
  return map[method] || method || 'Naqd';
};

const paymentBadgeClass = (method) => {
  if (method === 'card') return 'bg-blue-50 text-blue-600';
  if (method === 'debt') return 'bg-orange-50 text-orange-600';
  return 'bg-emerald-50 text-emerald-600';
};

const Purchases = () => {
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [cart, setCart] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  const { data: purchasesData, isLoading: purchasesLoading } = usePurchases();
  const { data: suppliersData } = useSuppliers();
  const { data: productsData } = useProducts({ search: productSearch });
  const createPurchaseMutation = useCreatePurchase();
  const deletePurchaseMutation = useDeletePurchase();
  const createSupplierMutation = useCreateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  const purchases = purchasesData?.results || [];
  const suppliers = suppliersData?.results || [];
  const products = productsData?.results || [];

  const filteredPurchases = searchTerm
    ? purchases.filter(p => p.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : purchases;

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
    <div className="min-h-screen bg-[#F0F4FF] pb-32 md:pb-8">
      {/* Blue gradient header */}
      <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 md:px-8 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute top-12 -right-4 w-16 h-16 bg-white/5 rounded-full" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Xaridlar</h1>
            <p className="text-blue-200 text-sm mt-0.5">Taminot boshqaruvi</p>
          </div>
          <button
            onClick={() => setIsNewPurchaseOpen(true)}
            className="w-10 h-10 bg-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 max-w-6xl mx-auto">
        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Yetkazib beruvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]"
          />
        </div>

        {/* Purchase list */}
        {purchasesLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="w-10 h-10 text-[#1447E6] animate-spin" />
          </div>
        ) : filteredPurchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1447E6] shrink-0">
                    <FiTruck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{purchase.supplier_name}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{parseFloat(purchase.total || 0).toLocaleString()} so'm</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${paymentBadgeClass(purchase.payment_method)}`}>
                      {paymentMethodLabel(purchase.payment_method)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Bu xaridni o'chirmoqchimisiz?")) {
                        deletePurchaseMutation.mutate(purchase.id);
                      }
                    }}
                    disabled={deletePurchaseMutation.isPending}
                    className="w-9 h-9 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {deletePurchaseMutation.isPending ? <FiLoader className="animate-spin w-3 h-3" /> : <FiTrash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <FiTruck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">Xaridlar yo'q</h3>
            <p className="text-gray-400 text-sm">Omborga mahsulot qabul qilish uchun + tugmasini bosing</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsNewPurchaseOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#1447E6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 text-white z-40 active:scale-95 transition-transform"
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* New Purchase Modal */}
      <AnimatePresence>
        {isNewPurchaseOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-[#F0F4FF] rounded-t-3xl w-full max-w-2xl mx-auto h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 pt-6 pb-5 flex items-center justify-between shrink-0">
                <h2 className="text-white text-lg font-bold">Yangi Xarid</h2>
                <button
                  onClick={() => setIsNewPurchaseOpen(false)}
                  className="w-9 h-9 bg-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Supplier selection */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Yetkazib Beruvchi</label>
                  <div className="grid grid-cols-2 gap-2">
                    {suppliers.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSupplier(s)}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${
                          selectedSupplier?.id === s.id
                            ? 'border-[#1447E6] bg-blue-50'
                            : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <p className={`font-bold text-sm ${selectedSupplier?.id === s.id ? 'text-[#1447E6]' : 'text-gray-700'}`}>{s.name}</p>
                        {s.phone && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.phone}</p>}
                      </button>
                    ))}
                  </div>
                  {selectedSupplier && (
                    <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
                      <div className="w-5 h-5 bg-[#1447E6] rounded-full flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-[#1447E6]">{selectedSupplier.name} tanlandi</span>
                    </div>
                  )}
                </div>

                {/* Product search & horizontal scroll */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mahsulotlar</label>
                    <div className="relative w-40">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                      <input
                        type="text"
                        placeholder="Qidirish..."
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {products.map(p => (
                      <button
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className="shrink-0 w-28 p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#1447E6] hover:shadow-sm transition-all active:scale-95 text-left"
                      >
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#1447E6] mb-2">
                          <FiPackage className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[9px] text-[#1447E6] font-bold mt-0.5">{parseFloat(p.cost_price || 0).toLocaleString()} so'm</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cart */}
                {cart.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Tanlangan Mahsulotlar</h3>
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-xs truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{parseFloat(item.price || 0).toLocaleString()} so'm</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white rounded-xl border border-gray-100 p-0.5">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1447E6]">
                                <FiMinus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-black text-gray-900 text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1447E6]">
                                <FiPlus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs font-black text-[#1447E6] min-w-[72px] text-right">
                              {(parseFloat(item.price || 0) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-gray-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Umumiy Summa</p>
                    <p className="text-2xl font-black text-gray-900">
                      {getTotal().toLocaleString()} <span className="text-sm font-bold text-gray-400">so'm</span>
                    </p>
                  </div>
                  {selectedSupplier && (
                    <div className="text-right bg-blue-50 px-3 py-2 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taminotchi</p>
                      <p className="text-sm font-bold text-[#1447E6]">{selectedSupplier.name}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCompletePurchase}
                  disabled={createPurchaseMutation.isPending || cart.length === 0}
                  className="w-full py-4 bg-[#1447E6] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createPurchaseMutation.isPending ? <FiLoader className="animate-spin w-5 h-5" /> : <FiCheck className="w-5 h-5" />}
                  Xaridni Saqlash
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
