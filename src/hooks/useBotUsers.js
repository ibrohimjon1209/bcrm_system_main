import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import botUserService from '../services/botUser.service';
import { toast } from 'react-toastify';

export const useBotUsers = () => {
  return useQuery({
    queryKey: ['bot-users'],
    queryFn: () => botUserService.getBotUsers(),
  });
};

export const useCreateBotUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => botUserService.createBotUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-users'] });
      toast.success("Bot foydalanuvchi qo'shildi");
    },
  });
};

export const useDeleteBotUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId) => botUserService.deleteBotUser(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-users'] });
      toast.success("Bot foydalanuvchi o'chirildi");
    },
  });
};
