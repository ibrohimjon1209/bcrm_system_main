import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../utils/toast';
import notificationService from '../services/notification.service';

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: notificationService.getNotifications, staleTime: 30000 });

export const useUnreadCount = () =>
  useQuery({ queryKey: ['notifications-unread'], queryFn: notificationService.getUnreadCount, staleTime: 30000, refetchInterval: 60000 });

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
      showToast('success', 'Barchasi o\'qildi deb belgilandi');
    },
  });
};
