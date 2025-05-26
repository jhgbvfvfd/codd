
import React from 'react';
import { Home, Plus, Search, HelpCircle } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'บ้าน', icon: Home },
    { id: 'register', label: 'เพิ่มเบอร์', icon: Plus },
    { id: 'status', label: 'เช็คข้อมูล', icon: Search },
    { id: 'help', label: 'วิธีใช้', icon: HelpCircle },
  ];

  return (
    <div className="bottom-nav shadow-lg backdrop-blur-md bg-gray-900/80 border-t border-gray-700/50">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <div>
            <item.icon 
              size={18} 
              className={`nav-icon ${activeTab === item.id ? 'text-white' : ''} transition-all duration-300`} 
            />
          </div>
          <span className="transition-all duration-300 text-[10px] font-mono tracking-wider mt-0.5">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;
