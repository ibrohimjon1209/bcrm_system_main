export const fmtUZS = (val) => {
  const n = parseFloat(val || 0);
  if (isNaN(n)) return '0 so\'m';
  return n.toLocaleString('uz-UZ') + ' so\'m';
};

export const fmtUSD = (val) => {
  const n = parseFloat(val || 0);
  if (isNaN(n)) return '$0';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtMoney = (val, currency = 'uzs') => {
  const n = parseFloat(val || 0);
  if (isNaN(n)) return currency === 'usd' ? '$0' : '0 so\'m';
  if (currency === 'usd') return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toLocaleString('uz-UZ') + ' so\'m';
};

export const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('uz-UZ');
};

export const fmtDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('uz-UZ');
};

export const fmtNum = (val) => {
  const n = parseFloat(val || 0);
  if (isNaN(n)) return '0';
  return n.toLocaleString('uz-UZ');
};

export const daysLeft = (expiresAt) => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const PAYMENT_LABELS = {
  cash: 'Naqd',
  card: 'Karta',
  debt: 'Nasiya',
  transfer: "O'tkazma",
};

export const STATUS_LABELS = {
  active: 'Faol',
  vip: 'VIP',
  debtor: 'Qarzdor',
  inactive: 'Nofaol',
};

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  owner: 'Egasi',
  admin: 'Admin',
};

export const SUB_STATUS_LABELS = {
  trial: 'Sinov',
  active: 'Faol',
  expired: 'Muddati tugagan',
  blocked: 'Bloklangan',
};
