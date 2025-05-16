import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 w-22 h-22 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full binary-bg"></div>
        </div>
        
        {/* Circuit-like patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 left-2 w-3 h-3 border rounded-full border-blue-400"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border rounded-full border-blue-400"></div>
          <div className="absolute top-2 right-6 w-2 h-2 border-t border-r border-blue-400"></div>
          <div className="absolute bottom-2 left-6 w-2 h-2 border-b border-l border-blue-400"></div>
        </div>
        
        <img 
          src="https://cdn-pic.xncly.xyz/upload/pM7YTBNvikQ8GAODt0Fq.png" 
          alt="TMC Logo" 
          className="w-16 h-16 object-contain relative"
        />
        <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
        
        <div className="absolute -bottom-1 -right-1 bg-amber-300 w-6 h-6 rounded-sm flex items-center justify-center animate-pulse">
          <span className="text-gray-900 text-xs font-bold">$</span>
        </div>
      </div>
      
      <h1 className="mt-2 text-xl font-bold flex items-center">
        <span className="text-blue-400 mr-1">CYBERSAFE</span>
        <span className="text-white">GIFT</span>
        <span className="text-blue-400 ml-1">TW</span>
      </h1>
      
      <div className="text-xs flex items-center space-x-2 mt-1 text-gray-300/90">
        <span className="bg-gray-700/50 px-1.5 py-0.5 rounded font-mono">v2.1</span>
        <span>telegram</span>
      </div>
    </div>
  );
};

export default Logo;
