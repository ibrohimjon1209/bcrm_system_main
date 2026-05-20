import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseService from '../services/purchase.service';
import { toast } from 'react-toastify';

export const usePurchases = (params) => {
  return useQuery({
    queryKey: ['purchases', params],
    queryFn: () => purchaseService.getPurchases(params),
    staleTime: 0,
  });
};

export const usePurchaseDetail = (id) => {
  return useQuery({
    queryKey: ['purchase-detail', id],
    queryFn: () => purchaseService.getPurchase(id),
    enabled: !!id && typeof id === 'number',
    staleTime: 0,
  });
};

const getErrMsg = (err) => {
  const d = err?.response?.data;
  if (!d) return 'Xatolik yuz berdi';
  if (typeof d === 'string') return d;
  if (d.detail) return d.detail;
  const first = Object.values(d)[0];
  return Array.isArray(first) ? first[0] : (first || 'Xatolik yuz berdi');
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => purchaseService.createPurchase(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['purchases'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      toast.success('Xarid muvaffaqiyatli saqlandi');
    },
    onError: (err) => toast.error(getErrMsg(err)),
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => purchaseService.updatePurchase(id, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['purchases'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      toast.success('Xarid muvaffaqiyatli yangilandi');
    },
    onError: (err) => toast.error(getErrMsg(err)),
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => purchaseService.deletePurchase(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['purchases'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      toast.success("Xarid muvaffaqiyatli o'chirildi");
    },
    onError: (err) => toast.error(getErrMsg(err)),
  });
};

