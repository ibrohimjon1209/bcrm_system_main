import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/product.service';
import { showToast } from '../utils/toast';
import { useCompany } from './useCompany';

export const useProducts = (params) => {
  const { currentCompanyId } = useCompany();
  const companyId = params?.companyId || currentCompanyId;
  const queryParams = companyId ? { ...params, companyId } : params;
  return useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productService.getProducts(queryParams),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['products'] });
      showToast('success', 'Mahsulot muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['product', data.id] });
      showToast('success', 'Mahsulot muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['products'] });
      showToast('success', 'Mahsulot muvaffaqiyatli o\'chirildi');
    },
  });
};

export const useCategories = (params) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => productService.getCategories(params),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('success', 'Kategoriya muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('success', 'Kategoriya muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('success', 'Kategoriya muvaffaqiyatli o\'chirildi');
    },
  });
};

export const useLowStockProducts = (companyId) => {
  const { currentCompanyId } = useCompany();
  const cid = companyId || currentCompanyId;
  return useQuery({
    queryKey: ['products', 'low_stock', cid],
    queryFn: () => productService.getLowStockProducts(cid),
  });
};

export const useProductsForSale = (params) => {
  const { currentCompanyId } = useCompany();
  const companyId = params?.companyId || currentCompanyId;
  const queryParams = companyId ? { ...params, companyId } : params;
  return useQuery({
    queryKey: ['products', 'for_sale', queryParams],
    queryFn: () => productService.getProductsForSale(queryParams),
  });
};

export const useVariants = (params) => {
  return useQuery({
    queryKey: ['variants', params],
    queryFn: () => productService.getVariants(params),
  });
};

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }) => productService.addVariantToProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      showToast('success', 'Variant muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateVariant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      showToast('success', 'Variant muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      showToast('success', 'Variant muvaffaqiyatli o\'chirildi');
    },
  });
};
