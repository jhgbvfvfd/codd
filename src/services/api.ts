import axios from 'axios';

const API_BASE_URL = 'https://apibottelegram.cyber-safe.cloud/';
const DELETE_LIMIT_API_URL = 'https://apibottelegram.cyber-safe.cloud/';

interface StatusResponse {
  success: boolean;
  message: string;
  phone?: string;
  botPhone?: string;
  totalAmount?: number;
  apiKeyExpiresAt?: string;
  botSessionExpiresAt?: string;
  remainingTime?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

interface TotalBotsResponse {
  success: boolean;
  message: string;
  onlineBotCount: number;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

const healthCheckApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // ลด timeout เหลือ 5 วินาที
});

const handleApiError = (error: any, functionName: string) => {
  console.error(`Error in ${functionName}:`, error);
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`[${functionName}] Server Error:`, error.response.status, error.response.data);
      return {
        success: false,
        message: error.response.data?.message || `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.response.status}`,
        errorData: error.response.data,
      };
    } else if (error.request) {
      console.error(`[${functionName}] Network Error: No response received. Is server at ${API_BASE_URL} running?`, error.request);
      return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ ตรวจสอบ URL และการเชื่อมต่อ' };
    }
    console.error(`[${functionName}] Request Setup Error:`, error.message);
    return { success: false, message: `เกิดข้อผิดพลาดการตั้งค่าคำขอ: ${error.message}` };
  }
  console.error(`[${functionName}] Unknown Error:`, error);
  return { success: false, message: `เกิดข้อผิดพลาดไม่ทราบสาเหตุใน ${functionName}: ${error.message}` };
};

export const generateApiKey = async (count = 1) => {
  try {
    const response = await api.get(`/generate-key?count=${count}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'generateApiKey');
  }
};

export const submitPhone = async (phone: string, apiKey: string) => {
  // Validate inputs
  if (!phone || phone.trim() === '') {
    return { success: false, message: 'เบอร์โทรศัพท์ไม่ถูกต้อง' };
  }
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'API Key ไม่ถูกต้อง' };
  }

  try {
    console.log('[submitPhone] Submitting phone with provided API key:', {
      phone: phone,
      apiKey: apiKey.substring(0, 5) + '...'
    });

    const response = await api.post('/submit-phone', { 
      phone: phone.trim(),
      apiKey: apiKey.trim()
    });

    return {
      success: true,
      message: 'บันทึกข้อมูลสำเร็จ',
      ...response.data as Record<string, any>
    };
  } catch (error: any) {
    // If it's a fetch error from key validation
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[submitPhone] Key validation error:', error);
      return {
        success: false,
        message: 'ไม่สามารถตรวจสอบ API Key กรุณาลองใหม่อีกครั้ง'
      };
    }
    
    // If it's an API error
    if (error.response?.data) {
      console.log('[submitPhone] Server error details:', error.response.data);
      return {
        success: false,
        message: error.response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
      };
    }

    return handleApiError(error, 'submitPhone');
  }
};

export const initiateBotLogin = async (telegramFormattedPhone: string, apiKey: string) => {
  console.log('[Debug] Inside initiateBotLoginWithApiKey. Received apiKey:', `'${apiKey}'`);
  if (!apiKey || apiKey.trim() === '') {
    const errorMsg = '[API Client - initiateLoginBot] API Key is required to initiate bot login and cannot be empty.';
    console.error(errorMsg, 'Actual apiKey value received was falsy or empty string.');
    return { success: false, message: errorMsg };
  }
  try {
    const payload = { phone: telegramFormattedPhone, apiKey };
    const response = await api.post('/bot-login', payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'initiateBotLoginWithApiKey');
  }
};

export const verifyBotOtp = async (telegramFormattedPhone: string, code: string, apiKey: string) => {
  console.log('[Debug] Inside verifyBotOtpWithApiKey. Received apiKey:', `'${apiKey}'`);
  if (!apiKey || apiKey.trim() === '') {
    const errorMsg = '[API Client - verifyBotOtp] API Key is required to verify OTP and cannot be empty.';
    console.error(errorMsg, 'Actual apiKey value received was falsy or empty string.');
    return { success: false, message: errorMsg };
  }
  try {
    const payload = { phone: telegramFormattedPhone, code, apiKey };
    const response = await api.post('/bot-login', payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'verifyBotOtpWithApiKey');
  }
};

export const checkStatusByPhone = async (phone: string): Promise<StatusResponse> => {
  try {
    const response = await api.get(`/status-by-phone/${phone}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'checkStatusByPhone');
  }
};

export const checkStatusByApiKey = async (apiKey: string): Promise<StatusResponse> => {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'Cannot check status: API Key is missing or empty.' };
  }
  try {
    const response = await api.get(`/status/${apiKey}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'checkStatusByApiKey');
  }
};

export const removeBotSession = async (apiKey: string) => {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'Cannot remove session: API Key is missing or empty.' };
  }
  try {
    const response = await api.delete(`/remove-bot/${apiKey}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'removeBotSession');
  }
};

export const checkApiHealth = async () => {
  try {
    console.log('Checking API health at:', API_BASE_URL);
    const startTime = Date.now();
    const response = await healthCheckApi.get('/online-bots');
    const endTime = Date.now();
    console.log('API responded in:', endTime - startTime, 'ms');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // ถ้าได้รับ response ถือว่า API online
    if (response.status === 200 && response.data) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('API Health Check failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return false;
  }
};

export const checkTotalBots = async (): Promise<TotalBotsResponse> => {
  try {
    console.log('Fetching total bots from:', `${API_BASE_URL}online-bots`);
    const response = await api.get('/online-bots');
    console.log('API Response:', response.data);
    const data = response.data as { onlineBotCount?: number };
    
    return {
      success: true,
      message: "✅ ดึงจำนวนบอทที่ออนไลน์อยู่เรียบร้อย",
      onlineBotCount: data.onlineBotCount || 0
    };
  } catch (error: any) {
    // Check if it's a network error (API offline)
    if (error.code === 'ECONNABORTED' || (error.request && !error.response)) {
      return {
        success: false,
        message: '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (API Offline)',
        onlineBotCount: 0
      };
    }
    console.error('Error checking total bots:', error);
    return {
      success: false,
      message: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      onlineBotCount: 0
    };
  }
};

export const deleteLimit = async (key: string, amount: number) => {
  if (!key || key.trim() === '') {
    return { success: false, message: 'Cannot delete limit: Key is missing or empty.' };
  }
  try {
    // Create a new axios instance for this specific endpoint
    const response = await fetch(`https://api.cyber-safe.cloud/api/deletelimit/${key.trim()}/${amount}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[deleteLimit] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
