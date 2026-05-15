import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/product.service';
import { toast } from 'react-toastify';

export const useProducts = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success('Mahsulot muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Mahsulot muvaffaqiyatli o\'chirildi');
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
      toast.success('Kategoriya muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategoriya muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategoriya muvaffaqiyatli o\'chirildi');
    },
  });
};
