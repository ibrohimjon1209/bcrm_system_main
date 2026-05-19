import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService from '../services/customer.service';
import { toast } from 'react-toastify';

export const useCustomers = (params) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Mijoz muvaffaqiyatli qo\'shildi');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.updateCustomer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
      toast.success('Mijoz muvaffaqiyatli yangilandi');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Mijoz muvaffaqiyatli o\'chirildi');
    },
  });
};

export const useDebtors = () => {
  return useQuery({
    queryKey: ['customers', 'debtors'],
    queryFn: () => customerService.getDebtors(),
  });
};

export const useVipCustomers = () => {
  return useQuery({
    queryKey: ['customers', 'vip'],
    queryFn: () => customerService.getVipCustomers(),
  });
};

export const usePayDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.payDebt(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
      toast.success("Qarz to'lovi muvaffaqiyatli amalga oshirildi");
    },
  });
};

export const useSendDebtReminder = () => {
  return useMutation({
    mutationFn: (id) => customerService.sendDebtReminder(id),
    onSuccess: () => {
      toast.success('Eslatma muvaffaqiyatli yuborildi');
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success("Telegram bog'liqlik bekor qilindi");
    },
  });
};
