import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiPackage, FiCheck } from 'react-icons/fi';
import warehouseService from '../services/warehouse.service';
import { toast } from 'react-toastify';

const Warehouse = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showCatDeleteConfirm, setShowCatDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    sale_price: '',
    cost_price: '',
    unit: 'dona',
    low_stock_threshold: 10
  });

  // Fetch products and categories
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        warehouseService.getProducts({ search: searchTerm }),
        warehouseService.getCategories()
      ]);
      setProducts(productsData.results || productsData);
      const catList = categoriesData.results || categoriesData;
      setCategories(catList);
      
      // Set default category for form if not set
      if (catList.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catList[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good': return 'Yaxshi';
      case 'low': return 'Kam';
      case 'critical': return 'Tanqis';
      default: return 'Noma\'lum';
    }
  };

  const handleAddProduct = async () => {
    try {
      await warehouseService.createProduct({
        ...formData,
        quantity: parseInt(formData.quantity),
        sale_price: formData.sale_price,
        cost_price: formData.cost_price || "0"
      });
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi');
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Mahsulot qo\'shishda xatolik');
    }
  };

  const handleEditProduct = async () => {
    try {
      await warehouseService.updateProduct(selectedProduct.id, {
        ...formData,
        quantity: parseInt(formData.quantity),
        sale_price: formData.sale_price,
        cost_price: formData.cost_price
      });
      toast.success('Mahsulot yangilandi');
      setShowEditModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Mahsulotni yangilashda xatolik');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await warehouseService.deleteProduct(selectedProduct.id);
      toast.success('Mahsulot o\'chirildi');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchData();
    } catch (error) {
      toast.error('Mahsulotni o\'chirishda xatolik');
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity.toString(),
      sale_price: product.sale_price.toString(),
      cost_price: product.cost_price?.toString() || '',
      unit: product.unit || 'dona',
      low_stock_threshold: product.low_stock_threshold || 10
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      category: categories[0]?.id || '', 
      quantity: '', 
      sale_price: '',
      cost_price: '',
      unit: 'dona',
      low_stock_threshold: 10
    });
    setSelectedProduct(null);
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        await warehouseService.createCategory({ name: newCategory });
        setNewCategory('');
        fetchData();
        toast.success('Kategoriya qo\'shildi');
      } catch (error) {
        toast.error('Kategoriya qo\'shishda xatolik');
      }
    }
  };

  const handleDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setShowCatDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await warehouseService.deleteCategory(categoryToDelete.id);
      setShowCatDeleteConfirm(false);
      setCategoryToDelete(null);
      fetchData();
      toast.success('Kategoriya o\'chirildi');
    } catch (error) {
      toast.error('Kategoriyani o\'chirishda xatolik');
    }
  };

  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setEditValue(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (editValue && editValue !== editingCategory.name) {
      try {
        await warehouseService.updateCategory(editingCategory.id, { name: editValue });
        setEditingCategory(null);
        fetchData();
        toast.success('Kategoriya yangilandi');
      } catch (error) {
        toast.error('Kategoriyani yangilashda xatolik');
      }
    } else {
      setEditingCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ombor Nazorati</h1>
            <p className="text-sm text-gray-500">Zaxira va mahsulotlar boshqaruvi</p>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <FiPackage className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Action Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-sm border border-gray-200 focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowCategoryModal(true)}
              className="flex-1 md:flex-none px-5 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all text-xs font-semibold whitespace-nowrap"
            >
              Kategoriyalar
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 md:flex-none px-5 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-lg shadow-gray-200 whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              Mahsulot qo'shish
            </button>
          </div>
        </div>

      {/* Product Grid */}
      <div className="py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-500 font-medium">Yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <FiPackage className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Mahsulot topilmadi' : 'Ombor bo\'sh'}
            </h3>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-[240px]">
              {searchTerm ? 'Qidiruvga mos mahsulot topilmadi' : 'Hali hech qanday mahsulot qo\'shilmagan'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
              >
                <FiPlus className="w-5 h-5" />
                Mahsulot qo'shish
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group hover:border-purple-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                    <FiPackage className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest border ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[9px] font-semibold text-purple-600 uppercase tracking-widest mb-1 block">
                    {product.category_name}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3 mb-4">
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase">Qoldiq</p>
                    <p className="text-base font-bold text-gray-900">{product.quantity} <span className="text-[10px] text-gray-400">{product.unit || 'dona'}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-semibold uppercase">Narxi</p>
                    <p className="text-base font-bold text-gray-900">{parseFloat(product.sale_price).toLocaleString()} <span className="text-[10px] text-gray-400">so'm</span></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Mahsulot qo'shish</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mahsulot nomini kiriting"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tanlang</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birlik</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="dona">Dona</option>
                    <option value="kg">Kg</option>
                    <option value="litr">Litr</option>
                    <option value="metr">Metr</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sotib olish narxi</label>
                  <input
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sotish narxi</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miqdor</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kam qolish chegarasi</label>
                  <input
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={!formData.name || !formData.quantity || !formData.sale_price || !formData.category}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Mahsulotni tahrirlash</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mahsulot nomini kiriting"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tanlang</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birlik</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="dona">Dona</option>
                    <option value="kg">Kg</option>
                    <option value="litr">Litr</option>
                    <option value="metr">Metr</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sotib olish narxi</label>
                  <input
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sotish narxi</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miqdor</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kam qolish chegarasi</label>
                  <input
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleEditProduct}
                  disabled={!formData.name || !formData.quantity || !formData.sale_price || !formData.category}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yangilash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mahsulotni o'chirish</h3>
              <p className="text-sm text-gray-600">
                "{selectedProduct?.name}" mahsulotini rostdan ham o'chirmoqchimisiz?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center px-4">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-md animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kategoriyalar</h2>
                <p className="text-xs text-gray-400 mt-1">Mahsulot turlarini boshqarish</p>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yangi kategoriya nomi..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                    {editingCategory?.id === cat.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateCategory}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-gray-700">{cat.name} ({cat.product_count})</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Tahrirlash"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="O'chirish"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
      {showCatDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center px-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm animate-fade-in shadow-2xl border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Kategoriyani o'chirish?</h3>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                <span className="font-bold text-gray-900">"{categoryToDelete?.name}"</span> kategoriyasini o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCatDeleteConfirm(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all"
                >
                  Yo'q, qolsin
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-xs hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all"
                >
                  Ha, o'chirilsin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse;
