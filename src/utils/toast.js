import { toast } from 'react-toastify';

const toastCache = new Set();

export const showToast = (type, message, options = {}) => {
  const toastId = options.toastId || `${type}-${message}`;
  
  if (toastCache.has(toastId)) {
    return;
  }
  
  toastCache.add(toastId);
  
  const toastOptions = {
    ...options,
    toastId,
    onClose: () => {
      toastCache.delete(toastId);
      if (options.onClose) options.onClose();
    },
  };
  
  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export default showToast;