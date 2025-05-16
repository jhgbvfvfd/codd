
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
      {/* Stylish gradient background with a radial glow instead of grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#180a29] to-[#24104d] opacity-95"></div>
      
      {/* Animated purple particles effect */}
      <div className="absolute inset-0 digital-noise opacity-20"></div>
      
      {/* Stylish light rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
          <div className="absolute inset-0 rotate-0 animate-[spin_10s_linear_infinite]">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
          </div>
          <div className="absolute inset-0 rotate-45 animate-[spin_15s_linear_infinite]">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-purple-600 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center backdrop-blur-sm">
        {/* Logo with improved animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 -m-4 bg-purple-600/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="animate-float">
            <Logo />
          </div>
        </div>
        
        {/* Stylish terminal with purple highlights */}
        {showTerminal && (
          <div className="mt-4 w-72 h-36 bg-gray-900/80 border border-purple-500/40 rounded-md p-3 overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] backdrop-blur">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
            </div>
            <pre className="text-left text-purple-300 text-xs font-mono">{terminalText}</pre>
            <span className="inline-block h-4 w-2 bg-purple-400 ml-1 animate-pulse"></span>
          </div>
        )}
        
        {/* Improved spinner */}
        <div className="mt-8 relative">
          <div className="loading-spinner border-purple-500 after:border-l-purple-500"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md animate-pulse"></div>
        </div>
        
        <div className="mt-4 text-purple-300 animate-pulse text-sm font-mono tracking-wider">SYSTEM LOADING...</div>
      </div>
    </div>
  );
};

export default SplashScreen;
