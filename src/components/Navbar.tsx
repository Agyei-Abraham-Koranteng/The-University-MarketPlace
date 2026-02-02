import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, Profile, CartItem } from '../types';

interface NavbarProps {
    currentUser: Profile | null;
    setCurrentUser: (user: Profile | null) => void;
    cartCount: number;
    setIsCartOpen: (open: boolean) => void;
    setShowSearchOverlay: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    currentUser,
    setCurrentUser,
    cartCount,
    setIsCartOpen,
    setShowSearchOverlay
}) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-zinc-100 px-4 md:px-8 h-20 md:h-24 flex justify-between items-center">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigate('/')}>
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
                    <Link to="/marketplace" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950">Terminal</Link>
                    {currentUser?.role === UserRole.ADMIN && (
                        <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700">Console</Link>
                    )}
                    {currentUser?.role === UserRole.VENDOR && (
                        <Link to="/vendor" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950">Ops Hub</Link>
                    )}
                </nav>

                <div className="h-8 w-px bg-zinc-100 hidden sm:block"></div>

                <div className="flex items-center space-x-5">
                    <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                        <i className="fas fa-shopping-bag text-xl text-zinc-950 group-hover:scale-110 transition-transform"></i>
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-amber-400 text-zinc-950 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">{cartCount}</span>}
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
                        <Link to="/auth" className="bg-zinc-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Identify</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
