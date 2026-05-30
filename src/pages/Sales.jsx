import React, { useState, useMemo } from 'react';
import {
  FiSearch, FiPlus, FiMinus, FiX, FiCheck, FiSend, FiShare2,
  FiArrowLeft, FiPackage, FiLoader, FiShoppingCart, FiUser
} from 'react-icons/fi';
import { useProductsForSale } from '../hooks/useProducts';
import { useCustomers, useCreateCustomer } from '../hooks/useCustomers';
import { useCreateSale } from '../hooks/useSales';
import { toast } from 'react-toastify';
import { AddEditCustomerModal } from './Customers';
import { AnimatePresence } from 'framer-motion';

const Sales = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastCreatedSale, setLastCreatedSale] = useState(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  const { data: productsData, isLoading: productsLoading } = useProductsForSale();
  const { data: customersData } = useCustomers();
  const createSaleMutation = useCreateSale();
  const createCustomerMutation = useCreateCustomer();

  const allProducts = productsData?.results || productsData || [];
  const products = searchTerm
    ? allProducts.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : allProducts;
  const customers = customersData?.results || [];

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      toast.warning('Mahsulot omborda qolmagan');
      return;
    }
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        toast.warning('Ombordagi miqdordan ko\'p sotib olib bo\'lmaydi');
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.sale_price || 0),
        currency: product.currency || 'uzs',
        quantity: 1,
        maxQuantity: product.quantity
      }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return item;
        if (newQuantity <= item.maxQuantity) return { ...item, quantity: newQuantity };
        toast.warning('Ombordagi miqdordan ko\'p sotib olib bo\'lmaydi');
        return item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const getDefaultTotal = () => cart.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);

  // Determine currency from cart (all items assumed same currency)
  const cartCurrency = cart.find(i => i.currency)?.currency || 'uzs';
  const cur = cartCurrency === 'usd' ? '$' : "so'm";

  // Custom sale price entered by user overrides product prices
  const customSaleAmount = parseFloat(paidAmount) || 0;
  const hasCustomAmount = paidAmount !== '' && customSaleAmount > 0 && paymentType !== 'debt';
  const getTotal = () => hasCustomAmount ? customSaleAmount : getDefaultTotal();

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (!selectedCustomer) {
      toast.error('Mijozni tanlang');
      return;
    }

    // Scale item prices so their total matches the custom amount
    const defaultTotal = getDefaultTotal();
    const scaleFactor = (hasCustomAmount && defaultTotal > 0) ? customSaleAmount / defaultTotal : 1;

    const payload = {
      customer: selectedCustomer.id,
      payment_method: paymentType,
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: (item.price * scaleFactor).toFixed(2)
      }))
    };
    try {
      const result = await createSaleMutation.mutateAsync(payload);
      setLastCreatedSale(result);
      setShowCompletion(true);
    } catch (error) { }
  };

  const handleViewReceipt = () => {
    setShowCompletion(false);
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    setShowCompletion(false);
    setShowReceipt(false);
    setCart([]);
    setPaidAmount('');
    setPaymentType('cash');
    setSelectedCustomer(null);
    setLastCreatedSale(null);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('uz-UZ');
  };

  // Completion modal
  if (showCompletion) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{parseFloat(lastCreatedSale?.total || 0).toLocaleString()} {cur}</p>
            <p className="text-gray-400 text-sm mb-6">Sotuv muvaffaqiyatli yakunlandi</p>
            <div className="space-y-3">
              <button
                onClick={handleViewReceipt}
                className="w-full py-3.5 bg-[#1447E6] text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
              >
                Chekni ko'rish
              </button>
              <button
                onClick={handleNewSale}
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Yangi sotuv
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Receipt modal
  if (showReceipt) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setShowReceipt(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Chek #{lastCreatedSale?.id}</h2>
            <div className="w-9" />
          </div>

          <div className="text-center mb-5">
            <h3 className="text-base font-bold text-gray-900">BalonCRM Sotuv cheki</h3>
            <p className="text-xs text-gray-400 mt-1">{formatDateTime(lastCreatedSale?.created_at)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Mijoz: {lastCreatedSale?.customer_name}</p>
          </div>

          <div className="mb-5 space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">
              <div>Mahsulot</div>
              <div className="text-center">Miqdor</div>
              <div className="text-center">Narx</div>
              <div className="text-right">Jami</div>
            </div>
            {lastCreatedSale?.items?.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-2 text-sm py-1.5">
                <div className="font-medium text-gray-900 text-xs truncate">{item.product_name}</div>
                <div className="text-center text-gray-500 text-xs">{item.quantity}</div>
                <div className="text-center text-gray-500 text-xs">{parseFloat(item.price || 0).toLocaleString()}</div>
                <div className="text-right font-bold text-gray-900 text-xs">{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-5">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Jami:</span>
              <span>{parseFloat(lastCreatedSale?.total || 0).toLocaleString()} {cur}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>To'landi:</span>
              <span>{parseFloat(lastCreatedSale?.paid_amount || 0).toLocaleString()} {cur}</span>
            </div>
            {parseFloat(lastCreatedSale?.debt_amount || 0) > 0 && (
              <div className="flex justify-between text-sm font-bold text-red-500">
                <span>Qarz:</span>
                <span>{parseFloat(lastCreatedSale?.debt_amount || 0).toLocaleString()} {cur}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-32">
      {/* Sticky header */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sotuv</h1>
            <p className="text-xs text-gray-400">Yangi buyurtma rasmiylashtirish</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Customer selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Mijozni tanlash</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400 w-4 h-4" />
              </div>
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const customer = customers.find(c => c.id.toString() === id);
                  setSelectedCustomer(customer || null);
                }}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all text-gray-900 font-medium text-sm appearance-none outline-none"
              >
                <option value="">Mijozni tanlang...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="w-[46px] h-[46px] shrink-0 bg-[#1447E6] hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-gray-900">Mahsulotlar</h3>
            <div className="relative flex-1 max-w-[180px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {productsLoading ? (
              <div className="col-span-full py-10 flex justify-center">
                <FiLoader className="w-6 h-6 text-[#1447E6] animate-spin" />
              </div>
            ) : products.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className={`group cursor-pointer bg-white rounded-2xl p-3 border transition-all duration-200 ${product.quantity <= 0
                  ? 'opacity-50 grayscale border-gray-100'
                  : 'border-gray-100 hover:border-[#1447E6] hover:shadow-md active:scale-95'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-4 h-4 text-[#1447E6]" />
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg ${product.quantity <= 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {product.quantity <= 0 ? 'Yo\'q' : `${product.quantity} ${product.unit}`}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-xs mb-1.5 truncate leading-tight">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-[#1447E6] font-bold text-sm">
                    {parseFloat(product.sale_price || 0).toLocaleString()} {product.currency === 'usd' ? '$' : "so'm"}
                  </p>
                  <div className="w-6 h-6 bg-blue-50 text-[#1447E6] rounded-lg flex items-center justify-center group-hover:bg-[#1447E6] group-hover:text-white transition-colors">
                    <FiPlus className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Savatcha</h3>
              <span className="bg-blue-50 text-[#1447E6] px-2.5 py-1 rounded-xl text-xs font-bold">{cart.length} ta</span>
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400">{item.price.toLocaleString()} {item.currency === 'usd' ? '$' : "so'm"}</p>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-xl p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1447E6]"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-gray-900 text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1447E6]"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-[#1447E6] min-w-[70px] text-right">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Payment type toggle */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: 'cash', label: 'Naqd' },
                { id: 'debt', label: 'Nasiya' },
                { id: 'card', label: 'Karta' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setPaymentType(type.id);
                    if (type.id === 'debt') setPaidAmount('0');
                    else setPaidAmount('');
                  }}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all ${paymentType === type.id
                    ? 'bg-[#1447E6] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {paymentType !== 'debt' && (
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Sotuv narxi (mahsulot narxini o'zgartirish uchun)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Maxsus narx kiriting..."
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] font-bold text-sm outline-none"
                  />
                  {paidAmount !== '' && (
                    <button
                      type="button"
                      onClick={() => setPaidAmount('')}
                      className="px-3 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-gray-200 transition-colors"
                    >
                      Tozalash
                    </button>
                  )}
                </div>
                {hasCustomAmount && (
                  <p className="text-[10px] text-blue-500 mt-1.5 font-semibold">
                    Standart narx: {getDefaultTotal().toLocaleString()} {cur} → Maxsus: {customSaleAmount.toLocaleString()} {cur}
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 space-y-2 mb-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span className="text-sm">Jami:</span>
                <span className={`text-base ${hasCustomAmount ? 'text-blue-600' : ''}`}>
                  {getTotal().toLocaleString()} {cur}
                </span>
              </div>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={createSaleMutation.isPending || !selectedCustomer}
              className="w-full py-4 bg-[#1447E6] text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createSaleMutation.isPending ? <FiLoader className="animate-spin w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
              Sotuvni yakunlash
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isAddCustomerModalOpen && (
          <AddEditCustomerModal
            onClose={() => setIsAddCustomerModalOpen(false)}
            onSave={async (data) => {
              try {
                const newCustomer = await createCustomerMutation.mutateAsync(data);
                setSelectedCustomer(newCustomer || null);
                setIsAddCustomerModalOpen(false);
              } catch (error) {}
            }}
            isPending={createCustomerMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sales;
