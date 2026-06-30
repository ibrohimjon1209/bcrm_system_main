import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../utils/toast';
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); showToast('success', 'Kompaniya yaratildi'); },
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => companyService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      qc.invalidateQueries({ queryKey: ['company', id] });
      showToast('success', 'Kompaniya yangilandi');
    },
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); showToast('success', "O'chirildi"); },
  });
};

export const useToggleCompanyActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.toggleActive,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); showToast('success', 'Holat yangilandi'); },
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-company'] }); showToast('success', 'Kompaniya yangilandi'); },
  });
};

export const useMySettings = () =>
  useQuery({ queryKey: ['my-settings'], queryFn: companyService.getMySettings, staleTime: 60000 });

export const useUpdateMySettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: companyService.updateMySettings,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-settings'] }); showToast('success', 'Sozlamalar saqlandi'); },
  });
};

// Super admin: update any company's settings
export const useUpdateCompanySettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => companyService.updateCompanySettings(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['company', id] });
      qc.invalidateQueries({ queryKey: ['company-settings', id] });
      showToast('success', 'Sozlamalar saqlandi');
    },
  });
};

// Company-scoped data hooks (for super admin viewing specific company)
export const useCompanyProducts = (companyId, params) =>
  useQuery({ queryKey: ['company-products', companyId, params], queryFn: () => companyService.getCompanyProducts(companyId, params), enabled: !!companyId });

export const useCompanyCategories = (companyId, params) =>
  useQuery({ queryKey: ['company-categories', companyId, params], queryFn: () => companyService.getCompanyCategories(companyId, params), enabled: !!companyId });

export const useCompanyCustomers = (companyId, params) =>
  useQuery({ queryKey: ['company-customers', companyId, params], queryFn: () => companyService.getCompanyCustomers(companyId, params), enabled: !!companyId });

export const useCompanySales = (companyId, params) =>
  useQuery({ queryKey: ['company-sales', companyId, params], queryFn: () => companyService.getCompanySales(companyId, params), enabled: !!companyId });

export const useCompanyPurchases = (companyId, params) =>
  useQuery({ queryKey: ['company-purchases', companyId, params], queryFn: () => companyService.getCompanyPurchases(companyId, params), enabled: !!companyId });

export const useCompanyUsers = (companyId, params) =>
  useQuery({ queryKey: ['company-users', companyId, params], queryFn: () => companyService.getCompanyUsers(companyId, params), enabled: !!companyId });

export const useCompanyNotifications = (companyId, params) =>
  useQuery({ queryKey: ['company-notifications', companyId, params], queryFn: () => companyService.getCompanyNotifications(companyId, params), enabled: !!companyId });

export const useCompanyTickets = (companyId, params) =>
  useQuery({ queryKey: ['company-tickets', companyId, params], queryFn: () => companyService.getCompanyTickets(companyId, params), enabled: !!companyId });
