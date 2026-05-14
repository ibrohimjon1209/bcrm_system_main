import { useQuery } from '@tanstack/react-query';
import reportService from '../services/report.service';

export const useDashboardStats = (period) => {
  return useQuery({
    queryKey: ['reports', 'dashboard', period],
    queryFn: () => reportService.getDashboardStats(period),
  });
};

export const useProfitReport = (date_from, date_to) => {
  return useQuery({
    queryKey: ['reports', 'profit', date_from, date_to],
    queryFn: () => reportService.getProfitReport(date_from, date_to),
    enabled: !!date_from && !!date_to,
  });
};

export const useWarehouseReport = () => {
  return useQuery({
    queryKey: ['reports', 'warehouse'],
    queryFn: () => reportService.getWarehouseReport(),
  });
};
