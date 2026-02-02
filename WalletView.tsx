
import React, { useState } from 'react';
import { Vendor, Transaction } from './types';

interface WalletViewProps {
  vendor: Vendor;
  onWithdrawalRequest: (amount: number, method: string) => void;
}

const Badge = ({ children, status }: { children: React.ReactNode, status?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
    status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
    status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
    status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
    'bg-zinc-100 text-zinc-600 border-zinc-200'
  }`}>
    {children}
  </span>
);

export const WalletView: React.FC<WalletViewProps> = ({ vendor, onWithdrawalRequest }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Mobile Money (Mtn)');

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= vendor.wallet.availableBalance) {
      onWithdrawalRequest(withdrawAmount, method);
      setIsWithdrawing(false);
      setAmount('');
    } else {
      alert("Invalid amount or insufficient funds.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Balance Cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-black text-zinc-950 tracking-tighter">Finance Hub</h2>
          <p className="text-zinc-400 text-xs font-bold mt-2 uppercase tracking-widest">Global Node Wallet: {vendor.storeName}</p>
        </div>
        <button 
          onClick={() => setIsWithdrawing(true)}
          className="bg-zinc-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
        >
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Available Assets</p>
            <h3 className="text-4xl font-black text-zinc-950 tracking-tighter">${vendor.wallet.availableBalance.toFixed(2)}</h3>
            <p className="text-[10px] font-bold text-emerald-500 mt-4 flex items-center">
              <i className="fas fa-check-circle mr-2"></i> Ready for Payout
            </p>
          </div>
          <i className="fas fa-wallet absolute -bottom-6 -right-6 text-zinc-50 text-8xl group-hover:rotate-12 transition-transform"></i>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Escrow Pending</p>
            <h3 className="text-4xl font-black text-zinc-950 tracking-tighter">${vendor.wallet.pendingBalance.toFixed(2)}</h3>
            <p className="text-[10px] font-bold text-amber-500 mt-4 flex items-center">
              <i className="fas fa-clock mr-2"></i> In Security Buffer
            </p>
          </div>
          <i className="fas fa-shield-halved absolute -bottom-6 -right-6 text-zinc-50 text-8xl group-hover:rotate-12 transition-transform"></i>
        </div>

        <div className="bg-zinc-950 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Total Extracted</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">${vendor.wallet.totalWithdrawn.toFixed(2)}</h3>
            <p className="text-[10px] font-bold text-zinc-400 mt-4 flex items-center">
              <i className="fas fa-arrow-up-right-from-square mr-2"></i> Historical Pulse
            </p>
          </div>
          <i className="fas fa-vault absolute -bottom-6 -right-6 text-white/5 text-8xl group-hover:rotate-12 transition-transform"></i>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[56px] border border-zinc-100 shadow-sm overflow-hidden p-4">
        <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-zinc-950 tracking-tight">Ledger Feed</h3>
          <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-950">Export PDF</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-50">
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">ID / Trace</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Operation</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Capital</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {vendor.wallet.transactions.length > 0 ? vendor.wallet.transactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50/50 transition-all group">
                <td className="px-10 py-8">
                  <p className="text-xs font-black text-zinc-400 font-mono">#{t.id.slice(-6)}</p>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                      t.type === 'Sale' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      <i className={`fas ${t.type === 'Sale' ? 'fa-cart-shopping' : 'fa-money-bill-transfer'}`}></i>
                    </div>
                    <p className="text-sm font-bold text-zinc-900">{t.type}</p>
                  </div>
                </td>
                <td className="px-10 py-8 text-sm font-black text-zinc-950">
                  {t.type === 'Withdrawal' ? '-' : '+'}${t.amount.toFixed(2)}
                </td>
                <td className="px-10 py-8 text-xs font-bold text-zinc-400">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-10 py-8">
                  <Badge status={t.status}>{t.status}</Badge>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center opacity-20">
                  <p className="text-[10px] font-black uppercase tracking-widest">Zero Operations Logged</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawing && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" onClick={() => setIsWithdrawing(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-4xl p-12 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-zinc-950 tracking-tighter mb-8 text-center">Protocol: Withdrawal</h3>
            
            <form onSubmit={handleWithdrawal} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Extraction Amount ($)</label>
                <div className="relative">
                  <input 
                    required
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl px-8 py-6 text-2xl font-black focus:ring-2 focus:ring-indigo-600 outline-none placeholder:text-zinc-200" 
                  />
                  <div className="absolute right-6 top-6 text-zinc-300 font-bold uppercase text-[10px]">Max: ${vendor.wallet.availableBalance.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Settlement Method</label>
                <select 
                  value={method} 
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option>Mobile Money (Mtn)</option>
                  <option>Mobile Money (Telecel)</option>
                  <option>Bank Wire (Swift)</option>
                  <option>Campus Pickup (Cash)</option>
                </select>
              </div>

              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center">
                  <i className="fas fa-triangle-exclamation mr-2"></i> Security Protocol
                </p>
                <p className="text-[11px] font-medium text-amber-700 mt-2 leading-relaxed">
                  Funds will be verified by the admin layer. Estimated arrival: 1-4 campus hours.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsWithdrawing(false)} 
                  className="flex-1 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-2 bg-zinc-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 px-8"
                >
                  Execute Extraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
