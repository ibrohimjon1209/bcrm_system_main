import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import saleService from '../services/sale.service';
import { toast } from 'react-toastify';

const invalidateDashboard = (qc) =>
  qc.invalidateQueries({ queryKey: ['reports', 'dashboard'] });

export const useSales = (params) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => saleService.getSales(params),
  });
};

export const useSale = (id) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: () => saleService.getSale(id),
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => saleService.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      invalidateDashboard(queryClient);
      toast.success('Sotuv muvaffaqiyatli amalga oshirildi');
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => saleService.updateSale(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale', id] });
      invalidateDashboard(queryClient);
      toast.success('Sotuv yangilandi');
    },
  });
};

export const useOverdueSales = () => {
  return useQuery({
    queryKey: ['sales', 'overdue'],
    queryFn: () => saleService.getOverdueSales(),
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => saleService.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      invalidateDashboard(queryClient);
      toast.success('Sotuv muvaffaqiyatli o\'chirildi');
    },
  });
};
