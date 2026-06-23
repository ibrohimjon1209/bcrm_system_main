import { useQuery } from '@tanstack/react-query';
import auditService from '../services/audit.service';

export const useAuditLogs = (params) =>
  useQuery({ queryKey: ['audit', params], queryFn: () => auditService.getLogs(params), staleTime: 0 });

export const useAuditStats = () =>
  useQuery({ queryKey: ['audit-stats'], queryFn: auditService.getStats, staleTime: 60000 });
