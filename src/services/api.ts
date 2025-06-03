import axios from 'axios';

const API_BASE_URL = 'https://7267948b-743f-4a51-bb4e-d5334845e279-00-3m2byn9ja8vm3.pike.replit.dev/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitPhone = async (phone: string, apiKey?: string) => {
  try {
    const response = await api.post('/submit-phone', { phone, apiKey });
    return response.data;
  } catch (error) {
    console.error('Error submitting phone:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        success: false,
        message: 'API endpoint ไม่พบ กรุณาตรวจสอบ URL ที่ถูกต้อง',
      };
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const generateApiKey = async () => {
  try {
    const response = await api.get('/generate-key');
    return response.data;
  } catch (error) {
    console.error('Error generating API key:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'API endpoint สำหรับการสร้าง API key ไม่พบ',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้าง API key กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const checkStatusByPhone = async (phone: string) => {
  try {
    const response = await api.get(`/status-by-phone/${phone}`);
    return response.data;
  } catch (error) {
    console.error('Error checking status by phone:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'ไม่พบเบอร์นี้ในระบบ กรุณาลงทะเบียนก่อนใช้งาน',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const checkStatusByApiKey = async (apiKey: string) => {
  try {
    const response = await api.get(`/status/${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error checking status by API key:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'ไม่พบ API key นี้ในระบบ กรุณาตรวจสอบหรือสร้าง key ใหม่',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const checkApiHealth = async () => {
  try {
    // ใช้ /total-bots endpoint เพื่อตรวจสอบสถานะ API
    const response = await api.get('/total-bots');
    return response.data.success !== false;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Bot Login API Endpoints
export const initiateLoginBot = async (phone: string) => {
  try {
    const response = await api.post('/bot-login', { phone });
    return response.data;
  } catch (error) {
    console.error('Error initializing bot login:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'API endpoint สำหรับล็อกอินบอทไม่พบ กรุณาตรวจสอบ URL',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเริ่มต้นล็อกอินบอท กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const verifyBotOtp = async (phone: string, code: string) => {
  try {
    const response = await api.post('/bot-login', { phone, code });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP for bot login:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'API endpoint สำหรับยืนยัน OTP ไม่พบ',
        };
      }
      if (error.response?.status === 400) {
        return {
          success: false,
          message: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการยืนยัน OTP กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export const checkTotalBots = async () => {
  try {
    const response = await api.get('/total-bots');
    return response.data;
  } catch (error) {
    console.error('Error checking total bots:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'API endpoint สำหรับตรวจสอบจำนวนบอทไม่พบ',
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        };
      }
    }
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบจำนวนบอท กรุณาลองใหม่อีกครั้ง',
    };
  }
};

export default api;
