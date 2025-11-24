import React, { useEffect, useState } from 'react';
import { GECKOTERMINAL_TOKEN_API_URL } from '../constants';

interface TokenData {
  total_supply: string;
  price_usd: string;
  fdv_usd: string;
  market_cap_usd: string;
  volume_24h_usd: string;
}

const Tokenomics: React.FC = () => {
  const [attributes, setAttributes] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GECKOTERMINAL_TOKEN_API_URL);
        const json = await response.json();
        if (json.data && json.data.attributes) {
          setAttributes(json.data.attributes);
        }
      } catch (error) {
        console.error("Failed to fetch tokenomics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helpers for formatting
  const formatNumber = (numStr: string, currency = false) => {
    if (!numStr) return "N/A";
    const num = parseFloat(numStr);
    if (isNaN(num)) return "N/A";
    
    // For large numbers like supply
    if (!currency && num > 1_000_000) {
        return new Intl.NumberFormat('en-US', { 
            maximumFractionDigits: 0 
        }).format(num);
    }

    return currency 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
      : new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
     return (
        <div className="glass-panel p-8 rounded-3xl flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-violet-500 font-bold animate-pulse">Loading Tokenomics Data...</div>
            </div>
        </div>
     );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        {/* Header */}
        <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden transition-colors duration-300">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
             <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">Tokenomics</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium">Verified On-Chain Data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Supply */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-[1.02] transition duration-300">
                 <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 text-2xl shadow-sm">
                    <i className="fa-solid fa-coins"></i>
                 </div>
                 <div className="text-sm font-bold opacity-60 uppercase mb-2 text-slate-600 dark:text-slate-400">Total Supply</div>
                 <div className="text-xl md:text-2xl font-black tracking-tight break-all text-slate-800 dark:text-white">
                    {formatNumber(attributes?.total_supply || '0')}
                 </div>
            </div>

            {/* Circulating Supply */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-[1.02] transition duration-300">
                 <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4 text-2xl shadow-sm">
                    <i className="fa-solid fa-rotate"></i>
                 </div>
                 <div className="text-sm font-bold opacity-60 uppercase mb-2 text-slate-600 dark:text-slate-400">Circulating Supply</div>
                 <div className="text-xl md:text-2xl font-black tracking-tight break-all text-slate-800 dark:text-white">
                    {formatNumber(attributes?.total_supply || '0')}
                 </div>
                 <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full mt-2 font-bold">100% Unlocked</span>
            </div>

            {/* Max Supply */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-[1.02] transition duration-300">
                 <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 text-2xl shadow-sm">
                    <i className="fa-solid fa-vault"></i>
                 </div>
                 <div className="text-sm font-bold opacity-60 uppercase mb-2 text-slate-600 dark:text-slate-400">Max Supply</div>
                 <div className="text-xl md:text-2xl font-black tracking-tight break-all text-slate-800 dark:text-white">
                    {formatNumber(attributes?.total_supply || '0')}
                 </div>
            </div>
        </div>
        
        {/* Financials & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Financial Stats */}
             <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <i className="fa-solid fa-chart-line text-violet-500"></i> Market Data
                </h3>
                <div className="space-y-4">
                     <div className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-800/40">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Price (USD)</span>
                        <span className="font-mono font-black text-slate-800 dark:text-white">{formatNumber(attributes?.price_usd || '0', true)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-800/40">
                        <span className="font-bold text-slate-600 dark:text-slate-400">FDV</span>
                        <span className="font-mono font-black text-slate-800 dark:text-white">{formatNumber(attributes?.fdv_usd || '0', true)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-800/40">
                        <span className="font-bold text-slate-600 dark:text-slate-400">24h Volume</span>
                        <span className="font-mono font-black text-slate-800 dark:text-white">{formatNumber(attributes?.volume_24h_usd || '0', true)}</span>
                     </div>
                </div>
            </div>

            {/* Supply Distribution */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <i className="fa-solid fa-pie-chart text-pink-500"></i> Distribution
                </h3>
                 <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">Liquidity Pool</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">90%</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">Marketing & Dev</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">5%</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">Community Airdrop</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">5%</span>
                    </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <i className="fa-solid fa-lock"></i> Liquidity Locked Forever
                    </div>
                </div>
            </div>
        </div>

        {/* Description */}
        <div className="glass-panel p-8 rounded-3xl text-center">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">About $CHONK</h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 italic">
                "The ultimate meme-powered dashboard token"
            </p>
        </div>
    </div>
  );
};

export default Tokenomics;