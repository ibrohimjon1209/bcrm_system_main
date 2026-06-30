import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../utils/toast';
import subscriptionService from '../services/subscription.service';

export const useSubscriptions = (params) =>
  useQuery({ queryKey: ['subscriptions', params], queryFn: () => subscriptionService.getAll(params), staleTime: 0 });

export const useMySubscription = () =>
  useQuery({ queryKey: ['my-subscription'], queryFn: subscriptionService.getMine, staleTime: 60000 });

export const useTariffs = () =>
  useQuery({ queryKey: ['tariffs'], queryFn: subscriptionService.getTariffs, staleTime: 300000 });

export const useCreateSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); showToast('success', 'Obuna yaratildi'); },
  });
};

export const useUpdateSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => subscriptionService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); showToast('success', 'Obuna yangilandi'); },
  });
};

export const useBlockSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.block,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); showToast('success', 'Obuna bloklandi'); },
  });
};

export const useExtendSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => subscriptionService.extend(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); showToast('success', 'Obuna uzaytirildi'); },
  });
};
