import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import supportService from '../services/support.service';

export const useTickets = (params) =>
  useQuery({ queryKey: ['tickets', params], queryFn: () => supportService.getTickets(params), staleTime: 0 });

export const useTicket = (id) =>
  useQuery({ queryKey: ['ticket', id], queryFn: () => supportService.getTicket(id), enabled: !!id, staleTime: 0 });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: supportService.createTicket,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tickets'] }); toast.success('Murojaat yaratildi'); },
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => supportService.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket', id] });
      toast.success('Yangilandi');
    },
  });
};

export const useDeleteTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: supportService.deleteTicket,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tickets'] }); toast.success("O'chirildi"); },
  });
};

export const useAddMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => supportService.addMessage(id, body),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['ticket', id] }); },
  });
};
