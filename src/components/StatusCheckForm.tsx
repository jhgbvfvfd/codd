import React, { useState, useEffect } from 'react';
import { checkStatusByApiKey, checkStatusByPhone, checkTotalBots } from '../services/api';
import { isValidThaiPhone, isValidApiKey, formatThaiDate, formatRemainingTime } from '../utils/validators';
import { CheckCircle, XCircle, ClipboardCheck, ClipboardCopy, Bot, Activity, Phone, Key } from 'lucide-react';
import Swal from 'sweetalert2';

interface StatusData {
  success: boolean;
  message: string;
  phone?: string;
  apiKey?: string;
  totalAmount?: number;
  expiresAt?: string;
  botExpiresAt?: string;
  apiKeyExpiresAt?: string;
  botPhone?: string;
  remainingTime?: {
    days: number;
    hours: number;
    minutes: number;
  };
  botSessionStatus?: {
    active: boolean;
    telegramPhone?: string;
    sessionExpiresAt?: string;
  } | string;
}

const StatusBadge = ({ isOnline }: { isOnline: boolean }) => (
  <div className="flex items-center space-x-2 bg-gray-700/50 py-1 px-3 rounded-full transition-all duration-300 hover:bg-gray-700/70">
    <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
      isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
    }`} />
    <span className="text-sm text-gray-400">{isOnline ? 'ออนไลน์' : 'ออฟไลน์'}</span>
  </div>
);

// เพิ่ม TimeUnit component สำหรับแสดงหน่วยเวลาแต่ละส่วน
const TimeUnit = ({ value, label, color = "text-yellow-400" }: { value: number; label: string; color?: string }) => (
  <div className="flex flex-col items-center bg-gray-700/30 rounded-lg p-1.5 min-w-[60px]">
    <span className={`text-lg font-bold font-mono ${color} tabular-nums leading-none`}>
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
  </div>
);

const InfoItem = ({ label, value, isMono = false, color = 'text-gray-200', canCopy = false }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="flex justify-between items-center py-2 px-3 border-b border-gray-600/50 last:border-b-0 hover:bg-gray-600/20 transition-all duration-200 rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-gray-400 flex items-center gap-2 ${isHovered ? 'text-gray-200' : ''}`}>
        {label}
      </span>
      <div className="flex items-center">
        <span 
          className={`${color} ${isMono ? 'font-mono' : ''} text-right break-all max-w-[150px] sm:max-w-xs truncate transition-all duration-200 ${isHovered ? 'scale-105' : ''}`}
          title={value}
        >
          {value}
        </span>
        {canCopy && value && (
          <button 
            onClick={() => copyToClipboard(value)} 
            className={`ml-2 p-1.5 rounded-full transition-all duration-200 ${
              isCopied ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-white hover:bg-gray-500/20'
            }`}
          >
            {isCopied ? <ClipboardCheck size={16} /> : <ClipboardCopy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const StatusCheckForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [error, setError] = useState('');
  const [totalBots, setTotalBots] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isOnline, setIsOnline] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTotalBots = async () => {
      try {
        const response = await checkTotalBots();
        if (response.success) {
          setTotalBots(response.onlineBotCount);
          setIsOnline(true);
          setLastUpdated(new Date().toLocaleString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }));
        } else {
          setIsOnline(false);
          console.error('Failed to get total bots:', response.message);
        }
      } catch (error) {
        console.error('Error fetching total bots:', error);
        setIsOnline(false);
      }
    };

    // เรียกครั้งแรกทันที
    fetchTotalBots();

    // รีเฟรชทุก 10 วินาที
    const interval = setInterval(fetchTotalBots, 10000);

    return () => clearInterval(interval);
  }, []);

  const validateInput = (): boolean => {
    setError('');

    if (!isValidThaiPhone(input)) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบ 0[6-9]xxxxxxxx');
      return false;
    }

    return true;
  };

  // Function to calculate and update countdown
  const updateCountdown = (expiryDate: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const diff = expiry - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // แทนที่จะ set string ธรรมดา เราจะ set object ที่มีค่าแต่ละส่วน
      setCountdown(JSON.stringify({ days, hours, minutes, seconds, isExpired: false }));
    } else {
      setCountdown(JSON.stringify({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }));
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Start countdown when expiry date changes
  useEffect(() => {
    if (statusData?.botSessionStatus && 
        typeof statusData.botSessionStatus === 'object' && 
        statusData.botSessionStatus.sessionExpiresAt) {
      
      // Clear existing interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      // Initial update
      updateCountdown(statusData.botSessionStatus.sessionExpiresAt);
      
      // Set new interval
      const interval = setInterval(() => {
        if (statusData.botSessionStatus && 
            typeof statusData.botSessionStatus === 'object' && 
            statusData.botSessionStatus.sessionExpiresAt) {
          updateCountdown(statusData.botSessionStatus.sessionExpiresAt);
        }
      }, 1000);
      
      setTimerInterval(interval);

      // Cleanup
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [statusData?.botSessionStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    setStatusData(null);

    try {
      const response = await checkStatusByPhone(input);

      console.log('API Response:', JSON.stringify(response, null, 2));
      if (response.success) {
        console.log('API Response:', response);
        if ('phone' in response) {
          console.log('Phone:', response.phone);
        }
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
    <div className="animate-fade-in space-y-6">
      {/* สถานะบอท */}
      <div className="card-container backdrop-blur-sm bg-gray-800/40 transition-all duration-300 hover:bg-gray-800/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/30">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              สถานะบอท
            </h2>
          </div>
          <StatusBadge isOnline={isOnline} />
        </div>

        <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/20">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">จำนวนบอททั้งหมด</span>
            </div>
            <span className="text-lg font-bold text-purple-400 tabular-nums">
              {totalBots !== null ? totalBots : '-'}
            </span>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-400 text-right mt-2 flex items-center justify-end gap-1">
              <span>อัพเดทล่าสุด:</span>
              <span className="font-mono bg-gray-700/50 px-2 py-0.5 rounded-md">{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>

      {/* ฟอร์มเช็คสถานะ */}
      <div className="card-container backdrop-blur-sm bg-gray-800/40">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            เช็คสถานะการดักซอง
          </h2>
        </div>

        {/* ส่วนหัวข้อ */}
        <div className="mb-6 p-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <Phone size={18} className="text-blue-400" />
            <span className="text-blue-100">เช็คสถานะด้วยเบอร์โทรศัพท์</span>
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-6">
            <div className="relative group">
              <input
                type="tel"
                className={`w-full bg-gray-700/30 border transform transition-all duration-300 ${
                  error ? 'border-red-500/50 shake-animation' : 'border-gray-600/30 group-hover:border-gray-500/50 focus:border-blue-500/50'
                } rounded-xl py-3 px-4 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 ${
                  error ? 'focus:ring-red-500/30' : 'focus:ring-blue-500/30'
                } ${isLoading ? 'opacity-50' : ''}`}
                placeholder="กรอกเบอร์โทรศัพท์ เช่น 0812345678"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                error ? 'text-red-400' : 'text-gray-400 group-hover:text-gray-300'
              }`}>
                <Phone size={20} />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                <XCircle size={14} className="animate-bounce" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 
              transform hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:hover:scale-100 disabled:hover:from-blue-500 disabled:hover:to-blue-600 
              focus:ring-2 focus:ring-blue-500/30 ring-offset-2 ring-offset-gray-800 
              shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="animate-pulse">กำลังตรวจสอบ...</span>
              </span>
            ) : (
              'ตรวจสอบสถานะ'
            )}
          </button>
        </form>

        {/* แสดงผลการเช็คสถานะ */}
        {statusData && (
          <div className="mt-8 bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/20 animate-fade-in-up">
            <div className="space-y-4">
              <div className={`flex items-center justify-center gap-3 mb-6 ${
                statusData.botSessionStatus && typeof statusData.botSessionStatus === 'object' && statusData.botSessionStatus.active
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {statusData.botSessionStatus && typeof statusData.botSessionStatus === 'object' && statusData.botSessionStatus.active ? (
                  <>
                    <div className="p-3 rounded-full bg-green-500/20 animate-pulse">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">บอททำงานอยู่</h3>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-red-500/20">
                      <XCircle size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">บอทไม่ทำงาน</h3>
                  </>
                )}
              </div>

              <div className="space-y-1 bg-gray-800/50 rounded-xl p-4">
                <InfoItem 
                  label="เบอร์รับเงิน" 
                  value={input || statusData?.phone || '-'}
                  isMono={true} 
                  color="text-green-400" 
                  canCopy={true}
                />
                <InfoItem
                  label="เบอร์โทรศัพท์บอท"
                  value={statusData.botSessionStatus && typeof statusData.botSessionStatus === 'object'
                    ? statusData.botSessionStatus.telegramPhone || '-'
                    : statusData.botPhone || '-'
                  }
                  isMono={true}
                  color="text-blue-400"
                />
                <InfoItem
                  label="ยอดรวมที่รับได้"
                  value={`${statusData.totalAmount?.toLocaleString() || '0'} บาท`}
                  color="text-yellow-400"
                />

                {/* แทนที่ส่วนแสดงผลเวลาเดิม */}
                <div className="border-t border-gray-600/30 mt-4 pt-4">
                  <h3 className="text-md font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                    เวลาคงเหลือ
                  </h3>
                  {typeof statusData.botSessionStatus === 'string' ? (
                    <div className="text-orange-400 text-sm py-2 px-3 bg-orange-500/10 rounded-lg">
                      {statusData.botSessionStatus}
                    </div>
                  ) : (
                    <>
                      {countdown && (
                        <div className="animate-fade-in">
                          {(() => {
                            try {
                              const time = JSON.parse(countdown);
                              return time.isExpired ? (
                                <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
                                  <XCircle size={18} />
                                  <span className="font-semibold">หมดอายุแล้ว</span>
                                </div>
                              ) : (
                                <div className="grid grid-cols-4 gap-1.5 mx-auto max-w-[280px]">
                                  <TimeUnit value={time.days} label="วัน" />
                                  <TimeUnit value={time.hours} label="ชม." />
                                  <TimeUnit value={time.minutes} label="น." />
                                  <TimeUnit 
                                    value={time.seconds} 
                                    label="วิ."
                                    color={time.seconds % 2 === 0 ? "text-yellow-400" : "text-yellow-300"}
                                  />
                                </div>
                              );
                            } catch {
                              return <div>-</div>;
                            }
                          })()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCheckForm;
