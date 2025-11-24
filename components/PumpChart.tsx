import React from 'react';
import { POOL_ADDRESS } from '../constants';

interface PumpChartProps {
  pumpCount: number; // Kept for interface compatibility, though chart is now live
}

const PumpChart: React.FC<PumpChartProps> = () => {
  return (
    <div className="h-[350px] md:h-[500px] w-full bg-[#1e2025] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900/10 relative">
      <div className="absolute top-0 left-0 w-full bg-slate-900 text-white text-xs py-1 px-4 flex justify-between items-center z-10">
         <span className="font-bold flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           LIVE MARKET DATA
         </span>
         <span className="opacity-60">Powered by GeckoTerminal</span>
      </div>
      <iframe 
        height="100%" 
        width="100%" 
        id="geckoterminal-embed" 
        title="GeckoTerminal Embed" 
        src={`https://www.geckoterminal.com/solana/pools/${POOL_ADDRESS}?embed=1&info=0&swaps=0`} 
        frameBorder="0" 
        allow="clipboard-write" 
        allowFullScreen
        className="mt-6"
      ></iframe>
    </div>
  );
};

export default PumpChart;