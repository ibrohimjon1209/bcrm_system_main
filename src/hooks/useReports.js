import { useQuery } from '@tanstack/react-query';
import reportService from '../services/report.service';

export const useDashboardStats = (period) => {
  return useQuery({
    queryKey: ['reports', 'dashboard', period],
    queryFn: () => reportService.getDashboardStats(period),
    retry: (failureCount, error) => {
      // Don't retry on 5xx server errors
      if (error?.response?.status >= 500) return false;
      return failureCount < 1;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useProfitReport = (date_from, date_to) => {
  return useQuery({
    queryKey: ['reports', 'profit', date_from, date_to],
    queryFn: () => reportService.getProfitReport(date_from, date_to),
    enabled: !!date_from && !!date_to,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 500) return false;
      return failureCount < 1;
    },
  });
};

export const useWarehouseReport = () => {
  return useQuery({
    queryKey: ['reports', 'warehouse'],
    queryFn: () => reportService.getWarehouseReport(),
    retry: (failureCount, error) => {
      if (error?.response?.status >= 500) return false;
      return failureCount < 1;
    },
  });
};
