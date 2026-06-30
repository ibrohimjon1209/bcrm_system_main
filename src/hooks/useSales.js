import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import saleService from '../services/sale.service';
import { showToast } from '../utils/toast';
import { useCompany } from './useCompany';

const invalidateDashboard = (qc) =>
  qc.invalidateQueries({ queryKey: ['reports', 'dashboard'] });

export const useSales = (params) => {
  const { currentCompanyId } = useCompany();
  const companyId = params?.companyId || currentCompanyId;
  const queryParams = companyId ? { ...params, companyId } : params;
  return useQuery({
    queryKey: ['sales', queryParams],
    queryFn: () => saleService.getSales(queryParams),
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
      showToast('success', 'Sotuv muvaffaqiyatli amalga oshirildi');
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
      showToast('success', 'Sotuv yangilandi');
    },
  });
};

export const useOverdueSales = (companyId) => {
  const { currentCompanyId } = useCompany();
  const cid = companyId || currentCompanyId;
  return useQuery({
    queryKey: ['sales', 'overdue', cid],
    queryFn: () => saleService.getOverdueSales(cid),
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => saleService.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      invalidateDashboard(queryClient);
      showToast('success', 'Sotuv muvaffaqiyatli o\'chirildi');
    },
  });
};
