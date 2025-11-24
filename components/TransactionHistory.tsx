import React from 'react';
import { MOCK_TRANSACTIONS } from '../constants';

const TransactionHistory: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl animate-[fadeIn_0.5s_ease-out_0.2s] transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <i className="fa-solid fa-bolt text-yellow-500"></i> Recent Activity
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full animate-pulse">
                Live
            </span>
        </div>
        <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition group cursor-default border border-transparent hover:border-white/50 dark:hover:border-white/10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-md transition-transform group-hover:scale-110 ${tx.type === 'buy' ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-rose-600'}`}>
                        <i className={`fa-solid ${tx.type === 'buy' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                    </div>
                    <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{tx.user}</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{tx.type} • {tx.time}</div>
                    </div>
                </div>
                <span className={`font-mono font-black ${tx.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'buy' ? '+' : '-'}{tx.amount}
                </span>
            </div>
            ))}
        </div>
    </div>
  );
};

export default TransactionHistory;