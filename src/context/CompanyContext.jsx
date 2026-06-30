import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import companyService from '../services/company.service';
import { useAuth } from './AuthContext';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize company ID from user data
  useEffect(() => {
    if (user?.company_id) {
      setCurrentCompanyId(user.company_id);
    }
  }, [user]);

  // Fetch available companies (for super admin)
  const fetchAvailableCompanies = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await companyService.getCompanies({ page_size: 100 });
      setAvailableCompanies(data.results || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Switch to a different company
  const switchCompany = useCallback((companyId) => {
    setCurrentCompanyId(companyId);
    // Optionally store in localStorage for persistence
    localStorage.setItem('selected_company_id', companyId);
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('selected_company_id');
    if (stored) {
      setCurrentCompanyId(parseInt(stored));
    }
  }, []);

  // Get current company details
  const getCurrentCompany = useCallback(async () => {
    if (!currentCompanyId) return null;
    try {
      return await companyService.getCompany(currentCompanyId);
    } catch (error) {
      console.error('Failed to fetch current company:', error);
      return null;
    }
  }, [currentCompanyId]);

  const value = {
    currentCompanyId,
    setCurrentCompanyId,
    availableCompanies,
    setAvailableCompanies,
    isLoading,
    switchCompany,
    fetchAvailableCompanies,
    getCurrentCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
  return ctx;
};

export default CompanyContext;