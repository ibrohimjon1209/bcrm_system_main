import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import userService from '../services/user.service';

export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: userService.getUsers, staleTime: 0 });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Admin qo\'shildi'); },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Yangilandi'); },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success("O'chirildi"); },
  });
};
