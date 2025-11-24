
import React, { useState, useEffect } from 'react';
import { AppSection } from './types';
import { MOCK_TRANSACTIONS, TOKEN_MINT_ADDRESS, POOL_ADDRESS, BUY_LINK, SELL_LINK, POOL_EXPLORER_URL, GECKOTERMINAL_API_URL } from './constants';
import PumpChart from './components/PumpChart';
import Oracle from './components/Oracle';
import ChonkRater from './components/ChonkRater';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [pumpCount, setPumpCount] = useState(0);
  const [isPumping, setIsPumping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [marketCap, setMarketCap] = useState<string>('Loading...');

  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        const response = await fetch(GECKOTERMINAL_API_URL);
        const data = await response.json();
        // Try to get FDV or Market Cap from attributes
        const fdv = data?.data?.attributes?.fdv_usd || data?.data?.attributes?.market_cap_usd;
        
        if (fdv) {
          setMarketCap(
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(parseFloat(fdv))
          );
        } else {
          setMarketCap('$420.69K'); // Fallback meme value
        }
      } catch (error) {
        console.error("Error fetching market cap:", error);
        setMarketCap('$420.69K'); // Fallback meme value
      }
    };

    if (activeSection === AppSection.DASHBOARD) {
      fetchMarketCap();
    }
  }, [activeSection]);

  const handlePump = () => {
    setPumpCount(prev => prev + 1);
    setIsPumping(true);
    setTimeout(() => setIsPumping(false), 150);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-panel shadow-sm px-4 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection(AppSection.DASHBOARD)}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
              C
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 hidden sm:block">Chonk<span className="text-pink-500">Pump</span></h1>
          </div>
          
          <div className="flex gap-2">
            <NavButton 
              active={activeSection === AppSection.DASHBOARD} 
              onClick={() => setActiveSection(AppSection.DASHBOARD)}
              icon="fa-chart-line"
              label="Dashboard"
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
                <div className="inline-block bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-violet-600 mb-4 border border-violet-200">
                  🚀 Real Solana Pool Live
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                  PUMP THE <br/><span className={`inline-block transition-transform duration-150 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 ${isPumping ? 'scale-110' : ''}`}>$CHONK9K</span>
                </h2>
                <p className="text-xl text-slate-700 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
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
                    className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-green-300 animate-pulse"
                  >
                    <i className="fa-solid fa-rocket"></i> PUMP IT!
                  </button>
                  <a 
                    href={BUY_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-pink-500/25 transition shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-coins"></i> BUY
                  </a>
                  <a 
                    href={POOL_EXPLORER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-slate-900 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-lg border-2 border-slate-200 flex items-center gap-2"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Token" value="$CHONK9K" icon="fa-paw" color="bg-pink-100 text-pink-600" animate={isPumping} />
              <StatCard label="Global Pumps" value={pumpCount.toLocaleString()} icon="fa-heart-pulse" color="bg-red-100 text-red-600" animate={isPumping} />
              <StatCard label="Market Cap" value={marketCap} icon="fa-sack-dollar" color="bg-yellow-100 text-yellow-600" />
              <StatCard label="Chain" value="SOLANA" icon="fa-link" color="bg-blue-100 text-blue-600" />
              <StatCard label="Pool" value="LIVE" icon="fa-water" color="bg-green-100 text-green-600" />
              <StatCard label="Oracle" value="ONLINE" icon="fa-eye" color="bg-purple-100 text-purple-600" />
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
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${tx.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${tx.type === 'buy' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      </div>
                      <span className="font-bold text-slate-700">{tx.user}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      <span className={`font-mono font-bold ${tx.type === 'buy' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'buy' ? '+' : '-'}{tx.amount}
                      </span>
                      <div className="flex gap-2 border-l pl-3 border-slate-200">
                        <a 
                          href={BUY_LINK} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                        >
                          BUY
                        </a>
                        <a 
                          href={SELL_LINK} 
                          target="_blank" 
                          rel="noreferrer" 
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
      </main>
    </div>
  );
};

// Helper Components
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'hover:bg-slate-100 text-slate-600'
    }`}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string; animate?: boolean }> = ({ label, value, icon, color, animate }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">{label}</div>
    <div className={`text-2xl font-black text-slate-800 transition-all duration-150 ${animate ? 'scale-125 text-green-500' : ''}`}>{value}</div>
  </div>
);

export default App;
