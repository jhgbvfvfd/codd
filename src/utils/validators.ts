// Validate Thai phone number format (start with 06, 08, or 09, total 10 digits)
export const isValidThaiPhone = (phone: string): boolean => {
  const pattern = /^0[6-9]\d{8}$/;
  return pattern.test(phone);
};

// Validate API key is not empty
export const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.trim().length > 0;
};

// Format date to Thai format with Buddhist Era
export const formatThaiDate = (input: string | Date): string => {
  const date = input instanceof Date ? input : new Date(input);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const thaiDate = date.toLocaleString('th-TH', options);
  const adYear = date.getFullYear();
  const beYear = adYear + 543;
  
  // Replace AD year with BE year and format according to the specified pattern
  const formattedDate = thaiDate.replace(adYear.toString(), beYear.toString());
  
  // Restructure the date to match the desired format: d/m/yyyy hh:mm:ss
  const [datePart, timePart] = formattedDate.split(' ');
  const [day, month, year] = datePart.split('/');
  
  return `${day}/${month}/${year} ${timePart}`;
};

// Format remaining time
export const formatRemainingTime = (remainingTime: { days: number; hours: number; minutes: number }): string => {
  const { days, hours, minutes } = remainingTime;
  return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
};
