import React, { useState } from 'react';
import { STAKING_APY } from '../constants';

interface StakingProps {
  walletBalance: number;
  stakedBalance: number;
  rewards: number;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
  onClaim: () => void;
}

const Staking: React.FC<StakingProps> = ({ 
  walletBalance, 
  stakedBalance, 
  rewards, 
  onStake, 
  onUnstake, 
  onClaim 
}) => {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Confirmation State
  const [confirmation, setConfirmation] = useState<{ isOpen: boolean; type: 'stake' | 'unstake'; amount: number } | null>(null);

  const handlePercentageClick = (percent: number) => {
    const base = activeTab === 'stake' ? walletBalance : stakedBalance;
    const amount = Math.floor(base * percent);
    setInputValue(amount.toString());
  };

  const handleAction = () => {
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) return;

    setConfirmation({
      isOpen: true,
      type: activeTab,
      amount: amount
    });
  };

  const confirmAction = () => {
    if (!confirmation) return;

    if (confirmation.type === 'stake') {
      onStake(confirmation.amount);
    } else {
      onUnstake(confirmation.amount);
    }

    setConfirmation(null);
    setInputValue('');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const cancelAction = () => {
    setConfirmation(null);
  };

  const handleClaimClick = () => {
    if (rewards <= 0) return;
    onClaim();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Confirmation Modal */}
      {confirmation?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-[scaleIn_0.2s_ease-out] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${confirmation.type === 'stake' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}></div>
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg ${confirmation.type === 'stake' ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600'}`}>
                    <i className={`fa-solid ${confirmation.type === 'stake' ? 'fa-lock' : 'fa-unlock'} text-3xl`}></i>
                </div>
                {/* Specifically request "Are you sure?" title */}
                <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Are you sure?</h3>
                <p className="text-slate-500 mb-8 font-medium text-center leading-relaxed">
                    You are about to {confirmation.type === 'stake' ? 'lock' : 'withdraw'}<br/>
                    <span className="text-3xl font-black text-slate-800 tracking-tight">{confirmation.amount.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400 ml-1">CHONK</span>
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={cancelAction}
                        className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmAction}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${confirmation.type === 'stake' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-500/30' : 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/30'}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Stats Header - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* APY Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
              <i className="fa-solid fa-chart-line text-6xl text-green-500 transform rotate-12"></i>
           </div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                <i className="fa-solid fa-percent"></i>
              </div>
              <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Annual Yield</span>
           </div>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black text-slate-800">{STAKING_APY}</span>
             <span className="text-lg font-bold text-green-500">%</span>
           </div>
           <div className="mt-2 text-xs font-bold text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-lg">
              Dynamic Rate
           </div>
        </div>

        {/* Total Staked Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group">
           <div className="absolute -bottom-4 -right-4 opacity-10">
              <i className="fa-solid fa-vault text-8xl transform -rotate-12"></i>
           </div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-violet-300 shadow-inner border border-white/10">
                <i className="fa-solid fa-lock"></i>
              </div>
              <span className="text-violet-200 font-bold uppercase text-xs tracking-wider">Total Staked</span>
           </div>
           <div className="text-3xl lg:text-4xl font-black tracking-tight mb-1">
             {stakedBalance.toLocaleString()}
           </div>
           <div className="text-slate-400 text-sm font-medium">CHONK9K Locked</div>
        </div>

        {/* Pending Rewards Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
           <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm">
                  <i className="fa-solid fa-coins"></i>
                </div>
                <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Rewards</span>
              </div>
           </div>
           
           <div className="mb-4">
             <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 font-mono">
                {rewards.toFixed(6)}
             </div>
             <div className="text-xs text-slate-400 font-bold">Unclaimed CHONK</div>
           </div>

           <button 
             onClick={handleClaimClick}
             disabled={rewards <= 0}
             className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transform transition active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
             <i className="fa-solid fa-gift"></i> Claim All Rewards
           </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="glass-panel rounded-[2.5rem] p-1 shadow-xl relative overflow-hidden border border-white/60">
        {isAnimating && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 bg-white/30 backdrop-blur-[2px]">
             <i className={`fa-solid ${activeTab === 'stake' ? 'fa-lock' : 'fa-lock-open'} text-6xl text-slate-800 animate-bounce`}></i>
           </div>
        )}

        <div className="bg-white/50 rounded-[2rem] p-6 md:p-10">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
             <div className="bg-slate-100 p-1.5 rounded-2xl flex relative w-full max-w-md shadow-inner">
                <button
                  onClick={() => { setActiveTab('stake'); setInputValue(''); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 ${
                    activeTab === 'stake' ? 'text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-down"></i> Deposit
                  </span>
                  {activeTab === 'stake' && (
                    <div className="absolute inset-0 bg-white rounded-xl transition-all"></div>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('unstake'); setInputValue(''); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 ${
                    activeTab === 'unstake' ? 'text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                   <span className="relative z-10 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-up"></i> Withdraw
                  </span>
                  {activeTab === 'unstake' && (
                    <div className="absolute inset-0 bg-white rounded-xl transition-all"></div>
                  )}
                </button>
             </div>
          </div>

          <div className="max-w-xl mx-auto">
             {/* Balance Display */}
             <div className="flex justify-between items-end mb-4 px-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                  {activeTab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
                </label>
                <div className="text-right">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">Available Balance</div>
                   <div className="font-mono font-bold text-slate-800">
                     {(activeTab === 'stake' ? walletBalance : stakedBalance).toLocaleString()} <span className="text-slate-400 text-xs">CHONK</span>
                   </div>
                </div>
             </div>

             {/* Input Field */}
             <div className="relative mb-6">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-6 pr-24 text-3xl font-black text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition placeholder-slate-200"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <button 
                     onClick={() => handlePercentageClick(1.0)}
                     className="bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                   >
                     MAX
                   </button>
                </div>
             </div>

             {/* Percentage Buttons */}
             <div className="grid grid-cols-4 gap-3 mb-8">
                 {[25, 50, 75].map((pct) => (
                    <button 
                      key={pct}
                      onClick={() => handlePercentageClick(pct / 100)} 
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition text-sm hover:scale-105 active:scale-95 border border-slate-100"
                    >
                      {pct}%
                    </button>
                 ))}
                 <button 
                    onClick={() => handlePercentageClick(1.0)} 
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition text-sm hover:scale-105 active:scale-95 border border-slate-200"
                 >
                    100%
                 </button>
             </div>

             {/* Action Button */}
             <button
                onClick={handleAction}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transform transition active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden ${
                  activeTab === 'stake'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-violet-500/40'
                    : 'bg-white border-2 border-slate-100 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {activeTab === 'stake' && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>}
                
                {activeTab === 'stake' ? (
                  <><i className="fa-solid fa-lock"></i> STAKE TOKENS</>
                ) : (
                  <><i className="fa-solid fa-unlock"></i> UNSTAKE TOKENS</>
                )}
              </button>

              <div className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-3">
                 <i className="fa-solid fa-circle-info text-blue-400 mt-1"></i>
                 <p className="text-sm text-blue-800/70 font-medium leading-relaxed">
                    {activeTab === 'stake' 
                      ? 'Staking locks your tokens in the smart contract. You will earn rewards based on the current dynamic APY. You can unstake at any time without penalty.' 
                      : 'Unstaking will transfer tokens back to your wallet immediately. Any pending rewards will be automatically claimed during this transaction.'}
                 </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;