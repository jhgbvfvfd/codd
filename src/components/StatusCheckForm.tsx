import React, { useState, useEffect } from 'react';
import { checkStatusByApiKey, checkStatusByPhone, checkTotalBots } from '../services/api';
import { isValidThaiPhone, isValidApiKey, formatThaiDate, formatRemainingTime } from '../utils/validators';
import Swal from 'sweetalert2';

interface StatusData {
  success: boolean;
  message: string;
  phone?: string;
  totalAmount?: number;
  expiresAt?: string;
  remainingTime?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

const StatusCheckForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [checkType, setCheckType] = useState<'phone' | 'apiKey'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [error, setError] = useState('');
  const [showBotStatus, setShowBotStatus] = useState(false);
  const [totalBots, setTotalBots] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchTotalBots = async () => {
      const response = await checkTotalBots();
      if (response.success) {
        setTotalBots(response.totalBots);
      }
    };
    fetchTotalBots();
  }, []);

  const validateInput = (): boolean => {
    setError('');

    if (checkType === 'phone' && !isValidThaiPhone(input)) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบ 0[6-9]xxxxxxxx');
      return false;
    }

    if (checkType === 'apiKey' && !isValidApiKey(input)) {
      setError('กรุณากรอก API key');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    setStatusData(null);

    try {
      let response;
      
      if (checkType === 'apiKey') {
        response = await checkStatusByApiKey(input);
      } else {
        response = await checkStatusByPhone(input);
      }

      if (response.success) {
        setStatusData(response);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ไม่พบข้อมูล',
          text: response.message || 'กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง',
          confirmButtonColor: '#E21C23',
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองอีกครั้งในภายหลัง',
        confirmButtonColor: '#E21C23',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="card-container mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">เช็คสถานะการดักซอง</h2>
          <div className="flex gap-1">
            <button
              type="button"
              className={`relative w-7 h-7 flex items-center justify-center rounded transition-all duration-200 ${
                checkType === 'phone' 
                  ? 'bg-tmoney-red text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setCheckType('phone');
                setShowBotStatus(false);
              }}
              title="เช็คด้วยเบอร์โทร"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            
            <button
              type="button"
              className={`relative w-7 h-7 flex items-center justify-center rounded transition-all duration-200 ${
                checkType === 'apiKey' 
                  ? 'bg-tmoney-red text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setCheckType('apiKey');
                setShowBotStatus(false);
              }}
              title="เช็คด้วย API Key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>
            
            <button
              type="button"
              className="relative w-7 h-7 flex items-center justify-center rounded bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-sm"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await checkTotalBots();
                  if (response.success) {
                    setShowBotStatus(true);
                    setTotalBots(response.totalBots);
                    setLastUpdated(new Date().toLocaleTimeString());
                    setIsOnline(true);
                  } else {
                    setShowBotStatus(true);
                    setIsOnline(false);
                    Swal.fire({
                      icon: 'error',
                      title: 'เกิดข้อผิดพลาด',
                      text: response.message,
                      confirmButtonColor: '#E21C23',
                    });
                  }
                } catch (error) {
                  console.error('Error checking bots:', error);
                  setShowBotStatus(true);
                  setIsOnline(false);
                  Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                    confirmButtonColor: '#E21C23',
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              title="ตรวจสอบจำนวนบอททั้งหมด"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {totalBots !== null && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{totalBots}</span>
              )}
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                id="statusInput"
                type={checkType === 'phone' ? 'tel' : 'text'}
                className="form-input pl-10"
                placeholder={checkType === 'phone' ? 'เช่น 0812345678' : 'กรอก API key ของคุณ'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {checkType === 'phone' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )}
              </div>
            </div>
            {error && <p className="form-error mt-1">{error}</p>}
          </div>

          <button type="submit" className={`btn-primary flex items-center justify-center gap-2 ${isLoading ? 'opacity-70' : ''}`} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>กำลังตรวจสอบ...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>ค้นหา</span>
              </>
            )}
          </button>
        </form>
      </div>

      {showBotStatus && (
        <div className="angpao-card animate-fade-in mb-4">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <div className="w-full h-full border-4 border-green-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-4 border-green-500 rounded-full"></div>
          </div>
          
          <h3 className="text-lg font-bold mb-3 text-green-400">สถานะบอททั้งหมด</h3>
          
          <div className="mb-2 flex items-center">
            <span className="text-white/70 w-32">จำนวนบอท:</span>
            <span className="font-semibold text-green-400">{totalBots} บอท</span>
          </div>
          
          <div className="mb-2 flex items-center">
            <span className="text-white/70 w-32">อัพเดทล่าสุด:</span>
            <span className="font-semibold text-gray-300">{lastUpdated}</span>
          </div>
          
          <div className="mt-4 text-right">
            <span className={`status-badge ${isOnline ? 'bg-green-700' : 'bg-red-700'} text-white`}>
              {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
            </span>
          </div>
        </div>
      )}

      {statusData && statusData.success && (
        <div className="angpao-card animate-fade-in">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <div className="w-full h-full border-4 border-tmoney-gold rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-4 border-tmoney-gold rounded-full"></div>
          </div>
          
          <h3 className="text-lg font-bold mb-3 gold-accent">ข้อมูลการดักซอง</h3>
          
          <div className="mb-2 flex items-center">
            <span className="text-white/70 w-32">เบอร์โทรศัพท์:</span>
            <span className="font-semibold">{statusData.phone}</span>
          </div>
          
          <div className="mb-2 flex items-center">
            <span className="text-white/70 w-32">ยอดเงินที่ดักได้:</span>
            <span className="font-semibold gold-accent">{statusData.totalAmount} บาท</span>
          </div>
          
          <div className="mb-2 flex items-center">
            <span className="text-white/70 w-32">วันหมดอายุ:</span>
            <span className="font-semibold">
              {statusData.expiresAt ? formatThaiDate(statusData.expiresAt) : '-'}
            </span>
          </div>
          
          <div className="mb-1 flex items-center">
            <span className="text-white/70 w-32">เวลาคงเหลือ:</span>
            <span className="font-semibold">
              {statusData.remainingTime ? formatRemainingTime(statusData.remainingTime) : '-'}
            </span>
          </div>
          
          <div className="mt-4 text-right">
            <span className="status-badge bg-green-700 text-white">
              ใช้งานได้
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheckForm;
