import React, { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiMinus, FiX, FiCheck, FiSend, FiSave, FiShare2, FiArrowLeft, FiPackage, FiLoader, FiUserPlus } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useCreateSale } from '../hooks/useSales';
import { toast } from 'react-toastify';

const Sales = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastCreatedSale, setLastCreatedSale] = useState(null);

  // API Data
  const { data: productsData, isLoading: productsLoading } = useProducts({ search: searchTerm });
  const { data: customersData } = useCustomers();
  const createSaleMutation = useCreateSale();

  const products = productsData?.results || [];
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
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.warning('Ombordagi miqdordan ko\'p sotib olib bo\'lmaydi');
      }
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: parseFloat(product.sale_price || 0), 
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
        if (newQuantity <= item.maxQuantity) {
          return { ...item, quantity: newQuantity };
        }
        toast.warning('Ombordagi miqdordan ko\'p sotib olib bo\'lmaydi');
        return item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);
  };

  const getRemainingDebt = () => {
    const total = getTotal();
    const paid = parseFloat(paidAmount) || 0;
    return Math.max(0, total - paid);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (!selectedCustomer) {
      toast.error('Mijozni tanlang');
      return;
    }

    const payload = {
      customer: selectedCustomer.id,
      payment_method: paymentType,
      paid_amount: paymentType === 'debt' ? 0 : (paidAmount ? parseFloat(paidAmount) : getTotal()),
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const result = await createSaleMutation.mutateAsync(payload);
      setLastCreatedSale(result);
      setShowCompletion(true);
    } catch (error) {}
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
    const date = new Date(dateStr);
    return date.toLocaleString('uz-UZ');
  };

  // Sale Completion Screen
  if (showCompletion) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900">{parseFloat(lastCreatedSale?.total || 0).toLocaleString()} so'm</p>
            </div>
            
            <p className="text-xl font-semibold text-gray-900 mb-8">Sotuv yakunlandi</p>
            
            <div className="space-y-3">
              <button
                onClick={handleViewReceipt}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700"
              >
                Chekni ko'rish
              </button>
              <button
                onClick={handleNewSale}
                className="w-full py-4 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50"
              >
                Yangi sotuv
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Receipt Screen
  if (showReceipt) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowReceipt(false)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Chek #{lastCreatedSale?.id}</h2>
            <div className="w-6 h-6" />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">BalonCRM Sotuv cheki</h3>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Sana: {formatDateTime(lastCreatedSale?.created_at)}</p>
            <p className="text-sm text-gray-600 mb-1">Mijoz: {lastCreatedSale?.customer_name}</p>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              <div>Mahsulot</div>
              <div className="text-center">Miqdor</div>
              <div className="text-center">Narx</div>
              <div className="text-right">Jami</div>
            </div>
            <div className="space-y-3">
              {lastCreatedSale?.items?.map((item) => (
                <div key={item.id} className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium text-gray-900">{item.product_name}</div>
                  <div className="text-center text-gray-500">{item.quantity}</div>
                  <div className="text-center text-gray-500">{parseFloat(item.price || 0).toLocaleString()}</div>
                  <div className="text-right font-bold text-gray-900">{(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 border-t border-dashed border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Jami:</span>
              <span>{parseFloat(lastCreatedSale?.total || 0).toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>To'landi:</span>
              <span>{parseFloat(lastCreatedSale?.paid_amount || 0).toLocaleString()} so'm</span>
            </div>
            {parseFloat(lastCreatedSale?.debt_amount || 0) > 0 && (
              <div className="flex justify-between text-sm text-red-500 font-bold mt-1">
                <span>Qarz:</span>
                <span>{parseFloat(lastCreatedSale?.debt_amount || 0).toLocaleString()} so'm</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center">
              <FiSend className="w-4 h-4 mr-2" />
              PDF yuborish
            </button>
            <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 flex items-center justify-center">
              <FiShare2 className="w-4 h-4 mr-2" />
              Ulashish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sotuv Bo'limi</h1>
            <p className="text-sm text-gray-500">Yangi buyurtma rasmiylashtirish</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Customer Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Mijozni tanlash</label>
          </div>
          <select
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const id = e.target.value;
              const customer = customers.find(c => c.id.toString() === id);
              setSelectedCustomer(customer);
            }}
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 font-medium text-base appearance-none"
          >
            <option value="">Mijozni tanlang...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Mahsulotlar</h3>
            <div className="relative flex-1 max-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-xs border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {productsLoading ? (
              <div className="col-span-full py-10 flex justify-center">
                <FiLoader className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className={`group cursor-pointer bg-white rounded-2xl p-3 border border-gray-100 transition-all duration-200 ${
                  product.quantity <= 0 ? 'opacity-50 grayscale' : 'hover:border-blue-500 hover:shadow-md active:scale-95'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                    product.quantity <= 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {product.quantity <= 0 ? 'Yo\'q' : `${product.quantity} ${product.unit}`}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-800 text-xs mb-1 truncate">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-bold text-sm">{parseFloat(product.sale_price || 0).toLocaleString()}</p>
                  <button className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Savatcha</h3>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-xs font-bold">{cart.length} ta mahsulot</span>
            </div>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.price.toLocaleString()} so'm</p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-sm font-bold text-blue-600">
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment and Total */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
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
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      paymentType === type.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              
              {paymentType !== 'debt' && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">To'langan summa (bo'sh bo'lsa to'liq to'langan hisoblanadi)</label>
                  <input
                    type="number"
                    placeholder="Summani kiriting..."
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  />
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between font-bold text-xl text-gray-900">
                  <span>Jami:</span>
                  <span>{getTotal().toLocaleString()} so'm</span>
                </div>
                {paymentType !== 'debt' && paidAmount && (
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Qolgan qarz:</span>
                    <span className="text-red-500">{getRemainingDebt().toLocaleString()} so'm</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={createSaleMutation.isPending || !selectedCustomer}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {createSaleMutation.isPending ? <FiLoader className="animate-spin" /> : <FiCheck className="w-6 h-6" />}
                Sotuvni yakunlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
