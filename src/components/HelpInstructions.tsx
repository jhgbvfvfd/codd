
import React from 'react';
import { Info, Database, Smartphone, CheckSquare, Clock } from 'lucide-react';

const HelpInstructions: React.FC = () => {
  return (
    <div className="glass-card animate-fade-in">
      <h2 className="text-xl font-bold mb-6 gradient-text flex items-center">
        <Info size={20} className="mr-2 text-blue-400" />
        วิธีใช้งาน
      </h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-slate-700/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
            <Smartphone size={18} className="mr-2" />
            1. ลงทะเบียนเบอร์โทรศัพท์
          </h3>
          <p className="text-sm text-gray-300">
            ไปที่แท็บ "เพิ่มเบอร์" และกรอกเบอร์โทรศัพท์ของคุณในรูปแบบไทย (เช่น 0812345678) พร้อมกับ API Key 
          </p>
        </div>
        
        <div className="p-4 bg-slate-700/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
            <CheckSquare size={18} className="mr-2" />
            2. ตรวจสอบสถานะ
          </h3>
          <p className="text-sm text-gray-300">
            ไปที่แท็บ "เช็คสถานะ" และเลือกวิธีการตรวจสอบโดย:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-300 space-y-1">
            <li>กรอกเบอร์โทรศัพท์ที่ลงทะเบียนไว้ หรือ</li>
            <li>กรอก API Key ที่ใช้ในการลงทะเบียน</li>
          </ul>
        </div>
        
        <div className="p-4 bg-slate-700/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
            <CheckSquare size={18} className="mr-2" />
            4. ดูข้อมูลการดักซอง
          </h3>
          <p className="text-sm text-gray-300">
            เมื่อตรวจสอบสำเร็จ ระบบจะแสดงข้อมูลต่อไปนี้:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-300 space-y-1">
            <li>เบอร์โทรศัพท์ที่ลงทะเบียน</li>
            <li>จำนวนเงินที่ดักซองได้ (ถ้ามี)</li>
            <li>วันและเวลาหมดอายุ</li>
            <li>เวลาที่เหลือก่อนหมดอายุ</li>
          </ul>
        </div>
        
        <div className="p-4 bg-slate-700/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
            <Clock size={18} className="mr-2" />
            5. การหมดอายุ
          </h3>
          <p className="text-sm text-gray-300">
            API Key และการลงทะเบียนเบอร์จะหมดอายุหลังจากเวลาที่กำหนด คุณสามารถลงทะเบียนใหม่โดยทำตามขั้นตอนที่ 1-2 อีกครั้ง
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpInstructions;
