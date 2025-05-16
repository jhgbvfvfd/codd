
// Validate Thai phone number format (start with 06, 08, or 09, total 10 digits)
export const isValidThaiPhone = (phone: string): boolean => {
  const pattern = /^0[6-9]\d{8}$/;
  return pattern.test(phone);
};

// Validate API key is not empty
export const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.trim().length > 0;
};

// Format date to Thai format
export const formatThaiDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  // Convert to Buddhist era (BE) - add 543 years
  const thaiDate = new Intl.DateTimeFormat('th-TH', options).format(date);
  
  // Replace AD year with BE year
  const adYear = date.getFullYear();
  const beYear = adYear + 543;
  
  return thaiDate.replace(adYear.toString(), beYear.toString());
};

// Format remaining time
export const formatRemainingTime = (remainingTime: { days: number; hours: number; minutes: number }): string => {
  const { days, hours, minutes } = remainingTime;
  return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
};
