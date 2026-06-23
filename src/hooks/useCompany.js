import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import companyService from '../services/company.service';

// Super Admin
export const useCompanies = (params) =>
  useQuery({ queryKey: ['companies', params], queryFn: () => companyService.getCompanies(params), staleTime: 0 });

export const useCompany = (id) =>
  useQuery({ queryKey: ['company', id], queryFn: () => companyService.getCompany(id), enabled: !!id });

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); toast.success('Kompaniya yaratildi'); },
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => companyService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      qc.invalidateQueries({ queryKey: ['company', id] });
      toast.success('Kompaniya yangilandi');
    },
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); toast.success("O'chirildi"); },
  });
};

export const useToggleCompanyActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.toggleActive,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); toast.success('Holat yangilandi'); },
  });
};

export const useLoginAs = () =>
  useMutation({ mutationFn: companyService.loginAs });

export const useCompanyStats = (id) =>
  useQuery({ queryKey: ['company-stats', id], queryFn: () => companyService.getCompanyStats(id), enabled: !!id });

// Own company
export const useMyCompany = () =>
  useQuery({ queryKey: ['my-company'], queryFn: companyService.getMyCompany, staleTime: 60000 });

export const useUpdateMyCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.updateMyCompany,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-company'] }); toast.success('Kompaniya yangilandi'); },
  });
};

export const useMySettings = () =>
  useQuery({ queryKey: ['my-settings'], queryFn: companyService.getMySettings, staleTime: 60000 });

export const useUpdateMySettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.updateMySettings,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-settings'] }); toast.success('Sozlamalar saqlandi'); },
  });
};
