
import React, { useState, useEffect } from 'react';
import { AppSection } from './types';
import { MOCK_TRANSACTIONS, TOKEN_MINT_ADDRESS, POOL_ADDRESS, BUY_LINK, SELL_LINK, POOL_EXPLORER_URL, GECKOTERMINAL_API_URL, GECKOTERMINAL_TOKEN_API_URL, STAKING_APY, MOCK_WALLET_BALANCE } from './constants';
import { getMarketSentiment } from './services/geminiService';
import PumpChart from './components/PumpChart';
import Oracle from './components/Oracle';
import ChonkRater from './components/ChonkRater';
import Staking from './components/Staking';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [pumpCount, setPumpCount] = useState(0);
  const [isPumping, setIsPumping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [marketCap, setMarketCap] = useState<string>('Loading...');
  
  // Tokenomics State
  const [totalSupply, setTotalSupply] = useState<string>('Loading...');
  const [circulatingSupply, setCirculatingSupply] = useState<string>('Loading...');

  // AI Vibe Check State
  const [aiSentiment, setAiSentiment] = useState<string>("");
  const [isVibeLoading, setIsVibeLoading] = useState(false);

  // Staking State (Lifted)
  const [walletBalance, setWalletBalance] = useState(MOCK_WALLET_BALANCE);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch Token Data from GeckoTerminal
        const response = await fetch(GECKOTERMINAL_TOKEN_API_URL);
        const data = await response.json();
        const attributes = data?.data?.attributes;
        
        if (attributes) {
          // Market Cap / FDV
          const fdv = attributes.fdv_usd || attributes.market_cap_usd;
          if (fdv) {
            setMarketCap(
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(parseFloat(fdv))
            );
          } else {
            setMarketCap('$420.69K'); // Fallback
          }

          // Total Supply
          let supplyNum = 1000000000; // Default
          if (attributes.total_supply) {
            supplyNum = parseFloat(attributes.total_supply);
            setTotalSupply(new Intl.NumberFormat('en-US').format(supplyNum));
          } else {
            setTotalSupply('1,000,000,000');
          }

          // Circulating Supply Calculation (Estimation)
          // If market_cap_usd exists and is less than fdv_usd, calculate ratio.
          // Otherwise, for pump.fun tokens, it's usually 100% or close to it.
          if (attributes.market_cap_usd && attributes.fdv_usd) {
             const mcap = parseFloat(attributes.market_cap_usd);
             const fdvVal = parseFloat(attributes.fdv_usd);
             const ratio = mcap / fdvVal;
             const circulating = supplyNum * ratio;
             
             // If the ratio is very close to 1, just say 100%
             if (ratio > 0.99) {
                 setCirculatingSupply('100%');
             } else {
                 setCirculatingSupply(new Intl.NumberFormat('en-US').format(Math.floor(circulating)));
             }
          } else {
            setCirculatingSupply('100%');
          }
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        setMarketCap('$420.69K');
        setTotalSupply('1,000,000,000');
        setCirculatingSupply('100%');
      }
    };

    if (activeSection === AppSection.DASHBOARD) {
      fetchTokenData();
    }
  }, [activeSection]);

  // Staking Rewards Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stakedBalance > 0) {
      interval = setInterval(() => {
        // Calculate reward based on APY
        // Rate per second = (APY / 100) / (365 * 24 * 60 * 60) * Staked
        const ratePerSecond = (STAKING_APY / 100) / 31536000; 
        const tickReward = stakedBalance * ratePerSecond;
        setRewards(prev => prev + tickReward);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stakedBalance]);

  const handlePump = () => {
    setPumpCount(prev => prev + 1);
    setIsPumping(true);
    setTimeout(() => setIsPumping(false), 150);
  };

  const handleVibeCheck = async () => {
    if (isVibeLoading) return;
    setIsVibeLoading(true);
    const sentiment = await getMarketSentiment(pumpCount);
    setAiSentiment(sentiment);
    setIsVibeLoading(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Staking Handlers
  const handleStake = (amount: number) => {
    if (amount > walletBalance) return;
    setWalletBalance(prev => prev - amount);
    setStakedBalance(prev => prev + amount);
  };

  const handleUnstake = (amount: number) => {
    if (amount > stakedBalance) return;
    setWalletBalance(prev => prev + amount);
    setStakedBalance(prev => prev - amount);
  };

  const handleClaim = () => {
    if (rewards <= 0) return;
    setWalletBalance(prev => prev + rewards);
    setRewards(0);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-panel shadow-sm px-4 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveSection(AppSection.DASHBOARD)}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
              C
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 hidden sm:block">Chonk<span className="text-pink-500">Pump</span></h1>
          </div>
          
          {/* Scrollable Nav for Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-hide mask-image-right">
            <NavButton 
              active={activeSection === AppSection.DASHBOARD} 
              onClick={() => setActiveSection(AppSection.DASHBOARD)}
              icon="fa-chart-line"
              label="Dashboard"
            />
            <NavButton 
              active={activeSection === AppSection.STAKING} 
              onClick={() => setActiveSection(AppSection.STAKING)}
              icon="fa-vault"
              label="Staking"
            />
            <NavButton 
              active={activeSection === AppSection.ORACLE} 
              onClick={() => setActiveSection(AppSection.ORACLE)}
              icon="fa-brain"
              label="Oracle"
            />
            <NavButton 
              active={activeSection === AppSection.RATER} 
              onClick={() => setActiveSection(AppSection.RATER)}
              icon="fa-camera"
              label="Rater"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4">
        {activeSection === AppSection.DASHBOARD && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
              <div className="flex-1 text-center lg:text-left w-full">
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                  <div className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-violet-600 border border-violet-200">
                    🚀 Real Solana Pool Live
                  </div>
                  <button 
                    onClick={handleVibeCheck}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1 rounded-full text-sm font-bold text-white shadow-md hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isVibeLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                    AI Vibe Check
                  </button>
                </div>

                {/* AI Sentiment Bubble */}
                {aiSentiment && (
                  <div className="bg-slate-800 text-white p-4 rounded-xl rounded-tl-none mb-6 text-sm font-bold shadow-xl animate-[fadeIn_0.5s_ease-out] relative max-w-md mx-auto lg:mx-0 border border-slate-600">
                    <div className="absolute -top-3 left-6 w-4 h-4 bg-slate-800 border-l border-t border-slate-600 transform rotate-45"></div>
                    <i className="fa-brands fa-google text-lg mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400"></i>
                    "{aiSentiment}"
                  </div>
                )}

                <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                  PUMP THE <br/><span className={`inline-block transition-transform duration-150 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 ${isPumping ? 'scale-110' : ''}`}>$CHONK9K</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-700 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
                  The only ecosystem powered by Gemini AI and pure adipose tissue. 
                  View the real charts, consult the oracle, and hold until you wobble.
                </p>
                
                {/* Contract Address Card */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl mb-8 max-w-xl mx-auto lg:mx-0 text-left border border-slate-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <i className="fa-brands fa-solana text-8xl transform rotate-12"></i>
                  </div>
                  <h3 className="text-pink-400 font-bold text-sm uppercase tracking-widest mb-2">Token Contract Address (CA)</h3>
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-3 border border-slate-600">
                    <code className="flex-1 font-mono text-xs md:text-sm text-slate-300 truncate">
                      {TOKEN_MINT_ADDRESS}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(TOKEN_MINT_ADDRESS, 'CA')}
                      className="text-violet-400 hover:text-white transition px-2"
                      title="Copy Address"
                    >
                      <i className={`fa-solid ${copied === 'CA' ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700 flex flex-col gap-2">
                     <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest">Liquidity Pool Address</h3>
                     <div className="flex items-center gap-2">
                        <code className="text-xs text-slate-400 truncate flex-1">{POOL_ADDRESS}</code>
                        <button 
                          onClick={() => copyToClipboard(POOL_ADDRESS, 'POOL')}
                          className="text-slate-500 hover:text-white transition px-2"
                        >
                           <i className={`fa-solid ${copied === 'POOL' ? 'fa-check' : 'fa-copy'}`}></i>
                        </button>
                     </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                   <button 
                    onClick={handlePump}
                    className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-base md:text-lg shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-green-300 animate-pulse"
                  >
                    <i className="fa-solid fa-rocket"></i> PUMP IT!
                  </button>
                  <a 
                    href={BUY_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:shadow-pink-500/25 transition shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-coins"></i> BUY
                  </a>
                  <a 
                    href={POOL_EXPLORER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-slate-900 px-5 md:px-6 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-50 transition shadow-lg border-2 border-slate-200 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-magnifying-glass-chart"></i> Explorer
                  </a>
                </div>
              </div>
              
              {/* Live Chart Section */}
              <div className="flex-1 w-full lg:min-w-[500px]">
                <PumpChart pumpCount={pumpCount} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              <StatCard label="Token" value="$CHONK9K" icon="fa-paw" color="bg-pink-100 text-pink-600" animate={isPumping} />
              <StatCard label="Global Pumps" value={pumpCount.toLocaleString()} icon="fa-heart-pulse" color="bg-red-100 text-red-600" animate={isPumping} tooltip="Total number of times the community has pumped the Chonk." />
              <StatCard label="Market Cap" value={marketCap} icon="fa-sack-dollar" color="bg-yellow-100 text-yellow-600" tooltip="Fully Diluted Valuation based on current GeckoTerminal data." />
              <StatCard label="Staking APY" value={`${STAKING_APY}%`} icon="fa-vault" color="bg-emerald-100 text-emerald-600" tooltip="Annual Percentage Yield for staking CHONK9K tokens." />
              <StatCard label="Pool" value="LIVE" icon="fa-water" color="bg-green-100 text-green-600" tooltip="Liquidity pool is active and trading on Raydium." />
              <StatCard label="Oracle" value="ONLINE" icon="fa-eye" color="bg-purple-100 text-purple-600" tooltip="AI Prediction Model is connected and ready to answer queries." />
            </div>

             {/* Tokenomics Section */}
             <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 rotate-12">
                <i className="fa-solid fa-chart-pie text-9xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                <i className="fa-solid fa-chart-pie text-violet-500"></i> Tokenomics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-white/60 p-5 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <i className="fa-solid fa-coins"></i>
                    </div>
                    <div className="text-slate-500 text-sm font-bold uppercase">Total Supply</div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 tracking-tight">{totalSupply}</div>
                  <div className="text-xs text-slate-500 font-bold mt-1 bg-blue-50 inline-block px-2 py-1 rounded text-blue-600">
                    <i className="fa-solid fa-lock mr-1"></i> Fixed Cap
                  </div>
                </div>
                
                <div className="bg-white/60 p-5 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition">
                   <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <i className="fa-solid fa-globe"></i>
                    </div>
                    <div className="text-slate-500 text-sm font-bold uppercase">Circulating</div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 tracking-tight">{circulatingSupply}</div>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    <div className="text-xs text-slate-500 font-bold bg-green-50 inline-block px-2 py-1 rounded text-green-600">
                       Public Launch
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200/50">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      <i className="fa-solid fa-fire text-orange-500 mr-1"></i>
                      <span className="font-bold text-slate-700">Burn Mechanism:</span> LP tokens are permanently burned. This locks liquidity and removes these tokens from the circulating supply, creating deflationary pressure.
                    </p>
                  </div>
                </div>

                <div className="bg-white/60 p-5 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition">
                   <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div className="text-slate-500 text-sm font-bold uppercase">Safety</div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <i className="fa-solid fa-fire text-orange-500"></i> Liquidity Burned
                    </div>
                     <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <i className="fa-solid fa-ban text-red-500"></i> Mint Authority Revoked
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-yellow-500"></i> Recent Activity
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase">Simulated Feed</span>
              </div>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((tx, idx) => (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 bg-white/60 rounded-xl hover:bg-white transition gap-2">
                    <div className="flex items-center gap-3 min-w-[120px] md:min-w-[150px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${tx.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${tx.type === 'buy' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      </div>
                      <span className="font-bold text-slate-700 text-sm md:text-base">{tx.user}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      <span className={`font-mono font-bold text-sm md:text-base ${tx.type === 'buy' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'buy' ? '+' : '-'}{tx.amount}
                      </span>
                      <div className="flex gap-2 border-l pl-3 border-slate-200">
                        <a 
                          href={BUY_LINK} 
                          target="_blank" 
                          rel="noreferrer" 
                          title="Trade on Raydium"
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                        >
                          BUY
                        </a>
                        <a 
                          href={SELL_LINK} 
                          target="_blank" 
                          rel="noreferrer" 
                          title="Trade on Raydium"
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                        >
                          SELL
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === AppSection.ORACLE && <Oracle />}
        
        {activeSection === AppSection.RATER && <ChonkRater />}
        
        {activeSection === AppSection.STAKING && (
          <Staking 
            walletBalance={walletBalance}
            stakedBalance={stakedBalance}
            rewards={rewards}
            onStake={handleStake}
            onUnstake={handleUnstake}
            onClaim={handleClaim}
          />
        )}
      </main>
    </div>
  );
};

// Helper Components
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-3 md:px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'hover:bg-slate-100 text-slate-600'
    }`}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string; animate?: boolean; tooltip?: string }> = ({ label, value, icon, color, animate, tooltip }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition relative group ${tooltip ? 'cursor-help' : ''}`}>
    {tooltip && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 text-center shadow-lg hidden sm:block">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    )}
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-1">
      {label}
      {tooltip && <i className="fa-solid fa-circle-info text-slate-300 text-[10px]"></i>}
    </div>
    <div className={`text-xl md:text-2xl font-black text-slate-800 transition-all duration-150 ${animate ? 'scale-125 text-green-500' : ''}`}>{value}</div>
  </div>
);

export default App;