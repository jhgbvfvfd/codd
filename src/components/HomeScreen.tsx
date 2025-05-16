
import React, { useState, useEffect } from 'react';
import { checkApiHealth } from '../services/api';
import { CheckCircle, XCircle, ArrowRight, Activity, Search, Terminal, Lock, AlertTriangle, Bot } from 'lucide-react';

const HomeScreen: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkApiHealth();
      setApiStatus(status);
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    
    // Update the time every second for the cyber clock
    const timeInterval = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-4 cyber-grid">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-blue-400 font-mono text-xs flex items-center">
          <Terminal size={12} className="mr-1" />
          <span>ระบบ.คอนโซล</span>
        </div>
        <div className="text-blue-400 font-mono text-xs">
          {timeString}
        </div>
      </div>
      
      <div className="cyber-card digital-noise shimmer">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold gradient-text flex items-center cyber-line">
            <Activity size={18} className="mr-2 text-blue-400" />
            สถานะระบบ
          </h2>
          <div className="flex items-center">
            {apiStatus === null ? (
              <span className="text-amber-300 text-sm flex items-center bg-amber-500/10 px-2 py-0.5 rounded-md">
                <div className="highlight-dot mr-2"></div>
                กำลังสแกน...
              </span>
            ) : apiStatus ? (
              <span className="text-green-400 text-sm flex items-center bg-green-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle size={14} className="mr-1" />
                เชื่อมต่อแล้ว
              </span>
            ) : (
              <span className="text-red-400 text-sm flex items-center bg-red-500/10 px-2 py-0.5 rounded-md">
                <XCircle size={14} className="mr-1" />
                ออฟไลน์
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-300 font-mono border-t border-gray-700/20 pt-2">
          <div className="flex justify-between">
            <span>ความหน่วง:</span>
            <span className="text-blue-400">{apiStatus ? '24ms' : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>ความปลอดภัย:</span>
            <span className="text-green-400">เข้ารหัสแล้ว</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div 
          className="cyber-card hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer hover:scale-[1.02] duration-300"
          onClick={() => onNavigate('register')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-full mx-auto flex items-center justify-center mb-2 border border-blue-500/30">
              <Plus size={24} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-200">เพิ่มเบอร์</h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">ลงทะเบียนเบอร์ใหม่</p>
            <div className="mt-2 text-blue-400 flex items-center justify-center text-sm">
              <span>เริ่ม</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div 
          className="cyber-card hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer hover:scale-[1.02] duration-300"
          onClick={() => onNavigate('status')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-full mx-auto flex items-center justify-center mb-2 border border-blue-500/30">
              <Search size={24} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-200">เช็คสถานะ</h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">ตรวจสอบข้อมูล</p>
            <div className="mt-2 text-blue-400 flex items-center justify-center text-sm">
              <span>ตรวจสอบ</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-card matrix-bg shimmer relative overflow-hidden">
        <div className="absolute top-5 right-5 text-amber-300">
          <AlertTriangle size={24} className="opacity-70" />
        </div>
        
        <div className="absolute top-2 left-2 flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400/70"></div>
          <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
        </div>
        
        <div className="pt-5">
          <div className="flex items-center space-x-2 mb-2">
            <Lock size={18} className="text-amber-300" />
            <h3 className="text-lg font-bold text-amber-300">SECURE SYSTEM</h3>
          </div>
          
          <p className="text-sm mb-4 text-gray-300 font-mono border-l-2 border-amber-500/50 pl-3">
            Auto-capture TrueMoney red packets with our advanced interception system.
          </p>
          
          <button 
            onClick={() => onNavigate('help')} 
            className="bg-amber-500/10 text-amber-300 text-sm font-mono px-4 py-2 rounded border border-amber-400/30 hover:bg-amber-500/20 transition-colors flex items-center"
          >
            <Terminal size={14} className="mr-2" />
            ACCESS DOCUMENTATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

function Plus(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
