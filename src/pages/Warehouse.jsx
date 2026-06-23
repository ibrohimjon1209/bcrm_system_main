import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MagnifyingGlass, Plus, Minus, PencilSimple, Trash, X, Package,
  Check, Spinner, WarningCircle, CaretLeft, CaretRight,
  Stack, ArrowRight
} from '@phosphor-icons/react';
import {
  useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
  useLowStockProducts,
  useCreateVariant, useUpdateVariant, useDeleteVariant
} from '../hooks/useProducts';

const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all";
const smallInputClass = "w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";
const UNITS = ['dona', 'kg', 'litr', 'metr', 'quti', 'juft'];

const SearchableCategorySelect = ({ categories, selectedCategoryId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const selected = categories.find(c => c.id.toString() === selectedCategoryId?.toString());
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={inputClass + ' flex items-center justify-between text-left'}
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.name : 'Kategoriya tanlang...'}
        </span>
        <CaretRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="relative mb-2">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Qidirish..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-gray-100 focus:border-[#1447E6]"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className="max-h-44 overflow-y-auto space-y-0.5">
                <button
                  type="button"
                  onClick={() => { onSelect(''); setIsOpen(false); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!selectedCategoryId ? 'bg-[#1447E6] text-white font-semibold' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  Kategoriyasiz
                </button>
                {filtered.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { onSelect(cat.id.toString()); setIsOpen(false); setSearch(''); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${selectedCategoryId?.toString() === cat.id.toString() ? 'bg-[#1447E6] text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductForm = ({ formData, setFormData, categories, onSubmit, submitLabel, isPending, onDeleteVariant }) => {
  const variantsEndRef = useRef(null);

  const addVariant = () => {
    setFormData(fd => ({ ...fd, variants: [...(fd.variants || []), { name: '', unit: 'dona', quantity: '', currency: 'uzs', cost_price: '', sale_price: '', is_active: true }] }));
    setTimeout(() => variantsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  };

  const updateVariant = (idx, field, value) => {
    setFormData(fd => ({ ...fd, variants: fd.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v) }));
  };

  const removeVariant = (idx) => {
    const v = formData.variants[idx];
    if (v.id && onDeleteVariant) {
      onDeleteVariant(v.id);
    } else {
      setFormData(fd => ({ ...fd, variants: fd.variants.filter((_, i) => i !== idx) }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Mahsulot nomi</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Mahsulot nomini kiriting" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kategoriya</label>
        <SearchableCategorySelect
          categories={categories}
          selectedCategoryId={formData.category}
          onSelect={(val) => setFormData({ ...formData, category: val })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tavsif (ixtiyoriy)</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={inputClass + ' resize-none'}
          rows={2}
          placeholder="Qo'shimcha ma'lumot..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500">Variantlar</label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs font-bold text-[#1447E6] bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-[#1447E6] hover:text-white transition-all"
          >
            <Plus className="w-3 h-3" /> Qo'shish
          </button>
        </div>

        {(formData.variants || []).length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl py-6 text-center">
            <p className="text-xs text-gray-400 font-medium">Hech qanday variant qo'shilmagan</p>
            <button type="button" onClick={addVariant} className="mt-2 text-xs font-bold text-[#1447E6] hover:underline">
              Birinchi variantni qo'shing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(formData.variants || []).map((variant, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 relative">
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="space-y-2.5 pr-8">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Variant nomi</label>
                      <input type="text" value={variant.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} className={smallInputClass} placeholder="masalan: Qizil" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Birlik</label>
                      <select value={variant.unit} onChange={(e) => updateVariant(idx, 'unit', e.target.value)} className={smallInputClass}>
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Miqdor</label>
                      <input type="number" value={variant.quantity} onChange={(e) => updateVariant(idx, 'quantity', e.target.value)} className={smallInputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Valyuta</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button type="button" onClick={() => updateVariant(idx, 'currency', 'uzs')} className={`py-2 rounded-xl text-[10px] font-bold transition-all ${variant.currency === 'uzs' ? 'bg-[#1447E6] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>so'm</button>
                        <button type="button" onClick={() => updateVariant(idx, 'currency', 'usd')} className={`py-2 rounded-xl text-[10px] font-bold transition-all ${variant.currency === 'usd' ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>USD</button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Tan narx</label>
                      <input type="number" value={variant.cost_price} onChange={(e) => updateVariant(idx, 'cost_price', e.target.value)} className={smallInputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Sotuv narxi</label>
                      <input type="number" value={variant.sale_price} onChange={(e) => updateVariant(idx, 'sale_price', e.target.value)} className={smallInputClass} placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={variantsEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSubmit} disabled={isPending || !formData.name} className="flex-1 px-4 py-3.5 bg-[#1447E6] text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {isPending && <Spinner className="animate-spin w-4 h-4" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

const statusConfig = {
  good: { label: 'Yaxshi', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  low: { label: 'Kam', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  critical: { label: 'Tanqis', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

const Warehouse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showCatDeleteConfirm, setShowCatDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showCategoryStats, setShowCategoryStats] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    is_active: true,
    variants: [],
  });

  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantProductId, setVariantProductId] = useState(null);
  const [variantFormData, setVariantFormData] = useState({ name: '', unit: 'dona', quantity: '', currency: 'uzs', cost_price: '', sale_price: '' });

  useEffect(() => { setPage(1); }, [searchTerm]);

  const { data: productsData, isLoading: productsLoading } = useProducts({ search: searchTerm, page, ordering: 'quantity' });
  const { data: allPagesData } = useProducts({ ordering: 'quantity', page: 1 });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: lowStockData } = useLowStockProducts();
  const { data: singleProduct, isLoading: productLoading } = useProduct(selectedProduct?.id);

  useEffect(() => {
    if (singleProduct && showEditModal) {
      setFormData({
        name: singleProduct.name || '',
        category: singleProduct.category?.toString() || '',
        description: singleProduct.description || '',
        is_active: singleProduct.is_active ?? true,
        variants: (singleProduct.variants || []).map(v => ({
          id: v.id,
          name: v.name || '',
          unit: v.unit || 'dona',
          quantity: v.quantity?.toString() || '',
          currency: v.currency || 'uzs',
          cost_price: v.cost_price || '',
          sale_price: v.sale_price || '',
          is_active: v.is_active ?? true,
        })),
      });
    }
  }, [singleProduct, showEditModal]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const createVariantMutation = useCreateVariant();
  const updateVariantMutation = useUpdateVariant();
  const deleteVariantMutation = useDeleteVariant();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const products = productsData?.results || [];
  const categories = categoriesData?.results || [];
  const totalProductPages = productsData?.count ? Math.ceil(productsData.count / 20) : 1;

  const totalProductCount = productsData?.count ?? products.length;
  const lowStockRaw = lowStockData?.results || lowStockData || [];
  const lowStockCount = Array.isArray(lowStockRaw) ? lowStockRaw.length : 0;

  // Haqiqiy mahsulotlardan hisoblash (backend totallari noto'g'ri bo'lishi mumkin)
  const allRealProducts = allPagesData?.results || [];
  const realAgg = {};
  allRealProducts.forEach((p) => {
    const cid = p.category;
    if (!cid) return;
    if (!realAgg[cid]) realAgg[cid] = { saleUzs: 0, saleUsd: 0, costUzs: 0, costUsd: 0 };
    const qty = parseInt(p.quantity) || 0;
    const isUsd = (p.currency || 'uzs').toLowerCase() === 'usd';
    realAgg[cid][isUsd ? 'saleUsd' : 'saleUzs'] += parseFloat(p.sale_price || 0) * qty;
    realAgg[cid][isUsd ? 'costUsd' : 'costUzs'] += parseFloat(p.cost_price || 0) * qty;
  });

  const categoryStats = categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.product_count ?? 0,
    quantity: parseInt(c.total_quantity) || 0,
    saleUzs: realAgg[c.id] ? realAgg[c.id].saleUzs : (parseFloat(c.total_sale_price_uzs) || 0),
    saleUsd: realAgg[c.id] ? realAgg[c.id].saleUsd : (parseFloat(c.total_sale_price_usd) || 0),
    costUzs: realAgg[c.id] ? realAgg[c.id].costUzs : (parseFloat(c.total_cost_price_uzs) || 0),
    costUsd: realAgg[c.id] ? realAgg[c.id].costUsd : (parseFloat(c.total_cost_price_usd) || 0),
    lowStock: 0,
  })).sort((a, b) => a.quantity - b.quantity);

  const categoryTotals = categoryStats.reduce((acc, c) => {
    acc.qty += c.quantity;
    acc.saleUzs += c.saleUzs; acc.saleUsd += c.saleUsd;
    acc.costUzs += c.costUzs; acc.costUsd += c.costUsd;
    return acc;
  }, { qty: 0, saleUzs: 0, saleUsd: 0, costUzs: 0, costUsd: 0 });

  // Drill-down: tanlangan kategoriyaning mahsulotlari
  const { data: catProductsData, isLoading: catProductsLoading } = useProducts(
    selectedCategory ? { category: selectedCategory.id, ordering: 'quantity' } : {}
  );

  // Haqiqiy mahsulotlar ma'lumotidan hisoblash (backend totallari noto'g'ri bo'lishi mumkin)
  const catProducts = catProductsData?.results || [];
  const catSaleUzs = catProducts.reduce((s, p) => (p.currency || 'uzs').toLowerCase() === 'uzs' ? s + parseFloat(p.sale_price || 0) * (parseInt(p.quantity) || 0) : s, 0);
  const catSaleUsd = catProducts.reduce((s, p) => (p.currency || 'uzs').toLowerCase() === 'usd' ? s + parseFloat(p.sale_price || 0) * (parseInt(p.quantity) || 0) : s, 0);
  // cost_price list endpointida bo'lmasligi mumkin — backend kategoriya totallari to'g'ri
  const computedCostUzs = catProducts.reduce((s, p) => (p.currency || 'uzs').toLowerCase() === 'uzs' ? s + parseFloat(p.cost_price || 0) * (parseInt(p.quantity) || 0) : s, 0);
  const computedCostUsd = catProducts.reduce((s, p) => (p.currency || 'uzs').toLowerCase() === 'usd' ? s + parseFloat(p.cost_price || 0) * (parseInt(p.quantity) || 0) : s, 0);
  const catCostUzs = computedCostUzs > 0 ? computedCostUzs : (selectedCategory?.costUzs || 0);
  const catCostUsd = computedCostUsd > 0 ? computedCostUsd : (selectedCategory?.costUsd || 0);

  const getStatusCfg = (status) => statusConfig[status] || statusConfig.good;

  const buildProductPayload = () => ({
    name: formData.name,
    category: formData.category ? parseInt(formData.category) : null,
    description: formData.description || '',
    is_active: formData.is_active ?? true,
  });

  const buildVariantPayload = (v) => ({
    name: v.name,
    unit: v.unit || 'dona',
    quantity: parseInt(v.quantity) || 0,
    currency: v.currency || 'uzs',
    cost_price: v.cost_price || '0',
    sale_price: v.sale_price || '0',
    is_active: v.is_active ?? true,
  });

  const handleAddProduct = async () => {
    try {
      const product = await createProductMutation.mutateAsync(buildProductPayload());
      for (const v of (formData.variants || [])) {
        if (v.name) {
          await createVariantMutation.mutateAsync({ productId: product.id, data: buildVariantPayload(v) });
        }
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {}
  };

  const handleEditProduct = async () => {
    try {
      await updateProductMutation.mutateAsync({ id: selectedProduct.id, data: buildProductPayload() });
      for (const v of (formData.variants || [])) {
        if (!v.name) continue;
        if (v.id) {
          await updateVariantMutation.mutateAsync({ id: v.id, data: buildVariantPayload(v) });
        } else {
          await createVariantMutation.mutateAsync({ productId: selectedProduct.id, data: buildVariantPayload(v) });
        }
      }
      setShowEditModal(false);
      resetForm();
    } catch (error) {}
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProductMutation.mutateAsync(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {}
  };

  const handleDeleteVariantFromForm = async (variantId) => {
    try {
      await deleteVariantMutation.mutateAsync(variantId);
      setFormData(fd => ({ ...fd, variants: fd.variants.filter(v => v.id !== variantId) }));
    } catch (error) {}
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category?.toString() || '',
      description: product.description || '',
      is_active: product.is_active ?? true,
      variants: [],
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', is_active: true, variants: [] });
    setSelectedProduct(null);
  };

  const openAddVariantModal = (productId) => {
    setVariantProductId(productId);
    setVariantFormData({ name: '', unit: 'dona', quantity: '', currency: 'uzs', cost_price: '', sale_price: '' });
    setShowAddVariantModal(true);
  };

  const openEditVariantModal = (variant) => {
    setSelectedVariant(variant);
    setVariantFormData({
      name: variant.name || '',
      unit: variant.unit || 'dona',
      quantity: variant.quantity?.toString() || '',
      currency: variant.currency || 'uzs',
      cost_price: variant.cost_price || '',
      sale_price: variant.sale_price || '',
    });
    setShowEditVariantModal(true);
  };

  const openDeleteVariantModal = (variant) => {
    setSelectedVariant(variant);
    setShowDeleteVariantModal(true);
  };

  const handleAddVariantDirect = async () => {
    try {
      await createVariantMutation.mutateAsync({ productId: variantProductId, data: { ...variantFormData, quantity: parseInt(variantFormData.quantity) || 0, is_active: true } });
      setShowAddVariantModal(false);
    } catch (error) {}
  };

  const handleEditVariantDirect = async () => {
    try {
      await updateVariantMutation.mutateAsync({ id: selectedVariant.id, data: { ...variantFormData, quantity: parseInt(variantFormData.quantity) || 0 } });
      setShowEditVariantModal(false);
    } catch (error) {}
  };

  const handleDeleteVariantDirect = async () => {
    try {
      await deleteVariantMutation.mutateAsync(selectedVariant.id);
      setShowDeleteVariantModal(false);
      setSelectedVariant(null);
    } catch (error) {}
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        await createCategoryMutation.mutateAsync({ name: newCategory });
        setNewCategory('');
      } catch (error) {}
    }
  };

  const handleDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setShowCatDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setShowCatDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {}
  };

  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setEditValue(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (editValue && editValue !== editingCategory.name) {
      try {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, data: { name: editValue } });
        setEditingCategory(null);
      } catch (error) {}
    } else {
      setEditingCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 md:pb-8">
      {/* White header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-5 md:px-8 py-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ombor</h1>
              <p className="text-xs text-gray-400 mt-0.5">Mahsulotlar va zaxiralar</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-3 py-5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Kategoriyalar
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-5 bg-[#1447E6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Qo'shish
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Jami mahsulotlar</p>
              <p className="text-xl font-black text-blue-700">{totalProductCount}</p>
            </div>
            <div className={`rounded-2xl p-3 border ${lowStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${lowStockCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>Kam qolgan</p>
              <p className={`text-xl font-black ${lowStockCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{lowStockCount}</p>
            </div>
          </div>

          {/* Category stats button */}
          <button
            onClick={() => setShowCategoryStats(true)}
            className="w-full mb-4 flex items-center gap-3 bg-gradient-to-r from-[#1447E6] to-[#0F3CC7] text-white rounded-2xl px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
          >
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <Stack className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold leading-tight">Kategoriyalar bo'yicha</p>
              <p className="text-[11px] text-blue-200">{categoryStats.length} ta kategoriya • {categoryTotals.qty.toLocaleString()} dona qoldiq</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-200 shrink-0" />
          </button>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm border border-gray-100 focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 md:px-8 py-4 max-w-6xl mx-auto">
        {productsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-8 h-8 text-[#1447E6] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Mahsulot topilmadi</h3>
            <p className="text-gray-400 text-sm text-center max-w-[220px]">
              {searchTerm ? `"${searchTerm}" bo'yicha topilmadi` : 'Hali mahsulot qo\'shilmagan'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-5 px-6 py-3 bg-[#1447E6] text-white rounded-2xl font-bold flex items-center gap-2 shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" /> Mahsulot qo'shish
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {products.map((product) => {
              const sc = getStatusCfg(product.status);
              const variants = product.variants || [];
              const isExpanded = expandedProductId === product.id;
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3.5 flex items-start gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${sc.dot}`} />
                    <h3 className="text-sm font-bold text-gray-900 flex-1 leading-snug">{product.name}</h3>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openAddVariantModal(product.id)}
                        title="Variant qo'shish"
                        className="w-8 h-8 bg-blue-50 text-[#1447E6] rounded-xl flex items-center justify-center hover:bg-[#1447E6] hover:text-white transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-8 h-8 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center hover:bg-[#1447E6] hover:text-white transition-all"
                      >
                        <PencilSimple className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges + variant toggle */}
                  <div className="px-4 pb-3 flex items-center gap-2 pl-9">
                    {product.category_name && (
                      <span className="text-[9px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-lg">{product.category_name}</span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    {variants.length > 0 && (
                      <button
                        onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                        className="ml-auto flex items-center gap-1 text-[10px] font-bold text-[#1447E6] bg-blue-50 px-2 py-1 rounded-lg hover:bg-[#1447E6] hover:text-white transition-all"
                      >
                        {variants.length} variant
                        <CaretRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                    {variants.length === 0 && (
                      <div className="ml-auto text-center bg-gray-50 rounded-xl px-2.5 py-1">
                        <p className="text-sm font-black text-gray-900 leading-tight">{product.quantity ?? 0}</p>
                        <p className="text-[9px] text-gray-400">{product.unit || 'dona'}</p>
                      </div>
                    )}
                  </div>

                  {/* Expanded variants */}
                  <AnimatePresence>
                    {isExpanded && variants.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-100"
                      >
                        <div className="divide-y divide-gray-50">
                          {variants.map(v => {
                            const isUsd = (v.currency || 'uzs').toLowerCase() === 'usd';
                            return (
                              <div key={v.id} className="px-4 py-2.5 flex items-center gap-2 pl-9">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 truncate">{v.name || '—'}</p>
                                  <p className={`text-xs font-bold ${isUsd ? 'text-emerald-600' : 'text-[#1447E6]'}`}>
                                    {isUsd ? `$${parseFloat(v.sale_price || 0).toLocaleString()}` : `${parseFloat(v.sale_price || 0).toLocaleString()} so'm`}
                                  </p>
                                </div>
                                <div className="text-center bg-gray-50 rounded-xl px-2 py-1 shrink-0">
                                  <p className="text-xs font-black text-gray-900">{v.quantity}</p>
                                  <p className="text-[9px] text-gray-400">{v.unit || 'dona'}</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => openEditVariantModal(v)} className="w-7 h-7 bg-blue-50 text-[#1447E6] rounded-lg flex items-center justify-center hover:bg-[#1447E6] hover:text-white transition-all">
                                    <PencilSimple className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => openDeleteVariantModal(v)} className="w-7 h-7 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <Trash className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalProductPages > 1 && (
          <div className="flex items-center justify-between mt-4 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1 || productsLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-[#1447E6] hover:text-white transition-all disabled:opacity-30"
            >
              <CaretLeft className="w-4 h-4" /> Oldingi
            </button>
            <span className="text-sm font-bold text-gray-600">
              {page} / {totalProductPages}
              <span className="font-normal text-gray-400 ml-1.5">({productsData?.count} ta mahsulot)</span>
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalProductPages || productsLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-[#1447E6] hover:text-white transition-all disabled:opacity-30"
            >
              Keyingi <CaretRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Mahsulot qo'shish</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ProductForm formData={formData} setFormData={setFormData} categories={categories} onSubmit={handleAddProduct} submitLabel="Saqlash" isPending={createProductMutation.isPending || createVariantMutation.isPending} />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end" onClick={() => { setShowEditModal(false); resetForm(); }}>
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Mahsulotni tahrirlash</h2>
              <button onClick={() => { setShowEditModal(false); resetForm(); }} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            {productLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                <Spinner className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">Ma'lumotlar yuklanmoqda...</p>
              </div>
            ) : (
              <ProductForm formData={formData} setFormData={setFormData} categories={categories} onSubmit={handleEditProduct} submitLabel="Yangilash" isPending={updateProductMutation.isPending || createVariantMutation.isPending || updateVariantMutation.isPending} onDeleteVariant={handleDeleteVariantFromForm} />
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Mahsulotni o'chirish</h3>
              <p className="text-sm text-gray-500">"{selectedProduct?.name}" mahsulotini o'chirmoqchimisiz?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                Bekor
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleteProductMutation.isPending}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-600"
              >
                {deleteProductMutation.isPending && <Spinner className="animate-spin w-4 h-4" />}
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Stats Modal */}
      {showCategoryStats && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end md:items-center md:justify-center" onClick={() => { setShowCategoryStats(false); setSelectedCategory(null); }}>
          <div className="bg-[#f8fafc] rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[88vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="bg-gradient-to-br from-[#1447E6] to-[#0F3CC7] px-5 pt-6 pb-5 shrink-0 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedCategory ? (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center text-white hover:bg-white/25 transition-colors shrink-0"
                    >
                      <CaretLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                      <Stack className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-white text-lg font-bold leading-tight truncate">
                      {selectedCategory ? selectedCategory.name : "Kategoriyalar bo'yicha"}
                    </h2>
                    <p className="text-blue-200 text-xs truncate">
                      {selectedCategory
                        ? `${selectedCategory.count} ta mahsulot • ${selectedCategory.quantity.toLocaleString()} dona`
                        : `${categoryStats.length} ta kategoriya • ${categoryTotals.qty.toLocaleString()} dona`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowCategoryStats(false); setSelectedCategory(null); }}
                  className="w-9 h-9 bg-white/15 text-white rounded-xl flex items-center justify-center hover:bg-white/25 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            {selectedCategory ? (
              /* ── Drill-down: tanlangan kategoriya mahsulotlari ── */
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Category value summary */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#1447E6] uppercase tracking-wider mb-1.5">Sotuv summasi</p>
                      {catSaleUsd > 0 && <p className="text-sm font-black text-emerald-600">${catSaleUsd.toLocaleString()}</p>}
                      {catSaleUzs > 0 && <p className="text-sm font-black text-[#1447E6]">{catSaleUzs.toLocaleString()} so'm</p>}
                      {!catSaleUzs && !catSaleUsd && <p className="text-sm font-black text-gray-300">—</p>}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1.5">Tan narx summasi</p>
                      {catCostUsd > 0 && <p className="text-sm font-black text-orange-500">${catCostUsd.toLocaleString()}</p>}
                      {catCostUzs > 0 && <p className="text-sm font-black text-orange-600">{catCostUzs.toLocaleString()} so'm</p>}
                      {!catCostUzs && !catCostUsd && <p className="text-sm font-black text-gray-300">—</p>}
                    </div>
                  </div>
                </div>

                {/* Products in category */}
                {catProductsLoading ? (
                  <div className="py-10 flex justify-center"><Spinner className="w-7 h-7 text-[#1447E6] animate-spin" /></div>
                ) : (catProductsData?.results || []).length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Mahsulot topilmadi</p>
                  </div>
                ) : (catProductsData?.results || []).map((p) => {
                  const sc = getStatusCfg(p.status);
                  const isUsd = (p.currency || 'uzs').toLowerCase() === 'usd';
                  const salePrice = parseFloat(p.sale_price || 0);
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setShowCategoryStats(false); setSelectedCategory(null); openEditModal(p); }}
                      className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center gap-3 text-left hover:border-[#1447E6] active:scale-[0.99] transition-all"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${sc.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                        <p className={`text-xs font-bold ${isUsd ? 'text-emerald-600' : 'text-[#1447E6]'}`}>
                          {isUsd ? `$${salePrice.toLocaleString()}` : `${salePrice.toLocaleString()} so'm`}
                        </p>
                      </div>
                      <div className="text-center shrink-0 bg-gray-50 rounded-xl px-2.5 py-1">
                        <p className="text-sm font-black text-gray-900 leading-tight">{p.quantity}</p>
                        <p className="text-[9px] text-gray-400">{p.unit || 'dona'}</p>
                      </div>
                      <PencilSimple className="w-4 h-4 text-gray-300 shrink-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* ── Kategoriyalar ro'yxati + umumiy summa ── */
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {/* Grand total */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Jami ombor summasi</p>
                  <div className="space-y-2">
                    {/* Sotuv row */}
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sotuv</p>
                      <div className="flex items-center gap-3">
                        {categoryTotals.saleUsd > 0 && <p className="text-base font-black text-emerald-600">${categoryTotals.saleUsd.toLocaleString()}</p>}
                        {categoryTotals.saleUzs > 0 && <p className="text-sm font-bold text-[#1447E6]">{categoryTotals.saleUzs.toLocaleString()} so'm</p>}
                        {!categoryTotals.saleUzs && !categoryTotals.saleUsd && <p className="text-base font-black text-gray-300">—</p>}
                      </div>
                    </div>
                    {/* Tan narx row */}
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tan narx</p>
                      <div className="flex items-center gap-3">
                        {categoryTotals.costUsd > 0 && <p className="text-base font-black text-orange-500">${categoryTotals.costUsd.toLocaleString()}</p>}
                        {categoryTotals.costUzs > 0 && <p className="text-sm font-bold text-orange-600">{categoryTotals.costUzs.toLocaleString()} so'm</p>}
                        {!categoryTotals.costUzs && !categoryTotals.costUsd && <p className="text-base font-black text-gray-300">—</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {categoryStats.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Stack className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Kategoriya topilmadi</p>
                  </div>
                ) : categoryStats.map((cat) => {
                  const isEmpty = cat.quantity <= 0;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 text-left hover:border-[#1447E6] active:scale-[0.99] transition-all"
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${cat.lowStock > 0 || isEmpty ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#1447E6]'}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{cat.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-lg">{cat.count} ta</span>
                          {cat.saleUsd > 0 && <span className="text-[10px] font-bold text-emerald-600">${cat.saleUsd.toLocaleString()}</span>}
                          {cat.saleUzs > 0 && <span className="text-[10px] font-bold text-[#1447E6]">{cat.saleUzs.toLocaleString()} so'm</span>}
                          {cat.lowStock > 0 && (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                              <WarningCircle className="w-2.5 h-2.5" /> {cat.lowStock}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-1.5">
                        <div>
                          <p className={`text-lg font-black leading-tight ${isEmpty ? 'text-red-500' : 'text-gray-900'}`}>{cat.quantity.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">dona</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[70] flex items-center justify-center px-4" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}>
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Kategoriyalar</h2>
                <p className="text-xs text-gray-400 mt-0.5">Mahsulot turlarini boshqarish</p>
              </div>
              <button
                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Yangi kategoriya nomi..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]"
              />
              <button
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending}
                className="px-4 py-2.5 bg-[#1447E6] text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {createCategoryMutation.isPending ? <Spinner className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {categoriesLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner className="animate-spin text-gray-400" />
                </div>
              ) : categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                  {editingCategory?.id === cat.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateCategory}
                        disabled={updateCategoryMutation.isPending}
                        className="w-7 h-7 bg-[#1447E6] text-white rounded-lg flex items-center justify-center"
                      >
                        {updateCategoryMutation.isPending ? <Spinner className="animate-spin w-3 h-3" /> : <Check className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-700">
                        {cat.name} <span className="text-[10px] text-gray-400">({cat.product_count})</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleStartEdit(cat)} className="w-7 h-7 text-gray-400 hover:text-[#1447E6] hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center">
                          <PencilSimple className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteCategory(cat)} className="w-7 h-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center">
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Variant Modal */}
      {showAddVariantModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end md:items-center md:justify-center" onClick={() => setShowAddVariantModal(false)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Variant qo'shish</h3>
              <button onClick={() => setShowAddVariantModal(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Variant nomi</label>
                <input type="text" value={variantFormData.name} onChange={(e) => setVariantFormData(fd => ({ ...fd, name: e.target.value }))} className={inputClass} placeholder="masalan: Qizil, XL" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Birlik</label>
                  <select value={variantFormData.unit} onChange={(e) => setVariantFormData(fd => ({ ...fd, unit: e.target.value }))} className={inputClass}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Miqdor</label>
                  <input type="number" value={variantFormData.quantity} onChange={(e) => setVariantFormData(fd => ({ ...fd, quantity: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Valyuta</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setVariantFormData(fd => ({ ...fd, currency: 'uzs' }))} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${variantFormData.currency === 'uzs' ? 'bg-[#1447E6] text-white' : 'bg-gray-100 text-gray-500'}`}>so'm</button>
                  <button type="button" onClick={() => setVariantFormData(fd => ({ ...fd, currency: 'usd' }))} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${variantFormData.currency === 'usd' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>USD</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tan narx</label>
                  <input type="number" value={variantFormData.cost_price} onChange={(e) => setVariantFormData(fd => ({ ...fd, cost_price: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sotuv narxi</label>
                  <input type="number" value={variantFormData.sale_price} onChange={(e) => setVariantFormData(fd => ({ ...fd, sale_price: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
              </div>
              <button onClick={handleAddVariantDirect} disabled={createVariantMutation.isPending || !variantFormData.name} className="w-full py-3.5 bg-[#1447E6] text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 mt-2">
                {createVariantMutation.isPending && <Spinner className="animate-spin w-4 h-4" />}
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Variant Modal */}
      {showEditVariantModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end md:items-center md:justify-center" onClick={() => setShowEditVariantModal(false)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Variantni tahrirlash</h3>
              <button onClick={() => setShowEditVariantModal(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Variant nomi</label>
                <input type="text" value={variantFormData.name} onChange={(e) => setVariantFormData(fd => ({ ...fd, name: e.target.value }))} className={inputClass} placeholder="masalan: Qizil, XL" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Birlik</label>
                  <select value={variantFormData.unit} onChange={(e) => setVariantFormData(fd => ({ ...fd, unit: e.target.value }))} className={inputClass}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Miqdor</label>
                  <input type="number" value={variantFormData.quantity} onChange={(e) => setVariantFormData(fd => ({ ...fd, quantity: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Valyuta</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setVariantFormData(fd => ({ ...fd, currency: 'uzs' }))} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${variantFormData.currency === 'uzs' ? 'bg-[#1447E6] text-white' : 'bg-gray-100 text-gray-500'}`}>so'm</button>
                  <button type="button" onClick={() => setVariantFormData(fd => ({ ...fd, currency: 'usd' }))} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${variantFormData.currency === 'usd' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>USD</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tan narx</label>
                  <input type="number" value={variantFormData.cost_price} onChange={(e) => setVariantFormData(fd => ({ ...fd, cost_price: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sotuv narxi</label>
                  <input type="number" value={variantFormData.sale_price} onChange={(e) => setVariantFormData(fd => ({ ...fd, sale_price: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
              </div>
              <button onClick={handleEditVariantDirect} disabled={updateVariantMutation.isPending || !variantFormData.name} className="w-full py-3.5 bg-[#1447E6] text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 mt-2">
                {updateVariantMutation.isPending && <Spinner className="animate-spin w-4 h-4" />}
                Yangilash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Variant Confirm */}
      {showDeleteVariantModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center px-4" onClick={() => setShowDeleteVariantModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Variantni o'chirish</h3>
              <p className="text-sm text-gray-500">"{selectedVariant?.name}" variantini o'chirmoqchimisiz?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteVariantModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Bekor</button>
              <button onClick={handleDeleteVariantDirect} disabled={deleteVariantMutation.isPending} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-600">
                {deleteVariantMutation.isPending && <Spinner className="animate-spin w-4 h-4" />}
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Confirm */}
      {showCatDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center px-4" onClick={() => setShowCatDeleteConfirm(false)}>
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <WarningCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kategoriyani o'chirish?</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                <span className="font-bold text-gray-700">"{categoryToDelete?.name}"</span> kategoriyasini o'chirmoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCatDeleteConfirm(false)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm"
                >
                  Yo'q
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  disabled={deleteCategoryMutation.isPending}
                  className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600"
                >
                  {deleteCategoryMutation.isPending && <Spinner className="animate-spin w-4 h-4" />}
                  Ha, o'chirish
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
