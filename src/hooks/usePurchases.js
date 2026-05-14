import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseService from '../services/purchase.service';
import { toast } from 'react-toastify';

export const usePurchases = (params) => {
  return useQuery({
    queryKey: ['purchases', params],
    queryFn: () => purchaseService.getPurchases(params),
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => purchaseService.createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock increases
      toast.success('Xarid muvaffaqiyatli saqlandi');
    },
  });
};

export const useSuppliers = (params) => {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => purchaseService.getSuppliers(params),
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => purchaseService.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Yetkazib beruvchi muvaffaqiyatli qo\'shildi');
    },
  });
};
