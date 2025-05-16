
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const fullText = '> Initializing system...\n> Loading modules...\n> Establishing secure connection...\n> Access granted.';

  useEffect(() => {
    // Show terminal effect after a short delay
    const terminalTimer = setTimeout(() => {
      setShowTerminal(true);
      
      // Simulate terminal typing effect
      let i = 0;
      const typeTimer = setInterval(() => {
        setTerminalText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(typeTimer);
        }
      }, 35); // Speed of typing
      
      return () => clearInterval(typeTimer);
    }, 500);
    
    // Extended timeout to 5 seconds before transitioning away from splash screen
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(terminalTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
      <div className="tech-pattern absolute inset-0 opacity-20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        backgroundColor: "#121212",
        backgroundSize: "60px 60px",
      }}></div>
      <div className="relative z-10 flex flex-col items-center backdrop-blur-sm">
        <div className="animate-bounce-limited mb-4 relative">
          <div className="absolute inset-0 bg-blue-600/30 blur-xl rounded-full animate-pulse"></div>
          <Logo />
        </div>
        
        {showTerminal && (
          <div className="mt-4 w-64 h-32 bg-gray-900/70 border border-blue-500/30 rounded-md p-2 overflow-hidden">
            <pre className="text-left text-green-400 text-xs font-mono">{terminalText}</pre>
            <span className="inline-block h-4 w-2 bg-green-400 ml-1 animate-pulse"></span>
          </div>
        )}
        
        <div className="mt-6">
          <div className="loading-spinner"></div>
        </div>
        <div className="mt-4 text-blue-400 animate-pulse text-sm font-mono tracking-wider">SYSTEM LOADING...</div>
      </div>
    </div>
  );
};

export default SplashScreen;
