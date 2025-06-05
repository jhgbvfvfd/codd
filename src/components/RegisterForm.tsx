import React, { useState } from 'react';
import { submitPhone, initiateBotLogin, verifyBotOtp, generateApiKey } from '../services/api';
import { isValidThaiPhone } from '../utils/validators';
import Swal from 'sweetalert2';
import { Phone, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

const RegisterForm: React.FC = () => {
  // Form steps
  enum Step {
    RegisterPhone = 1,
    ApiKey = 2,
    BotPhone = 3,
    BotOTP = 4,
  }

  // States
  const [currentStep, setCurrentStep] = useState<Step>(Step.RegisterPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Bot login states
  const [botPhone, setBotPhone] = useState('');
  const [code, setCode] = useState('');
  
  // Registration form states
  const [phone, setPhone] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Step 1: Submit bot phone
  const handleBotPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone format
    if (!isValidThaiPhone(botPhone) && !botPhone.startsWith('+')) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบ 0[6-9]xxxxxxxx หรือ +66xxxxxxxxx');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Format phone number if needed (ensure +66 format)
      const formattedPhone = botPhone.startsWith('+') ? botPhone : `+66${botPhone.slice(1)}`;
      
      const response = await initiateBotLogin(formattedPhone, apiKey);
      
      if (response.success) {
        setCurrentStep(Step.BotOTP);
        Swal.fire({
          icon: 'success',
          title: 'ส่งรหัส OTP สำเร็จ!',
          text: 'กรุณาตรวจสอบ SMS และกรอกรหัส OTP ที่ได้รับ',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#ffffff',
        });
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองอีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 5) {
      setError('รหัส OTP ต้องมี 5 หลัก');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Format phone number if needed (ensure +66 format)
      const formattedPhone = botPhone.startsWith('+') ? botPhone : `+66${botPhone.slice(1)}`;
      
      console.log('[Debug] Calling verifyBotOtp with:', { formattedPhone, code, apiKey });
      const response = await verifyBotOtp(formattedPhone, code, apiKey);
      
      if (response.success) {
        setCurrentStep(Step.RegisterPhone);
        
        Swal.fire({
          icon: 'success',
          title: 'ล็อกอินบอทสำเร็จ!',
          text: 'กรุณาลงทะเบียนเบอร์รับซองและใส่ API Key',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#ffffff',
        });
      } else {
        setError(response.message || 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Register phone with API key
  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('กรุณากรอก API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Submit phone and API key
      const response = await submitPhone(phone, apiKey);
      
      if (response.success) {
        setCurrentStep(Step.BotPhone);
        Swal.fire({
          icon: 'success',
          title: 'บันทึก API Key สำเร็จ!',
          text: 'กรุณากรอกเบอร์โทรศัพท์บอทเพื่อดำเนินการต่อ',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#ffffff',
        });
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการบันทึก API Key กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Submit register phone
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidThaiPhone(phone)) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบ 0[6-9]xxxxxxxx');
      return;
    }

    setCurrentStep(Step.ApiKey);
    setError('');
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Format phone number if needed (ensure +66 format)
      const formattedPhone = botPhone.startsWith('+') ? botPhone : `+66${botPhone.slice(1)}`;
      
      const response = await initiateBotLogin(formattedPhone, apiKey);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'ส่งรหัส OTP ใหม่สำเร็จ!',
          text: 'กรุณาตรวจสอบ SMS และกรอกรหัส OTP ที่ได้รับ',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#ffffff',
        });
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองอีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back step
  const handleBackStep = () => {
    if (currentStep === Step.ApiKey) {
      setCurrentStep(Step.RegisterPhone);
      setApiKey('');
    } else if (currentStep === Step.BotPhone) {
      setCurrentStep(Step.ApiKey);
      setBotPhone('');
    } else if (currentStep === Step.BotOTP) {
      setCurrentStep(Step.BotPhone);
      setCode('');
    }
    setError('');
  };

  // Removed API key generation

  // Progress indicator
  const renderProgressIndicator = () => (
    <div className="flex justify-between mb-6">
      {[Step.RegisterPhone, Step.ApiKey, Step.BotPhone, Step.BotOTP].map((step) => (
        <div 
          key={step} 
          className="flex flex-col items-center"
          onClick={() => {
            if (step < currentStep) {
              setCurrentStep(step);
              setError('');
            }
          }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === step 
              ? 'bg-blue-500 text-white' 
              : currentStep > step 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-700 text-gray-400'
          }`}>
            {currentStep > step ? <CheckCircle size={16} /> : step}
          </div>
          <span className={`text-xs mt-1 ${
            currentStep === step 
              ? 'text-blue-400'
              : currentStep > step
              ? 'text-green-400'
              : 'text-gray-500'
          }`}>
            {step === Step.RegisterPhone ? 'เบอร์รับซอง' : step === Step.ApiKey ? 'API Key' : step === Step.BotPhone ? 'เบอร์บอท' : 'รหัส OTP'}
          </span>
        </div>
      ))}

      <div className="absolute left-[22%] top-11 w-[22%] h-0.5 bg-gray-700">
        <div className={`h-full bg-green-500 transition-all duration-300 ${
          currentStep > Step.RegisterPhone ? 'w-full' : 'w-0'
        }`}></div>
      </div>

      <div className="absolute left-[44%] right-[44%] top-11 w-[22%] h-0.5 bg-gray-700">
        <div className={`h-full bg-green-500 transition-all duration-300 ${
          currentStep > Step.ApiKey ? 'w-full' : 'w-0'
        }`}></div>
      </div>

      <div className="absolute right-[22%] top-11 w-[22%] h-0.5 bg-gray-700">
        <div className={`h-full bg-green-500 transition-all duration-300 ${
          currentStep > Step.BotPhone ? 'w-full' : 'w-0'
        }`}></div>
      </div>
    </div>
  );
  
  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case Step.ApiKey:
        return (
          <form onSubmit={handleApiKeySubmit} className="space-y-5">
            <div className="mb-4">
              <label htmlFor="apiKey" className="form-label">
                API Key
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <Key size={18} />
                </div>
                <input
                  id="apiKey"
                  type="text"
                  className="form-input pl-10"
                  placeholder="กรุณาใส่ API Key ที่ได้รับจากแอดมิน"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <button 
                  type="button" 
                  className="text-blue-500 hover:text-blue-400"
                  onClick={handleBackStep}
                >
                  แก้ไขเบอร์รับซอง
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึก API Key'
              )}
            </button>
          </form>
        );

      case Step.BotPhone:
        return (
          <form onSubmit={handleBotPhoneSubmit} className="space-y-5">
            <div className="mb-4">
              <label htmlFor="botPhone" className="form-label">
                เบอร์โทรศัพท์บอท
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <Phone size={18} />
                </div>
                <input
                  id="botPhone"
                  type="tel"
                  className="form-input pl-10"
                  placeholder="เช่น +66987456321"
                  value={botPhone}
                  onChange={(e) => setBotPhone(e.target.value)}
                />
              </div>
              
              <p className="text-xs text-gray-400 mt-2">
                * กรุณาใส่เบอร์โทรศัพท์ในรูปแบบ +66 เช่น +66987456321
              </p>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังส่ง OTP...
                </>
              ) : (
                'ส่งรหัส OTP'
              )}
            </button>
          </form>
        );
        
      case Step.BotOTP:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="mb-6">
              <label htmlFor="otp" className="form-label mb-3">
                รหัส OTP
              </label>
              <div className="relative flex justify-center">
                <InputOTP maxLength={5} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-3">
                <button 
                  type="button" 
                  className="text-blue-500 hover:text-blue-400"
                  onClick={handleBackStep}
                >
                  แก้ไขเบอร์โทรศัพท์
                </button>
                <button 
                  type="button" 
                  className="text-blue-500 hover:text-blue-400 flex items-center"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังส่ง...' : (
                    <>
                      <RefreshCw size={12} className="mr-1" />
                      ส่งรหัสใหม่
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังยืนยัน...
                </>
              ) : (
                'ยืนยันรหัส OTP'
              )}
            </button>
          </form>
        );
        
      case Step.RegisterPhone:
        return (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">
                เบอร์รับซองอั่งเปา
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <Phone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className="form-input pl-10"
                  placeholder="เช่น 0812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังลงทะเบียน...
                </>
              ) : (
                'ลงทะเบียน'
              )}
            </button>
          </form>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h2 className="text-xl font-bold mb-6 gradient-text">
        จัดการบริการ True Money Catcher
      </h2>
      
      <div className="relative">
        {renderProgressIndicator()}
      </div>
      
      {error && <p className="form-error mb-4">{error}</p>}
      
      {renderCurrentStep()}
    </div>
  );
};

export default RegisterForm;
