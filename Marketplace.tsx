
import React from 'react';
import { Product, Vendor, CartItem } from './types';
import { CATEGORIES, CAMPUSES } from './constants';

interface MarketplaceProps {
  products: Product[];
  vendors: Vendor[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeCampus: string;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (productId: string) => void;
}

const Badge = ({ children, color = 'zinc' }: { children: React.ReactNode, color?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
    color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
    color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' :
    'bg-zinc-100 text-zinc-600 border-zinc-200'
  }`}>
    {children}
  </span>
);

export const MarketplaceCard: React.FC<{ 
  product: Product, 
  vendor?: Vendor, 
  onAdd: (p: Product) => void,
  onSelect: (id: string) => void 
}> = ({ product, vendor, onAdd, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(product.id)}
      className="group bg-white rounded-[32px] border border-zinc-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col p-4 md:p-5 card-hover cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-zinc-50">
        <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
        <div className="absolute top-4 left-4">
          <Badge color={product.condition === 'New' ? 'emerald' : 'zinc'}>{product.condition}</Badge>
        </div>
        {product.status === 'Flagged' && (
           <div className="absolute inset-0 bg-red-600/20 backdrop-blur-[4px] flex items-center justify-center p-6 text-center">
              <span className="bg-red-600 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-2xl">Under Protocol Review</span>
           </div>
        )}
      </div>
      <div className="pt-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{product.category}</p>
          </div>
          {vendor?.isVerified && (
            <div className="flex items-center text-indigo-500 group/v relative">
              <i className="fas fa-shield-check text-xs"></i>
              <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover/v:opacity-100 transition-opacity bg-zinc-950 text-white text-[8px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap uppercase font-black">Verified Peer</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-black text-zinc-950 mb-2 truncate tracking-tight">{product.name}</h3>
        <p className="text-[11px] text-zinc-400 mb-6 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
        <div className="mt-auto flex justify-between items-center pt-5 border-t border-zinc-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Asset Value</span>
            <span className="text-2xl font-black text-zinc-950 tracking-tighter">${product.price}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(product); }} 
              className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center hover:bg-amber-400 hover:text-zinc-950 transition-all shadow-xl shadow-zinc-200 active:scale-90"
            >
              <i className="fas fa-plus text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketplaceView: React.FC<MarketplaceProps> = (props) => {
  const currentCampus = CAMPUSES.find(c => c.id === props.activeCampus);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Sidebar Navigation & Pulse */}
        <aside className="w-full lg:w-80 space-y-12">
          <div>
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-8">Node Selection</h2>
            <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 mb-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white text-xs font-black">{currentCampus?.shortName.charAt(0)}</div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active Cluster</p>
                    <p className="text-xs font-black text-zinc-950">{currentCampus?.name}</p>
                  </div>
               </div>
               <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
               </div>
            </div>
            
            <nav className="space-y-2">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-4 mt-12">Categories</p>
              {['All', ...CATEGORIES].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => props.setActiveCategory(cat)} 
                  className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    props.activeCategory === cat ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden lg:block pt-8 border-t border-zinc-100">
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-8">Campus Pulse</h2>
            <div className="space-y-6">
               {[
                 { user: 'S. Amartey', action: 'Listed M2 iPad Pro', time: '2m', type: 'list' },
                 { user: 'K. Owusu', action: 'Purchased Calc 101', time: '14m', type: 'buy' },
                 { user: 'M. Chen', action: 'Verified new store', time: '1h', type: 'vendor' },
               ].map((pulse, i) => (
                 <div key={i} className="flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${pulse.type === 'list' ? 'bg-indigo-500' : pulse.type === 'buy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-zinc-950 uppercase">{pulse.user}</p>
                      <p className="text-[11px] text-zinc-500 font-medium leading-tight">{pulse.action}</p>
                      <p className="text-[9px] font-black text-zinc-300 mt-1 uppercase tracking-widest">{pulse.time} ago</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter mb-4">Market Terminal</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{props.products.length} cluster assets online</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {props.products.map(p => (
              <MarketplaceCard 
                key={p.id} 
                product={p} 
                vendor={props.vendors.find(v => v.vendorId === p.vendorId)} 
                onAdd={props.onAddToCart} 
                onSelect={props.onSelectProduct}
              />
            ))}
            {props.products.length === 0 && (
              <div className="col-span-full py-40 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 text-3xl mb-6"><i className="fas fa-ghost"></i></div>
                 <h3 className="text-xl font-black text-zinc-950 uppercase tracking-widest">Ghost Node</h3>
                 <p className="text-zinc-400 font-medium mt-2">No assets matching this filter signature.</p>
                 <button onClick={() => props.setActiveCategory('All')} className="mt-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">Clear Protocol Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
