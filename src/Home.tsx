
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from './types.ts';
import { MarketplaceCard } from './Marketplace.tsx';

interface HomeProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export const HomeView: React.FC<HomeProps> = ({ products, onSelectProduct }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden bg-[#0a0a0b]">
      {/* Hero Section - The "Epicenter" */}
      <section className="relative min-h-[90vh] flex items-center px-4 pt-32 pb-20 overflow-hidden">
        {/* Background Asset */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.png"
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/0 via-[#0a0a0b]/80 to-[#0a0a0b]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-16 stagger-in">
            <div className="inline-flex items-center glass-dark px-6 py-2 rounded-full mb-10 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Marketplace Community Live</p>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-8">
              Elevate Your <br />
              <span className="text-gradient-gold">Experience.</span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              A premium, secure marketplace designed for the modern student community. Verified trades, superior assets, effortless exchange.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button
                onClick={() => navigate('/marketplace')}
                className="group relative bg-white text-zinc-950 px-12 py-5 rounded-xl font-black text-xs uppercase tracking-widest overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <span className="relative z-10">Enter Marketplace</span>
              </button>

              <button
                onClick={() => navigate('/vendor/onboarding')}
                className="group relative bg-[#1a1a1c] text-white border border-white/10 px-12 py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-zinc-950 transition-all"
              >
                Start Selling
              </button>
            </div>
          </div>

          {/* Floating Hero Assets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
            <div className="glass-dark rounded-[32px] p-6 border border-white/5 hover:border-white/20 transition-all group hover:-translate-y-2 duration-500">
              <img src="/assets/laptop.png" className="w-full aspect-[4/3] object-cover rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-700" alt="Tech" />
              <h3 className="text-xl font-black text-white mb-2">High-End Compute</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Premium Items Online</p>
            </div>
            <div className="glass-dark rounded-[32px] p-6 border border-white/5 hover:border-white/20 transition-all group hover:-translate-y-2 duration-500 md:mt-8">
              <img src="/assets/gear.png" className="w-full aspect-[4/3] object-cover rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-700" alt="Gear" />
              <h3 className="text-xl font-black text-white mb-2">Student Essentials</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Verified Daily Gear</p>
            </div>
            <div className="glass-dark rounded-[32px] p-6 border border-white/5 hover:border-white/20 transition-all group hover:-translate-y-2 duration-500">
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl mb-8 flex items-center justify-center text-5xl text-white font-black group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                $
              </div>
              <h3 className="text-xl font-black text-white mb-2">Fast Liquidity</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Instant Marketplace Payouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Bento Experience - Feature Grid */}
      <section className="py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[250px] md:auto-rows-[280px]">
            {/* Main Feature - 8/12 - Glassmorphism Highlight */}
            <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden bg-[#121214] rounded-[32px] border border-white/5 p-8 md:p-12 flex flex-col justify-end">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white text-3xl mb-10 shadow-[0_20px_50px_rgba(99,102,241,0.5)]">
                  <i className="fas fa-fingerprint"></i>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-6 tracking-tighter leading-none">Classmate <br /> DNA.</h3>
                <p className="text-zinc-400 text-lg max-w-xl font-medium leading-relaxed mb-8">
                  Our proprietary safety check ensures every user is a verified student. Trust is built into every byte of the community.
                </p>
                <div className="flex gap-4">
                  <span className="px-5 py-2 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase text-indigo-400">Reputation Score 4.9+</span>
                  <span className="px-5 py-2 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase text-amber-400">Verified ID Only</span>
                </div>
              </div>
            </div>

            {/* Side Card 1 - 4/12 - Safe Spots */}
            <div className="md:col-span-4 md:row-span-1 bg-gradient-to-br from-zinc-900 to-black rounded-[32px] border border-white/5 p-8 flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-700">
              <div>
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Secure Exchange</h4>
                <h3 className="text-2xl font-black text-white">Designated Hubs</h3>
              </div>
              <div className="flex items-center justify-between text-zinc-500 text-sm font-medium">
                <p>Campus safe zones for physical item inspection and handover.</p>
                <i className="fas fa-map-marker-alt text-2xl group-hover:text-amber-400 transition-colors"></i>
              </div>
            </div>

            {/* Side Card 2 - 4/12 - Escrow */}
            <div className="md:col-span-4 md:row-span-1 bg-white rounded-[32px] p-8 flex flex-col justify-between shadow-xl group hover:scale-[1.02] transition-transform duration-700">
              <div className="w-14 h-14 bg-[#0a0a0b] text-white rounded-2xl flex items-center justify-center text-xl">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="mt-8">
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Funds are locked securely until both parties confirm a successful trade handover.</p>
              </div>
            </div>

            {/* Bottom Wide - 12/12 - Reputation system */}
            <div className="md:col-span-12 md:row-span-1 glass-dark rounded-[32px] border border-white/5 p-8 md:px-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white mb-6">Community Reputation Scores</h3>
                <p className="text-zinc-400 text-lg max-w-2xl font-medium">We analyze interaction history, fulfillment velocity, and community feedback to maintain a high-frequency, low-friction marketplace.</p>
              </div>
              <div className="flex gap-12 items-center">
                <div className="text-center">
                  <p className="text-4xl font-black text-white mb-1">98%</p>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Satisfaction</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-indigo-400 mb-1">1.2k</p>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Daily Swaps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 px-4 bg-[#0d0d0f]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Curated Selection</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Featured Listings.</h2>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-3 group"
            >
              View All Assets
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <MarketplaceCard
                key={product.id}
                product={product}
                onAdd={() => { }} // Handle additive logic if needed, or just navigate
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final Terminal CTA */}
      <section className="px-4 py-40">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#121214] to-black rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border border-white/5 shadow-inner-glow group">
          <div className="relative z-10">
            <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mb-10">Unified Trading System</p>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-12">
              Join the <br /> Network.
            </h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-white text-zinc-950 px-16 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Launch Terminal
            </button>
          </div>

          {/* Background FX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-500/10 blur-[180px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600/10 blur-[120px] rounded-full group-hover:translate-x-10 transition-transform"></div>
        </div>
      </section>
    </div>
  );
};
