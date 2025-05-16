
import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import RegisterForm from '../components/RegisterForm';
import StatusCheckForm from '../components/StatusCheckForm';
import HelpInstructions from '../components/HelpInstructions';
import HomeScreen from '../components/HomeScreen';
import '@fontsource/prompt/400.css';
import '@fontsource/prompt/500.css';
import '@fontsource/prompt/700.css';
import '@fontsource/sarabun/400.css';
import '@fontsource/sarabun/500.css';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'register':
        return <RegisterForm />;
      case 'status':
        return <StatusCheckForm />;
      case 'help':
        return <HelpInstructions />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  // Update document title to reflect the active tab
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'TrueMoney Catcher | ดักซองอังเปา',
      register: 'จัดการบริการ | TrueMoney Catcher',
      status: 'เช็คสถานะ | TrueMoney Catcher',
      help: 'วิธีใช้งาน | TrueMoney Catcher'
    };
    document.title = titles[activeTab] || titles.home;
  }, [activeTab]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="app-container">
        {!showSplash && (
          <>
            <div className="px-4 py-2">
              <Logo />
              
              <div className="mt-4 px-1">
                {renderContent()}
              </div>
            </div>
            
            <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        )}
      </div>
    </>
  );
};

export default Index;
