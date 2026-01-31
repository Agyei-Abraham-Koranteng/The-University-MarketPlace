
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  View, UserRole, Product, Vendor, Profile, 
  CartItem, Message, AuditEntry, VendorApplication, Review, Transaction, AppNotification
} from './types';
import { 
  MOCK_PRODUCTS, MOCK_VENDORS, CAMPUSES, MOCK_DISPUTES, MOCK_REVIEWS 
} from './constants';

import { HomeView } from './Home';
import { AuthView } from './Auth';
import { AdminPanel } from './Admin';
import { MarketplaceView } from './Marketplace';
import { ProductDetailView } from './ProductDetail';
import { VendorOnboardingView } from './VendorOnboarding';
import { VendorDashboard } from './VendorDashboard';

const App: React.FC = () => {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [view, setView] = useState<View>(View.HOME);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [activeCampus, setActiveCampus] = useState<string>('c1');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [siteMaintenance, setSiteMaintenance] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { role: 'assistant', content: "UniMall Scout Online. What cluster asset are we searching for today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Admin Specific state for demo
  const [applications, setApplications] = useState<VendorApplication[]>([
    { 
      id: 'app-1', 
      userId: 'u5', 
      fullName: 'John K. Boateng', 
      email: 'john.b@ug.edu.gh', 
      storeName: 'Legon Tech Fix', 
      university: 'University of Ghana', 
      appliedAt: '2024-05-18', 
      status: 'Pending',
      idNumber: 'UG-10293847',
      documentUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop'
    }
  ]);
  
  const [users, setUsers] = useState<Profile[]>([
    { id: 'u1', email: 'alex@varsity.edu', role: UserRole.VENDOR, fullName: 'Alex Johnson', university: 'Legon', status: 'Active' },
    { id: 'u2', email: 'sarah@campus.edu', role: UserRole.VENDOR, fullName: 'Sarah Chen', university: 'KNUST', status: 'Active' },
    { id: 'admin-001', email: 'admin@unimall.edu.gh', role: UserRole.ADMIN, fullName: 'Platform Admin', university: 'UniMall Global', status: 'Active' }
  ]);

  // --- Handlers ---
  const notify = (message: string, type: AppNotification['type'] = 'info') => {
    const id = `notif-${Date.now()}`;
    setNotifications(prev => [{ id, type, message, timestamp: new Date().toISOString() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const logAudit = (action: string, details: string, severity: 'Low' | 'Medium' | 'High' = 'Low') => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminId: currentUser?.id || 'System',
      action,
      details,
      severity
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const requireAuth = (targetView: View) => {
    if (!currentUser) { setView(View.AUTH); return false; }
    setView(targetView);
    return true;
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    notify(`${product.name} locked into bag.`, 'success');
  };

  const handleAddReview = (partialReview: Partial<Review>) => {
    const newReview: Review = {
      id: `r-${Date.now()}`,
      productId: partialReview.productId!,
      userId: partialReview.userId!,
      userName: partialReview.userName!,
      rating: partialReview.rating!,
      comment: partialReview.comment!,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
    notify("Reputation impact logged.", "success");
    logAudit('New Review', `Review added for product ${newReview.productId}`, 'Low');
  };

  const handleAISearch = async (input: string) => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setAiMessages(prev => [...prev, userMsg]);
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...aiMessages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        config: { systemInstruction: `You are Scout, the UniMall Campus Network AI. You are witty, efficient, and speak in slightly technical 'campus-engine' terms. Help the user find products or explain how to sell.` }
      });
      setAiMessages(prev => [...prev, { role: 'assistant', content: response.text || "Connection bottleneck encountered." }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "Network unstable. Re-routing..." }]);
    } finally { setAiLoading(false); }
  };

  const handleOnboardingSubmit = (partialApp: Partial<VendorApplication>) => {
    if (!currentUser) return;
    const newApp: VendorApplication = {
      id: `app-${Date.now()}`,
      userId: currentUser.id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      university: currentUser.university || 'Unspecified Cluster',
      storeName: partialApp.storeName || 'New Node',
      appliedAt: new Date().toISOString(),
      status: 'Pending',
      documentUrl: partialApp.documentUrl,
      idNumber: partialApp.idNumber
    };
    setApplications(prev => [newApp, ...prev]);
    setView(View.HOME);
    notify("Application submitted for node verification.", "info");
    logAudit('Vendor Application', `User ${currentUser.id} applied for store ${newApp.storeName}`, 'Medium');
  };

  const handleWithdrawalRequest = (amount: number, method: string) => {
    if (!currentUser) return;
    const vendor = vendors.find(v => v.id === currentUser.id);
    if (!vendor) return;

    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString(),
      amount,
      type: 'Withdrawal',
      status: 'Pending',
      method
    };

    setVendors(prev => prev.map(v => {
      if (v.id === currentUser.id) {
        return {
          ...v,
          wallet: {
            ...v.wallet,
            availableBalance: v.wallet.availableBalance - amount,
            transactions: [newTransaction, ...v.wallet.transactions]
          }
        };
      }
      return v;
    }));

    notify("Extraction protocol initiated.", "warning");
    logAudit('Withdrawal Requested', `Vendor ${vendor.storeName} requested payout of $${amount}`, 'Medium');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesCampus = p.campusId === activeCampus;
      return matchesSearch && matchesCategory && matchesCampus;
    });
  }, [products, searchQuery, activeCategory, activeCampus]);

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId), 
  [products, selectedProductId]);

  const currentVendor = useMemo(() => 
    vendors.find(v => v.id === currentUser?.id), 
  [vendors, currentUser]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchOverlay(true);
      }
      if (e.key === 'Escape') {
        setShowSearchOverlay(false);
        setIsAIChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  // --- Core Layout ---
  return (
    <div className="min-h-screen bg-white">
      {/* Global Notifications */}
      <div className="fixed top-24 right-6 z-[200] space-y-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500">
            <div className={`glass px-6 py-4 rounded-2xl shadow-2xl border-l-4 flex items-center space-x-4 ${
              n.type === 'success' ? 'border-emerald-500' :
              n.type === 'warning' ? 'border-amber-500' :
              n.type === 'alert' ? 'border-red-500' : 'border-indigo-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                n.type === 'success' ? 'bg-emerald-500' :
                n.type === 'warning' ? 'bg-amber-500' :
                n.type === 'alert' ? 'bg-red-500' : 'bg-indigo-500'
              } animate-pulse`}></div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-950">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-zinc-100 px-4 md:px-8 h-20 md:h-24 flex justify-between items-center">
        <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setView(View.HOME)}>
          <div className="bg-zinc-950 text-white w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-2xl group-hover:rotate-6 transition-transform">U</div>
          <div className="hidden sm:block">
            <span className="font-black text-2xl tracking-tighter text-zinc-950 block leading-none">UniMall</span>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Campus Protocol</span>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search Cluster... (⌘K)" 
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-3.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-zinc-950 outline-none transition-all" 
              onClick={() => setShowSearchOverlay(true)}
              readOnly
            />
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 text-sm"></i>
          </div>
        </div>

        <div className="flex items-center space-x-6 md:space-x-10">
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => setView(View.MARKETPLACE)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950">Terminal</button>
            {currentUser?.role === UserRole.ADMIN && (
              <button onClick={() => setView(View.ADMIN_PANEL)} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700">Console</button>
            )}
            {currentUser?.role === UserRole.VENDOR && (
              <button onClick={() => setView(View.DASHBOARD)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950">Ops Hub</button>
            )}
          </nav>

          <div className="h-8 w-px bg-zinc-100 hidden sm:block"></div>

          <div className="flex items-center space-x-5">
            <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
              <i className="fas fa-shopping-bag text-xl text-zinc-950 group-hover:scale-110 transition-transform"></i>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-amber-400 text-zinc-950 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">{cart.length}</span>}
            </div>
            {currentUser ? (
               <div className="relative group">
                 <img src={`https://ui-avatars.com/api/?name=${currentUser.fullName}&background=09090b&color=fff&rounded=true`} className="w-10 h-10 rounded-2xl cursor-pointer ring-2 ring-transparent group-hover:ring-zinc-950 transition-all" />
                 <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl shadow-4xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all p-2 overflow-hidden">
                    <button onClick={() => setCurrentUser(null)} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3">
                       <i className="fas fa-sign-out-alt"></i> Terminate
                    </button>
                 </div>
               </div>
            ) : (
               <button onClick={() => setView(View.AUTH)} className="bg-zinc-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Identify</button>
            )}
          </div>
        </div>
      </nav>

      {/* Spotlight Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowSearchOverlay(false)}></div>
          <div className="relative w-full max-w-2xl glass rounded-3xl shadow-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
             <div className="p-6 border-b border-zinc-100 flex items-center space-x-4">
                <i className="fas fa-search text-zinc-400"></i>
                <input 
                  autoFocus 
                  type="text" 
                  placeholder="Search products, nodes, clusters..." 
                  className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-zinc-300" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setShowSearchOverlay(false); }}
                />
             </div>
             <div className="p-4 max-h-96 overflow-y-auto">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 ml-2">Quick Results</p>
                {filteredProducts.slice(0, 5).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { setSelectedProductId(p.id); setView(View.PRODUCT_DETAIL); setShowSearchOverlay(false); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-all group"
                  >
                    <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{p.category} • ${p.price}</p>
                    </div>
                    <i className="fas fa-arrow-right text-zinc-200 group-hover:translate-x-1 group-hover:text-zinc-900 transition-all"></i>
                  </button>
                ))}
                {filteredProducts.length === 0 && <p className="text-center py-10 text-zinc-400 italic font-medium">No cluster matches found.</p>}
             </div>
             <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Type to explore cluster assets</p>
                <div className="flex gap-2">
                   <kbd className="px-2 py-1 bg-white border border-zinc-200 rounded text-[9px] font-black shadow-sm">ESC</kbd>
                   <p className="text-[9px] font-black text-zinc-300 uppercase">to close</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main>
        {view === View.HOME && <HomeView onEnterMarket={() => setView(View.MARKETPLACE)} onStartSelling={() => requireAuth(View.VENDOR_ONBOARDING)} />}
        {view === View.AUTH && (
          <AuthView 
            authMode={authMode} setAuthMode={setAuthMode} 
            activeCampus={activeCampus} setActiveCampus={setActiveCampus}
            onAuthSuccess={user => { 
              const existingAlex = vendors.find(v => v.email === 'alex@varsity.edu');
              if (user.email === 'alex@varsity.edu' && existingAlex) {
                setCurrentUser(existingAlex);
              } else {
                setCurrentUser(user); 
              }
              setView(View.HOME); 
              notify(`Identity ${user.fullName} authorized.`, "success");
            }}
            onClose={() => setView(View.HOME)}
          />
        )}
        {view === View.MARKETPLACE && (
          <MarketplaceView 
            products={filteredProducts} vendors={vendors} 
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            activeCampus={activeCampus} onAddToCart={handleAddToCart}
            onSelectProduct={(id) => { setSelectedProductId(id); setView(View.PRODUCT_DETAIL); }}
          />
        )}
        {view === View.VENDOR_ONBOARDING && currentUser && (
          <VendorOnboardingView 
            currentUser={currentUser}
            onSubmit={handleOnboardingSubmit}
            onCancel={() => setView(View.HOME)}
          />
        )}
        {view === View.DASHBOARD && currentVendor && (
          <VendorDashboard 
            vendor={currentVendor} 
            products={products} 
            onWithdrawal={handleWithdrawalRequest}
          />
        )}
        {view === View.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct}
            vendor={vendors.find(v => v.vendorId === selectedProduct.vendorId)}
            reviews={reviews.filter(r => r.productId === selectedProduct.id)}
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
            onBack={() => setView(View.MARKETPLACE)}
          />
        )}
        {view === View.ADMIN_PANEL && currentUser?.role === UserRole.ADMIN && (
          <AdminPanel 
            currentUser={currentUser} users={users} products={products} vendors={vendors} 
            auditLogs={auditLogs} applications={applications}
            onUpdateUser={u => setUsers(prev => prev.map(item => item.id === u.id ? u : item))}
            onUpdateProduct={p => setProducts(prev => prev.map(item => item.id === p.id ? p : item))}
            onDeleteProduct={id => setProducts(prev => prev.filter(item => item.id !== id))}
            onApproveApplication={id => {
              setApplications(prev => prev.map(a => a.id === id ? {...a, status: 'Approved'} : a));
              notify("Vendor authorized for cluster.", "success");
            }}
            onRejectApplication={id => {
              setApplications(prev => prev.map(a => a.id === id ? {...a, status: 'Rejected'} : a));
              notify("Application declined.", "alert");
            }}
            onToggleMaintenance={() => setSiteMaintenance(!siteMaintenance)}
            siteMaintenance={siteMaintenance}
            activeCampus={activeCampus} setActiveCampus={setActiveCampus}
          />
        )}
      </main>

      {/* Shared Modals & AI Drawer */}
      <div className={`fixed inset-0 sm:inset-auto sm:bottom-12 sm:right-12 w-full sm:w-[450px] z-[250] transition-all transform ${isAIChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="glass-dark sm:rounded-[40px] overflow-hidden flex flex-col shadow-4xl border border-white/10 h-[600px]">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-amber-400 text-zinc-950 rounded-xl flex items-center justify-center text-xl font-black">S</div>
                   <div>
                     <p className="font-black text-white text-sm">Scout AI</p>
                     <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Network Assistant</p>
                   </div>
                </div>
                <button onClick={() => setIsAIChatOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><i className="fas fa-times-circle text-2xl"></i></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {aiMessages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-zinc-200'}`}>{m.content}</div>
                   </div>
                ))}
                {aiLoading && <div className="flex justify-start"><div className="bg-white/5 px-6 py-3 rounded-2xl text-zinc-400 text-xs animate-pulse">Scout is calculating...</div></div>}
             </div>
             <div className="p-8 border-t border-white/5 bg-zinc-950">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask Scout anything..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-amber-400 transition-all" 
                    onKeyDown={e => { if (e.key === 'Enter') { handleAISearch(e.currentTarget.value); e.currentTarget.value = ''; } }} 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><i className="fas fa-terminal text-xs text-white"></i></div>
                </div>
             </div>
          </div>
      </div>

      {/* Floating Scout Trigger */}
      <div className="fixed bottom-8 right-8 z-[200]">
         <button onClick={() => setIsAIChatOpen(true)} className="w-20 h-20 bg-zinc-950 text-white rounded-[28px] shadow-4xl flex items-center justify-center hover:bg-amber-400 hover:text-zinc-950 transition-all active:scale-90 group pulse-ring relative">
           <i className="fas fa-microchip text-3xl group-hover:rotate-12 transition-transform"></i>
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white"></div>
         </button>
      </div>

      {/* Cart Drawer - Redesigned */}
      <div className={`fixed inset-0 z-[140] transition-opacity ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsCartOpen(false)}></div>
         <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-4xl transition-transform duration-700 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
               <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Your Hub Bag</h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Staging for local exchange</p>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 hover:text-zinc-950 hover:rotate-90 transition-all"><i className="fas fa-times text-xl"></i></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
                      <i className="fas fa-shopping-basket text-6xl mb-6"></i>
                      <p className="text-lg font-black uppercase tracking-[0.2em]">Bag Empty</p>
                    </div>
                  ) : cart.map(item => (
                    <div key={item.id} className="flex gap-6 items-center animate-in slide-in-from-bottom-4 duration-500 group">
                      <img src={item.imageUrl} className="w-24 h-24 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      <div className="flex-1">
                        <h4 className="font-black text-lg text-zinc-950 tracking-tight leading-none mb-2">{item.name}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.category}</p>
                          <p className="text-xl font-black text-zinc-950">${item.price}</p>
                        </div>
                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-4 hover:text-red-600 transition-colors">Evict Asset</button>
                      </div>
                    </div>
                  ))}
               </div>
               
               {cart.length > 0 && (
                 <div className="p-10 bg-zinc-950 text-white rounded-t-[48px]">
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Exchange Total</p>
                        <span className="text-5xl font-black tracking-tighter">${cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                      </div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center">
                        <i className="fas fa-lock mr-2"></i> Secured Trade
                      </div>
                    </div>
                    <button className="w-full bg-white text-zinc-950 py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">Execute protocol</button>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;
