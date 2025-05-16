import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border border-purple-500/30">
        {/* Animated background gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#180a29] to-[#24104d] overflow-hidden">
          {/* Animated shine effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full animate-[spin_8s_linear_infinite] opacity-50">
              <div className="absolute top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Futuristic circuit-like patterns */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-2 left-2 w-3 h-3 border rounded-full border-purple-400"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border rounded-full border-purple-400"></div>
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-purple-400"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-purple-400"></div>
          
          {/* Circuit lines */}
          <div className="absolute top-3.5 left-3.5 w-4 h-px bg-purple-400/60"></div>
          <div className="absolute bottom-3.5 right-3.5 w-4 h-px bg-purple-400/60"></div>
          <div className="absolute bottom-3.5 left-3.5 h-4 w-px bg-purple-400/60"></div>
          <div className="absolute top-3.5 right-3.5 h-4 w-px bg-purple-400/60"></div>
        </div>
        
        {/* Logo image with glow */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-purple-500/20 filter blur-md"></div>
          <img 
            src="https://cdn-pic.xncly.xyz/upload/pM7YTBNvikQ8GAODt0Fq.png" 
            alt="TMC Logo" 
            className="w-16 h-16 object-contain relative z-10"
          />
        </div>
        
        {/* Animated elements */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
        
        <div className="absolute -bottom-2 -right-2 bg-purple-400 w-6 h-6 rounded-md flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.7)]">
          <span className="text-gray-900 text-xs font-bold">$</span>
        </div>
      </div>
      
      {/* Text elements with purple theme */}
      <h1 className="mt-3 text-xl font-bold flex items-center">
        <span className="text-purple-400 mr-1">CYBERSAFE</span>
        <span className="text-white">GIFT</span>
        <span className="text-purple-400 ml-1">TW</span>
      </h1>
      
      <div className="text-xs flex items-center space-x-2 mt-1.5 text-gray-300/90">
        <span className="bg-purple-900/30 border border-purple-700/30 px-2 py-0.5 rounded font-mono">v2.1</span>
        <span>telegram</span>
      </div>
    </div>
  );
};

export default Logo;
