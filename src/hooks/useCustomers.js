import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService from '../services/customer.service';
import { showToast } from '../utils/toast';
import { useCompany } from './useCompany';

export const useCustomers = (params) => {
  const { currentCompanyId } = useCompany();
  const companyId = params?.companyId || currentCompanyId;
  const queryParams = companyId ? { ...params, companyId } : params;
  return useQuery({
    queryKey: ['customers', queryParams],
    queryFn: () => customerService.getCustomers(queryParams),
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
    staleTime: 0,
  });
};

// Fetches customer sales via GET /api/sales/?customer={id}
export const useCustomerSalesHistory = (id) => {
  return useQuery({
    queryKey: ['customers', id, 'sales-history'],
    queryFn: () => customerService.getCustomerSalesHistory(id),
    enabled: !!id,
  });
};

export const useCustomerBotLink = (id) => {
  return useQuery({
    queryKey: ['customers', id, 'bot-link'],
    queryFn: () => customerService.getBotLink(id),
    enabled: !!id,
  });
};

const getErrorMsg = (err) => {
  const d = err?.response?.data;
  if (!d) return 'Xatolik yuz berdi';
  if (typeof d === 'string') return d;
  if (d.detail) return d.detail;
  const first = Object.values(d)[0];
  return Array.isArray(first) ? first[0] : (first || 'Xatolik yuz berdi');
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['customers'] });
      showToast('success', 'Mijoz muvaffaqiyatli qo\'shildi');
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.updateCustomer(id, data),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['customers'] });
      queryClient.refetchQueries({ queryKey: ['customer', data.id] });
      showToast('success', 'Mijoz muvaffaqiyatli yangilandi');
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['customers'] });
      showToast('success', 'Mijoz muvaffaqiyatli o\'chirildi');
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};

export const useDebtors = (companyId) => {
  const { currentCompanyId } = useCompany();
  const cid = companyId || currentCompanyId;
  return useQuery({
    queryKey: ['customers', 'debtors', cid],
    queryFn: () => customerService.getDebtors(cid),
  });
};

export const useVipCustomers = (companyId) => {
  const { currentCompanyId } = useCompany();
  const cid = companyId || currentCompanyId;
  return useQuery({
    queryKey: ['customers', 'vip', cid],
    queryFn: () => customerService.getVipCustomers(cid),
  });
};

export const usePayDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.payDebt(id, data),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['customers'] });
      queryClient.refetchQueries({ queryKey: ['customer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'dashboard'] });
      showToast('success', "Qarz to'lovi muvaffaqiyatli amalga oshirildi");
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};

export const useSendDebtReminder = () => {
  return useMutation({
    mutationFn: (id) => customerService.sendDebtReminder(id),
    onSuccess: () => {
      showToast('success', 'Eslatma muvaffaqiyatli yuborildi');
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};

export const useGetBotLink = () => {
  return useMutation({
    mutationFn: (id) => customerService.getBotLink(id),
  });
};

export const useUnlinkTelegram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => customerService.unlinkTelegram(id),
    onSuccess: (_, id) => {
      queryClient.refetchQueries({ queryKey: ['customers'] });
      queryClient.refetchQueries({ queryKey: ['customer', id] });
      showToast('success', "Telegram bog'liqlik bekor qilindi");
    },
    onError: (err) => showToast('error', getErrorMsg(err)),
  });
};
