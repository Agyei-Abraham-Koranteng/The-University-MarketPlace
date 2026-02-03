import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  View, UserRole, Product, Vendor, Profile,
  CartItem, Message, AuditEntry, VendorApplication, Review, Transaction, AppNotification
} from './types.ts';
import {
  MOCK_PRODUCTS, MOCK_VENDORS, MOCK_DISPUTES, MOCK_REVIEWS, MOCK_ADMIN
} from './constants.tsx';

import { HomeView } from './Home.tsx';
import { AuthView } from './Auth.tsx';
import { AdminPanel } from './admin/AdminPanel.tsx';
import { MarketplaceView } from './Marketplace.tsx';
import { ProductDetailView } from './ProductDetail.tsx';
import { VendorOnboardingView } from './VendorOnboarding.tsx';
import { VendorDashboard } from './VendorDashboard.tsx';
import { Routes, Route, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode, isAllowed: boolean, redirectTo?: string }> = ({
  children, isAllowed, redirectTo = "/auth"
}) => {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};

// Product Detail Wrapper to handle URL params
const ProductDetailWrapper: React.FC<{
  products: Product[],
  vendors: Vendor[],
  reviews: Review[],
  currentUser: Profile | null,
  handleAddToCart: (product: Product) => void,
  handleAddReview: (review: Partial<Review>) => void,
  navigate: (path: string) => void
}> = ({ products, vendors, reviews, currentUser, handleAddToCart, handleAddReview, navigate }) => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === productId);

  if (!product) return <Navigate to="/marketplace" replace />;

  return (
    <ProductDetailView
      product={product}
      vendor={vendors.find(v => v.vendorId === product.vendorId)}
      reviews={reviews.filter(r => r.productId === product.id)}
      currentUser={currentUser}
      onAddToCart={handleAddToCart}
      onAddReview={handleAddReview}
      onBack={() => navigate('/marketplace')}
    />
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<Profile | null>(MOCK_ADMIN);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Scout, your UniMall assistant. How can I help you find what you need today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const [applications, setApplications] = useState<VendorApplication[]>([
    {
      id: 'app-1',
      userId: 'u5',
      fullName: 'John K. Boateng',
      email: 'john.b@ug.edu.gh',
      storeName: 'Legon Tech Fix',
      appliedAt: '2024-05-18',
      status: 'Pending',
      idNumber: 'UG-10293847',
      documentUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop'
    }
  ]);

  const [users, setUsers] = useState<Profile[]>([
    { id: 'u1', email: 'alex@varsity.edu', role: UserRole.VENDOR, fullName: 'Alex Johnson', status: 'Active' },
    { id: 'u2', email: 'sarah@campus.edu', role: UserRole.VENDOR, fullName: 'Sarah Chen', status: 'Active' },
    { id: 'admin-001', email: 'admin@unimall.edu.gh', role: UserRole.ADMIN, fullName: 'Platform Admin', status: 'Active' }
  ]);

  const notify = (message: string, type: AppNotification['type'] = 'info') => {
    const id = `notif - ${Date.now()} `;
    setNotifications(prev => [{ id, type, message, timestamp: new Date().toISOString() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const logAudit = (action: string, details: string, severity: 'Low' | 'Medium' | 'High' = 'Low') => {
    const entry: AuditEntry = {
      id: `audit - ${Date.now()} `,
      timestamp: new Date().toISOString(),
      adminId: currentUser?.id || 'System',
      action,
      details,
      severity
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const handleOnAuthSuccess = (user: Profile) => {
    // Explicit Admin Recognition Logic
    if (user.email === 'admin@unimall.edu.gh') {
      const adminProfile: Profile = {
        ...user,
        id: 'admin-001',
        role: UserRole.ADMIN,
        fullName: 'Platform Admin',
        status: 'Active'
      };
      setCurrentUser(adminProfile);
      notify("Administrative session initiated.", "success");
      logAudit('Admin Login', `Admin user logged in`, 'Medium');
    } else {
      // Standard User or Existing Vendor
      const existingVendor = vendors.find(v => v.email === user.email);
      if (existingVendor) {
        setCurrentUser({ ...existingVendor, role: UserRole.VENDOR });
        notify(`Welcome back to your store, ${existingVendor.storeName}.`, "success");
      } else {
        setCurrentUser(user);
        notify(`Welcome to the network, ${user.fullName}.`, "success");
      }
    }
    navigate('/');
  };

  const handleApproveVendor = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Approved' } : a));

    // Promote user to Vendor role in the global user list
    setUsers(prev => prev.map(u => u.email === app.email ? { ...u, role: UserRole.VENDOR } : u));

    // Create actual vendor object in store list
    const newVendor: Vendor = {
      id: app.userId,
      vendorId: `v - ${Date.now()} `,
      email: app.email,
      role: UserRole.VENDOR,
      fullName: app.fullName,
      storeName: app.storeName,
      description: "New verified campus store.",
      logoUrl: `https://ui-avatars.com/api/?name=${app.storeName}&background=09090b&color=fff`,
      bannerUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=300&fit=crop',
      isVerified: true,
      badges: ['Verified'],
      rating: 5.0,
      totalSales: 0,
      wallet: { pendingBalance: 0, availableBalance: 0, totalWithdrawn: 0, transactions: [] }
    };
    setVendors(prev => [...prev, newVendor]);
    notify(`${app.storeName} is now live.`, "success");
    logAudit('Vendor Approved', `Approved store ${app.storeName} for user ${app.fullName}`, 'High');
  };

  const requireAuth = (targetPath: string) => {
    if (!currentUser) { navigate('/auth'); return false; }
    navigate(targetPath);
    return true;
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    notify(`${product.name} added to bag.`, 'success');
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
    notify("Review submitted successfully.", "success");
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
        config: { systemInstruction: `You are Scout, the UniMall Campus Network AI. You are helpful, professional, and friendly. Help the user find products or explain how to sell.` }
      });
      setAiMessages(prev => [...prev, { role: 'assistant', content: response.text || "Connection bottleneck encountered." }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally { setAiLoading(false); }
  };

  const handleOnboardingSubmit = (partialApp: Partial<VendorApplication>) => {
    if (!currentUser) return;
    const newApp: VendorApplication = {
      id: `app-${Date.now()}`,
      userId: currentUser.id,
      fullName: currentUser.fullName,
      email: currentUser.email,
      storeName: partialApp.storeName || 'New Store',
      appliedAt: new Date().toISOString(),
      status: 'Pending',
      documentUrl: partialApp.documentUrl,
      idNumber: partialApp.idNumber
    };
    setApplications(prev => [newApp, ...prev]);
    navigate('/');
    notify("Application submitted for review.", "info");
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

    notify("Withdrawal process started.", "warning");
    logAudit('Withdrawal Requested', `Vendor ${vendor.storeName} requested payout of $${amount}`, 'Medium');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  const selectedProduct = useMemo(() =>
    products.find(p => p.id === selectedProductId),
    [products, selectedProductId]);

  const currentVendor = useMemo(() =>
    vendors.find(v => v.id === currentUser?.id),
    [vendors, currentUser]);

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

  return (
    <div className="app-root">
      {/* Notifications Portal */}
      <div className="fixed top-24 right-6 z-[200] space-y-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500">
            <div className={`glass px-6 py-4 rounded-2xl shadow-2xl border-l-4 flex items-center space-x-4 ${n.type === 'success' ? 'border-emerald-500' :
              n.type === 'warning' ? 'border-amber-500' :
                n.type === 'alert' ? 'border-red-500' : 'border-indigo-500'
              }`}>
              <div className={`w-2 h-2 rounded-full ${n.type === 'success' ? 'bg-emerald-500' :
                n.type === 'warning' ? 'bg-amber-500' :
                  n.type === 'alert' ? 'bg-red-500' : 'bg-indigo-500'
                } animate-pulse`}></div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-950">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <Routes>
        {/* Admin Route - Isolated */}
        <Route path="/admin" element={<AdminLayout currentUser={currentUser} />}>
          <Route index element={
            <AdminPanel
              currentUser={currentUser!} users={users} products={products} vendors={vendors}
              auditLogs={auditLogs} applications={applications}
              onUpdateUser={u => setUsers(prev => prev.map(item => item.id === u.id ? u : item))}
              onUpdateProduct={p => setProducts(prev => prev.map(item => item.id === p.id ? p : item))}
              onDeleteProduct={id => setProducts(prev => prev.filter(item => item.id !== id))}
              onApproveApplication={handleApproveVendor}
              onRejectApplication={id => {
                setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
                notify("Application declined.", "alert");
              }}
              onToggleMaintenance={() => setSiteMaintenance(!siteMaintenance)}
              siteMaintenance={siteMaintenance}
            />
          } />
        </Route>

        {/* User Routes - Unified Layout */}
        <Route element={
          <MainLayout
            currentUser={currentUser}
            onLogout={() => setCurrentUser(null)}
            cartCount={cart.length}
            openCart={() => setIsCartOpen(true)}
            openSearch={() => setShowSearchOverlay(true)}
            searchQuery={searchQuery}
          />
        }>
          <Route path="/" element={<HomeView products={products.slice(0, 4)} onSelectProduct={(id) => navigate(`/product/${id}`)} />} />
          <Route path="/auth" element={
            <AuthView
              authMode={authMode} setAuthMode={setAuthMode}
              onAuthSuccess={handleOnAuthSuccess}
              onClose={() => navigate('/')}
            />
          } />
          <Route path="/marketplace" element={
            <MarketplaceView
              products={filteredProducts} vendors={vendors}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              onAddToCart={handleAddToCart}
              onSelectProduct={(id) => navigate(`/product/${id}`)}
            />
          } />
          <Route path="/vendor/onboarding" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <VendorOnboardingView
                currentUser={currentUser!}
                onSubmit={handleOnboardingSubmit}
                onCancel={() => navigate('/')}
              />
            </ProtectedRoute>
          } />
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute isAllowed={!!currentVendor} redirectTo="/auth">
              <VendorDashboard
                vendor={currentVendor!}
                products={products}
                onWithdrawal={handleWithdrawalRequest}
              />
            </ProtectedRoute>
          } />
          <Route path="/product/:productId" element={
            <ProductDetailWrapper
              products={products}
              vendors={vendors}
              reviews={reviews}
              currentUser={currentUser}
              handleAddToCart={handleAddToCart}
              handleAddReview={handleAddReview}
              navigate={navigate}
            />
          } />
        </Route>
      </Routes>

      {showSearchOverlay && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowSearchOverlay(false)}></div>
          <div className="relative w-full max-w-2xl glass rounded-3xl shadow-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-zinc-100 flex items-center space-x-4">
              <i className="fas fa-search text-zinc-400"></i>
              <input
                autoFocus type="text" placeholder="Search products, stores, categories..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-zinc-300"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setShowSearchOverlay(false); }}
              />
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 ml-2">Quick Results</p>
              {filteredProducts.slice(0, 5).map(p => (
                <button
                  key={p.id} onClick={() => { navigate(`/product/${p.id}`); setShowSearchOverlay(false); }}
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
            </div>
          </div>
        </div>
      )}

      {/* Floating UI Elements only on User Side */}
      {!location.pathname.startsWith('/admin') && (
        <>
          <div className={`fixed inset-0 sm:inset-auto sm:bottom-12 sm:right-12 w-full sm:w-[450px] z-[250] transition-all transform ${isAIChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="glass-dark sm:rounded-[40px] overflow-hidden flex flex-col shadow-4xl border border-white/10 h-[600px]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-400 text-zinc-950 rounded-xl flex items-center justify-center text-xl font-black">S</div>
                  <div>
                    <p className="font-black text-white text-sm">Scout AI</p>
                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Campus Assistant</p>
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
                {aiLoading && <div className="flex justify-start"><div className="bg-white/5 px-6 py-3 rounded-2xl text-zinc-400 text-xs animate-pulse">Scout is thinking...</div></div>}
              </div>
              <div className="p-8 border-t border-white/5 bg-zinc-950">
                <div className="relative">
                  <input
                    type="text" placeholder="Ask Scout anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    onKeyDown={e => { if (e.key === 'Enter') { handleAISearch(e.currentTarget.value); e.currentTarget.value = ''; } }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-[200]">
            <button onClick={() => setIsAIChatOpen(true)} className="w-20 h-20 bg-zinc-950 text-white rounded-[28px] shadow-4xl flex items-center justify-center hover:bg-amber-400 hover:text-zinc-950 transition-all active:scale-90 group pulse-ring relative">
              <i className="fas fa-microchip text-3xl group-hover:rotate-12 transition-transform"></i>
            </button>
          </div>

          <div className={`fixed inset-0 z-[140] transition-opacity ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-4xl transition-transform duration-700 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex flex-col h-full">
                <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Your Hub Bag</h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Ready for exchange</p>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-all"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-6 items-center group">
                      <img src={item.imageUrl} className="w-24 h-24 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      <div className="flex-1">
                        <h4 className="font-black text-lg text-zinc-950 tracking-tight leading-none mb-2">{item.name}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.category}</p>
                          <p className="text-xl font-black text-zinc-950">${item.price}</p>
                        </div>
                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-4 hover:text-red-600 transition-colors">Remove Item</button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="p-10 bg-zinc-950 text-white rounded-t-[48px]">
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Total Price</p>
                        <span className="text-4xl font-black tracking-tighter">${cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                      </div>
                    </div>
                    <button className="w-full bg-white text-zinc-950 py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 hover:scale-[1.02] transition-all shadow-2xl">Complete Purchase</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
