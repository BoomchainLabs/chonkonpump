
import React, { useState, useEffect } from 'react';
import { AppSection } from './types';
import { TOKEN_MINT_ADDRESS, POOL_ADDRESS, BUY_LINK, SELL_LINK, POOL_EXPLORER_URL, GECKOTERMINAL_API_URL, GECKOTERMINAL_TOKEN_API_URL, STAKING_APY, MOCK_WALLET_BALANCE, COMMUNITY_LINKS } from './constants';
import { getMarketSentiment } from './services/geminiService';
import PumpChart from './components/PumpChart';
import Oracle from './components/Oracle';
import ChonkRater from './components/ChonkRater';
import Staking from './components/Staking';
import Tokenomics from './components/Tokenomics';
import TransactionHistory from './components/TransactionHistory';
import Community from './components/Community';
import Trivia from './components/Trivia';

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition duration-300">
     <i className={`fa-solid ${icon} text-2xl mb-2 ${color}`}></i>
     <div className="text-xs font-bold uppercase opacity-60 mb-1">{label}</div>
     <div className="text-lg font-black tracking-tight">{value}</div>
  </div>
);

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="fixed top-24 right-6 z-[100] animate-[slideInRight_0.3s_ease-out]">
        <div className="bg-white dark:bg-slate-800 border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-center gap-3 pr-8 min-w-[300px]">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 shrink-0">
                <i className="fa-solid fa-check"></i>
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Success</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">{message}</p>
            </div>
            <button 
                onClick={onClose}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
);

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [pumpCount, setPumpCount] = useState(0);
  const [isPumping, setIsPumping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [marketCap, setMarketCap] = useState<string>('Loading...');
  
  // Wallet State with Persistence
  const [walletBalance, setWalletBalance] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('walletBalance');
        if (saved) return parseFloat(saved);
    }
    return MOCK_WALLET_BALANCE;
  });

  // Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // Tokenomics State
  const [totalSupply, setTotalSupply] = useState<string>('Loading...');
  const [circulating, setCirculating] = useState<string>('Loading...');
  const [price, setPrice] = useState<string>('Loading...');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('darkMode');
        if (saved) return saved === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Persist Wallet Balance
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  // Simulate Data Fetching
  useEffect(() => {
    const fetchData = () => {
       // In a real app, fetch from GECKOTERMINAL_API_URL
       setTimeout(() => {
           setMarketCap('$4.20M');
           setTotalSupply('1,000,000,000');
           setCirculating('900,000,000');
           setPrice('$0.0042069');
       }, 1000);
    };
    fetchData();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePump = () => {
    setIsPumping(true);
    setPumpCount(prev => prev + 1);
    setTimeout(() => setIsPumping(false), 150);
  };

  const handleClaimReward = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    setNotification(`You received ${amount.toLocaleString()} CHONK!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const renderContent = () => {
    switch(activeSection) {
        case AppSection.ORACLE: return <Oracle />;
        case AppSection.RATER: return <ChonkRater />;
        case AppSection.STAKING: return (
           <Staking 
              walletBalance={walletBalance} 
              stakedBalance={42000} 
              rewards={69.42} 
              onStake={(val) => {
                 setWalletBalance(prev => prev - val);
                 setNotification(`Staked ${val.toLocaleString()} CHONK`);
                 setTimeout(() => setNotification(null), 3000);
              }}
              onUnstake={(val) => {
                 setWalletBalance(prev => prev + val);
                 setNotification(`Unstaked ${val.toLocaleString()} CHONK`);
                 setTimeout(() => setNotification(null), 3000);
              }}
              onClaim={() => {
                 setWalletBalance(prev => prev + 69.42);
                 setNotification(`Claimed 69.42 Rewards`);
                 setTimeout(() => setNotification(null), 3000);
              }}
           />
        );
        case AppSection.TOKENOMICS: return <Tokenomics />;
        case AppSection.COMMUNITY: return <Community />;
        case AppSection.TRIVIA: return <Trivia onClaimReward={handleClaimReward} />;
        default: return (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PumpChart pumpCount={pumpCount} />
                </div>
                <div className="space-y-4">
                  {/* Contract Card */}
                  <div className="glass-panel p-6 rounded-3xl">
                     <h3 className="text-sm font-bold opacity-60 uppercase mb-2">Contract Address</h3>
                     <div 
                       onClick={() => handleCopy(TOKEN_MINT_ADDRESS)}
                       className="bg-white/50 dark:bg-black/30 p-4 rounded-xl font-mono text-xs sm:text-sm break-all cursor-pointer hover:bg-white/70 dark:hover:bg-black/50 transition flex justify-between items-center group border border-transparent hover:border-violet-300 dark:hover:border-violet-700"
                     >
                       <span className="truncate">{TOKEN_MINT_ADDRESS}</span>
                       <i className={`fa-solid ${copied === TOKEN_MINT_ADDRESS ? 'fa-check text-green-500' : 'fa-copy text-slate-400 group-hover:text-violet-500'}`}></i>
                     </div>
                  </div>
                  
                  {/* Pump Button Card */}
                  <div className="glass-panel p-6 rounded-3xl text-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div className="relative z-10">
                       <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
                         PUMP IT! <span className="text-xs font-normal opacity-50 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">Beta</span>
                       </h3>
                       <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 mb-4 transition-all duration-75" style={{ transform: isPumping ? 'scale(1.1)' : 'scale(1)' }}>
                         {pumpCount}
                       </div>
                       <button 
                         onClick={handlePump}
                         className={`w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl shadow-lg shadow-green-500/30 transform transition-all active:scale-95 hover:scale-105 hover:shadow-green-500/50 ${isPumping ? 'scale-95 ring-4 ring-green-400/50' : ''}`}
                       >
                         🚀 LFG
                       </button>
                     </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <StatCard label="Market Cap" value={marketCap} icon="fa-chart-pie" color="text-pink-500" />
                 <StatCard label="Price" value={price} icon="fa-tag" color="text-violet-500" />
                 <StatCard label="Circulating" value={circulating} icon="fa-circle-nodes" color="text-blue-500" />
                 <StatCard label="Holders" value="4,206" icon="fa-users" color="text-orange-500" />
              </div>
              
              {/* Transactions */}
              <TransactionHistory />
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
       {notification && <Toast message={notification} onClose={() => setNotification(null)} />}

       {/* Header */}
       <header className="p-4 md:p-6 flex justify-between items-center sticky top-0 z-50 bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border-b border-white/20 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                <i className="fa-solid fa-cat text-white text-xl"></i>
             </div>
             <h1 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter hidden sm:block">
                $CHONK
             </h1>
          </div>
          
          <nav className="hidden md:flex gap-1 bg-white/20 dark:bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/30 dark:border-white/5">
              {Object.values(AppSection).map(section => (
                  <button 
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                        activeSection === section 
                        ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-md transform scale-105' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                      {section}
                  </button>
              ))}
          </nav>

          <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{walletBalance.toLocaleString()} CHONK</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="w-10 h-10 rounded-xl bg-white/20 dark:bg-black/20 flex items-center justify-center text-slate-700 dark:text-yellow-400 hover:bg-white/40 dark:hover:bg-black/40 transition backdrop-blur-sm border border-white/10"
                aria-label="Toggle Dark Mode"
              >
                  {darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
              </button>
              <a 
                href={BUY_LINK} 
                target="_blank" 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-black hover:scale-105 transition shadow-lg flex items-center gap-2"
              >
                 <span>BUY</span>
                 <i className="fa-solid fa-arrow-right -rotate-45 text-xs"></i>
              </a>
          </div>
       </header>

       {/* Mobile Nav */}
       <div className="md:hidden sticky top-[73px] z-40 bg-white/5 dark:bg-black/20 backdrop-blur-md border-b border-white/10 overflow-x-auto no-scrollbar">
           <div className="flex p-2 gap-2 min-w-max">
            {Object.values(AppSection).map(section => (
                <button 
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition whitespace-nowrap ${
                        activeSection === section 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : 'bg-white/30 dark:bg-black/30 text-slate-700 dark:text-slate-200'
                    }`}
                >
                    {section}
                </button>
            ))}
           </div>
       </div>

       <main className="container mx-auto px-4 py-6 flex-1 max-w-6xl">
          {renderContent()}
       </main>
       
       <footer className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          <div className="flex justify-center gap-4 mb-4">
             <a href={COMMUNITY_LINKS.TWITTER} target="_blank" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-500 hover:text-white transition"><i className="fa-brands fa-twitter"></i></a>
             <a href={COMMUNITY_LINKS.TELEGRAM} target="_blank" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-500 hover:text-white transition"><i className="fa-brands fa-telegram"></i></a>
             <a href={COMMUNITY_LINKS.DISCORD} target="_blank" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-500 hover:text-white transition"><i className="fa-brands fa-discord"></i></a>
          </div>
          <p>© 2024 ChonkPump Protocol. Not financial advice. Just vibes.</p>
       </footer>
    </div>
  );
}

export default App;
