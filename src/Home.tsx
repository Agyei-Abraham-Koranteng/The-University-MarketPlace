
import React from 'react';
import { View } from './types';

interface HomeProps {
  onEnterMarket: () => void;
  onStartSelling: () => void;
}

export const HomeView: React.FC<HomeProps> = ({ onEnterMarket, onStartSelling }) => (
  <div className="overflow-hidden bg-white">
    {/* Hero - The "Command Center" */}
    <section className="relative min-h-screen flex items-center px-4 pt-20 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">

        {/* Left Column: Vision */}
        <div className="lg:col-span-7 stagger-in">
          <div className="inline-flex items-center glass border border-zinc-100 px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-2.5"></span>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Node Cluster: v2.5 Stable</p>
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-zinc-950 tracking-tight leading-[0.85] mb-10">
            Unify Your <br />
            <span className="text-gradient-indigo">Campus.</span>
          </h1>

          <p className="text-zinc-500 text-lg md:text-xl mb-12 max-w-xl font-medium leading-relaxed">
            The hyper-local commerce protocol for the university elite. Secure trades, verified classmates, and the ultimate dorm-to-dorm supply chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={onEnterMarket}
              className="group relative bg-zinc-950 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-3xl shadow-zinc-200"
            >
              <span className="relative z-10">Initialize Market</span>
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>

            <button
              onClick={onStartSelling}
              className="bg-white text-zinc-950 border-2 border-zinc-100 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-zinc-950 hover:bg-zinc-50 transition-all"
            >
              Liquidate Assets
            </button>
          </div>

          <div className="mt-20 flex items-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-12 h-12 rounded-full border-4 border-white object-cover" />
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black">+42</div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Trade flow: Active across clusters</p>
          </div>
        </div>

        {/* Right Column: Visual Component */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            {/* The "Radar" Component */}
            <div className="w-[500px] h-[500px] rounded-full border border-zinc-100 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-zinc-50 scale-75"></div>
              <div className="absolute inset-0 rounded-full border border-zinc-50 scale-50"></div>

              <div className="w-24 h-24 bg-zinc-950 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl z-10">U</div>

              {/* Floating Node Points */}
              <div className="absolute top-10 right-20 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 animate-bounce transition-all duration-[3s]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"><i className="fas fa-microchip"></i></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase">New Asset</p>
                    <p className="text-xs font-bold text-zinc-950">MacBook M3 Pro</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-10 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 animate-pulse transition-all duration-[4s]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs"><i className="fas fa-check-circle"></i></div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase">Verified Trade</p>
                    <p className="text-xs font-bold text-zinc-950">Legon Safe Spot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 -z-10 skew-x-[-8deg] border-l border-zinc-100"></div>
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
    </section>

    {/* The "Pulse" - Marquee with Style */}
    <div className="relative z-30 overflow-hidden">
      <div className="bg-zinc-950 text-white py-12 rotate-[-1deg] w-[110%] -ml-[5%] shadow-[0_20px_50px_rgba(0,0,0,0.3)] ticker-mask">
        <div className="flex animate-ticker whitespace-nowrap">
          {/* Duplicate for infinite loop */}
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-12 px-8">
                  <span className="text-zinc-500 font-black tracking-widest text-[9px] uppercase">Node Status: Active</span>
                  <span className="text-amber-400 font-black uppercase tracking-widest text-[11px] flex items-center">
                    <i className="fas fa-bolt mr-3"></i> $14,200 Traded in last hour
                  </span>
                  <span className="text-zinc-800 font-black">•</span>
                  <span className="text-indigo-400 font-black uppercase tracking-widest text-[11px] flex items-center">
                    <i className="fas fa-link mr-3"></i> Verified 1.2k Handshakes
                  </span>
                  <span className="text-zinc-800 font-black">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bento Feature Section */}
    <section className="py-40 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter leading-none mb-6">Built for the <br /> Network Hubs.</h2>
            <p className="text-zinc-400 text-lg font-medium">Standard e-commerce is broken for students. We fixed it with local protocols.</p>
          </div>
          <div className="hidden md:block pb-2">
            <i className="fas fa-chevron-down text-zinc-200 text-4xl animate-bounce"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-zinc-50 rounded-[56px] p-12 md:p-16 flex flex-col justify-between group hover:bg-zinc-950 transition-colors duration-700">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-zinc-950 text-3xl group-hover:bg-amber-400 transition-colors">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="mt-20">
              <h3 className="text-3xl font-black text-zinc-950 group-hover:text-white mb-4 transition-colors">Classmate Verification</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400 text-lg max-w-lg transition-colors">Every user must authenticate with a valid university domain. We track reputation across semesters to ensure high-fidelity interactions.</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-indigo-600 rounded-[56px] p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-6">Fast Handover</h3>
              <p className="text-indigo-100">Coordinate trades in 5 minutes at verified campus safe spots.</p>
            </div>
            <div className="mt-12 text-6xl opacity-20 group-hover:scale-110 transition-transform">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="absolute inset-0 bg-zinc-950 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
          </div>

          <div className="md:col-span-4 bg-zinc-950 rounded-[56px] p-12 md:p-16 text-white flex flex-col justify-between">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 text-2xl">
              <i className="fas fa-vault"></i>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-black mb-4">Escrow Ledger</h3>
              <p className="text-zinc-500">Capital stays protected until you confirm the asset is in your hands.</p>
            </div>
          </div>

          <div className="md:col-span-8 bg-zinc-50 rounded-[56px] p-12 md:p-16 flex items-center gap-12 group hover:bg-emerald-50 transition-all duration-500">
            <div className="hidden sm:block w-1/3 aspect-square bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1543004471-2401c3e18a9a?w=400&h=400&fit=crop" className="w-full h-full object-cover scale-110 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-black text-zinc-950 mb-4 tracking-tight">Node Optimized</h3>
              <p className="text-zinc-500 text-lg">Inventory tailored specifically to your campus syllabus and culture. From chemistry kits to party gear.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Final Terminal CTA */}
    <section className="px-4 py-40">
      <div className="max-w-7xl mx-auto glass-dark rounded-[80px] p-12 md:p-32 text-center relative overflow-hidden shadow-4xl group">
        <div className="relative z-10">
          <p className="text-amber-400 font-black uppercase tracking-[0.4em] text-[10px] mb-8">Ready for Operation</p>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-12">
            Initiate Your <br /> Campus Store.
          </h2>
          <button
            onClick={onEnterMarket}
            className="bg-white text-zinc-950 px-16 py-8 rounded-[32px] font-black text-xl uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            Launch Hub
          </button>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/20 blur-[180px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 blur-[120px] rounded-full"></div>
      </div>
    </section>

    {/* Minimalist Tech Footer */}
    <footer className="bg-white py-24 px-4 border-t border-zinc-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-zinc-950 text-white p-2 rounded-xl font-black text-xl">U</div>
            <span className="font-extrabold text-2xl tracking-tighter text-zinc-950">UniMall</span>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">© 2024 Node-Protocol Group</p>
        </div>

        <div className="flex flex-wrap gap-12">
          {['Terminals', 'Protocols', 'Identities', 'Ledger'].map(link => (
            <button key={link} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">{link}</button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-all cursor-pointer"><i className="fab fa-discord"></i></div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-all cursor-pointer"><i className="fab fa-x-twitter"></i></div>
        </div>
      </div>
    </footer>
  </div>
);
