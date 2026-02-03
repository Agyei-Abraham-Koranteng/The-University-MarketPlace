
import React, { useState } from 'react';
import { Vendor, Product, Profile } from './types';
import { WalletView } from './WalletView';

interface VendorDashboardProps {
  vendor: Vendor;
  products: Product[];
  onWithdrawal: (amount: number, method: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor, products, onWithdrawal }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'inventory' | 'wallet' | 'orders'>('monitor');

  const vendorProducts = products.filter(p => p.vendorId === vendor.vendorId);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-zinc-50">
      <aside className="w-full lg:w-80 bg-zinc-950 text-zinc-400 p-8 flex flex-col gap-10">
        <div>
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-8 px-4">Active Store</h4>
          <nav className="space-y-3">
            {[
              { id: 'monitor', icon: 'fa-gauge-high', label: 'Monitor' },
              { id: 'inventory', icon: 'fa-boxes-stacked', label: 'Inventory' },
              { id: 'wallet', icon: 'fa-vault', label: 'Wallet' },
              { id: 'orders', icon: 'fa-clipboard-list', label: 'Inbound' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-5 px-5 py-4 rounded-[24px] transition-all group ${activeTab === tab.id ? 'bg-white/10 text-white border border-white/10 shadow-3xl shadow-white/5 backdrop-blur-md' : 'hover:text-white'
                  }`}
              >
                <i className={`fas ${tab.icon} w-5 text-sm transition-transform group-hover:rotate-6 ${activeTab === tab.id ? 'text-amber-400' : ''}`}></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto bg-white/5 p-8 rounded-[32px] border border-white/10">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Store Status</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[92%]"></div>
            </div>
            <span className="text-[10px] font-black text-white">92%</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-14 overflow-y-auto no-scrollbar">
        {activeTab === 'monitor' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-between items-end mb-14">
              <div>
                <h2 className="text-3xl font-black text-zinc-950 tracking-tighter">Store Monitor</h2>
                <p className="text-zinc-400 text-xs font-bold mt-2 uppercase tracking-widest">Active Store: {vendor.storeName}</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-white border border-zinc-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Store View</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Total Volume', value: `$${(vendor.totalSales * 12).toFixed(0)}`, icon: 'fa-chart-line', color: 'indigo' },
                { label: 'Active Assets', value: vendorProducts.length.toString(), icon: 'fa-cube', color: 'amber' },
                { label: 'Merchant Rating', value: vendor.rating.toFixed(1), icon: 'fa-star', color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 mb-8`}><i className={`fas ${stat.icon} text-lg`}></i></div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-zinc-950 tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[40px] border border-zinc-100 p-10 relative overflow-hidden">
              <h3 className="text-lg font-black text-zinc-950 mb-10 tracking-tight">Recent Signals</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><i className="fas fa-shopping-cart"></i></div>
                  <div className="flex-1"><p className="text-sm font-bold text-zinc-900">New Sale: Advanced Calculus</p><p className="text-[10px] text-zinc-400">2 hours ago</p></div>
                  <p className="text-sm font-black text-indigo-600">+$45.00</p>
                </div>
                <div className="flex items-center gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><i className="fas fa-comment"></i></div>
                  <div className="flex-1"><p className="text-sm font-bold text-zinc-900">New Review from Samuel</p><p className="text-[10px] text-zinc-400">5 hours ago</p></div>
                  <div className="flex text-amber-400 text-[10px]"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <WalletView vendor={vendor} onWithdrawalRequest={onWithdrawal} />
        )}

        {activeTab === 'inventory' && (
          <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-14">
              <h2 className="text-3xl font-black text-zinc-950 tracking-tighter">Inventory Control</h2>
              <button className="bg-zinc-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">+ New Asset</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {vendorProducts.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col group hover:shadow-xl transition-all">
                  <img src={p.imageUrl} className="w-full aspect-square rounded-[32px] object-cover mb-8 shadow-inner" alt="" />
                  <h4 className="font-black text-lg text-zinc-950 mb-2 truncate tracking-tight">{p.name}</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.category}</p>
                    <p className="text-xl font-black text-zinc-950">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
