import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import saleService from '../services/sale.service';
import { toast } from 'react-toastify';

export const useSales = (params) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => saleService.getSales(params),
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => saleService.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock changes
      queryClient.invalidateQueries({ queryKey: ['customers'] }); // Debt changes
      toast.success('Sotuv muvaffaqiyatli amalga oshirildi');
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => saleService.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Sotuv muvaffaqiyatli o\'chirildi');
    },
  });
};
