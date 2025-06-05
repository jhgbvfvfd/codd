import React, { useState } from 'react';
import { initiateBotLogin, verifyBotOtp } from '../services/api';
import { isValidThaiPhone } from '../utils/validators';
import { Smartphone, Key, ChevronRight, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

const BotLoginForm: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone format
    if (!isValidThaiPhone(phone) && !phone.startsWith('+')) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบ 0[6-9]xxxxxxxx หรือ +66xxxxxxxxx');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Format phone number if needed (ensure +66 format)
      const formattedPhone = phone.startsWith('+') ? phone : `+66${phone.slice(1)}`;
      
      console.log('[Debug] Calling initiateBotLogin with:', { formattedPhone, apiKey });
      const response = await initiateBotLogin(formattedPhone, apiKey);
      
      if (response.success) {
        setAwaitingOtp(true);
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
      const formattedPhone = phone.startsWith('+') ? phone : `+66${phone.slice(1)}`;
      
      console.log('[Debug] Calling verifyBotOtp with:', { formattedPhone, code, apiKey });
      const response = await verifyBotOtp(formattedPhone, code, apiKey);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'ล็อกอินบอทสำเร็จ!',
          text: response.message || 'บอทเริ่มทำงานแล้ว',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#ffffff',
        });
        
        // Reset form after successful verification
        setPhone('');
        setCode('');
        setAwaitingOtp(false);
      } else {
        setError(response.message || 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Format phone number if needed (ensure +66 format)
      const formattedPhone = phone.startsWith('+') ? phone : `+66${phone.slice(1)}`;
      
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

  const handleBackToPhone = () => {
    setAwaitingOtp(false);
    setCode('');
    setError('');
  };

  return (
    <div className="glass-card animate-fade-in">
      <h2 className="text-xl font-bold mb-6 gradient-text">
        {awaitingOtp ? 'ยืนยันรหัส OTP' : 'ล็อกอินบอท'}
      </h2>
      
      {!awaitingOtp ? (
        // Phone input form
        <form onSubmit={handlePhoneSubmit} className="space-y-5">
          <div className="mb-4 relative">
            <label htmlFor="botPhone" className="form-label">
              เบอร์โทรศัพท์
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <Smartphone size={18} />
              </div>
              <input
                id="botPhone"
                type="tel"
                className="form-input pl-10"
                placeholder="เช่น +66987456321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            
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
              <>
                <ChevronRight size={18} className="mr-2" />
                ส่งรหัส OTP
              </>
            )}
          </button>
        </form>
      ) : (
        // OTP verification form
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
            {error && <p className="form-error">{error}</p>}
            
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <button 
                type="button" 
                className="text-blue-500 hover:text-blue-400"
                onClick={handleBackToPhone}
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
              <>
                <Key size={18} className="mr-2" />
                ยืนยันรหัส OTP
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default BotLoginForm;
