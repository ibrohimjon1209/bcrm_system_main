/**
 * Formats a phone number string to +998 99 999 99 99 format
 * @param {string} value 
 * @returns {string}
 */
export const formatPhoneNumber = (value) => {
  // Remove all non-digit characters except +
  let cleaned = value.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +998
  if (!cleaned.startsWith('+998')) {
    if (cleaned.startsWith('998')) {
      cleaned = '+' + cleaned;
    } else {
      // If it's just digits, prepend +998
      cleaned = '+998' + cleaned.replace(/^\+?/, '');
    }
  }

  // Limit to 13 characters (+998 + 9 digits)
  cleaned = cleaned.substring(0, 13);

  // Apply spacing: +998 99 999 99 99
  let result = '+998';
  const digits = cleaned.substring(4);
  
  if (digits.length > 0) {
    result += ' ' + digits.substring(0, 2);
  }
  if (digits.length > 2) {
    result += ' ' + digits.substring(2, 5);
  }
  if (digits.length > 5) {
    result += ' ' + digits.substring(5, 7);
  }
  if (digits.length > 7) {
    result += ' ' + digits.substring(7, 9);
  }

  return result;
};

/**
 * Cleans a phone number for API (removes spaces)
 * @param {string} value 
 * @returns {string}
 */
export const cleanPhoneNumber = (value) => {
  return value.replace(/\s/g, '');
};
