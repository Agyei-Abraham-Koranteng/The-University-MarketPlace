
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps { }

export const Footer: React.FC<FooterProps> = () => {
    const navigate = useNavigate();
    return (
        <footer className="relative mt-20 pt-20 pb-10 bg-white border-t border-zinc-50 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-400/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

                    {/* Brand/Identity */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center space-x-4 mb-8 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="bg-zinc-950 text-white w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-2xl group-hover:rotate-6 transition-transform">U</div>
                            <div>
                                <span className="font-black text-2xl tracking-tighter text-zinc-950 block leading-none">UniMall</span>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Campus Marketplace</span>
                            </div>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-8 font-medium">
                            The premier hyper-local commerce network engineered for university hubs. Verified trades, secure logistics, and student-powered marketplace infrastructure.
                        </p>
                        <div className="flex space-x-4">
                            {['facebook-f', 'x-twitter', 'instagram', 'discord'].map((icon) => (
                                <a key={icon} href="#" className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-950 hover:text-white hover:scale-110 transition-all shadow-sm">
                                    <i className={`fab fa-${icon} text-sm`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Group */}
                    <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.3em] mb-8">Navigation</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Marketplace', path: '/marketplace' },
                                    { label: 'Vendor Portal', path: '/vendor/onboarding' },
                                    { label: 'Sign In', path: '/auth' }
                                ].map((item) => (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className="text-sm font-bold text-zinc-400 hover:text-zinc-950 hover:translate-x-1 transition-all flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-indigo-500 mr-3 transition-colors"></span>
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.3em] mb-8">Platform</h4>
                            <ul className="space-y-4">
                                {['Security Status', 'Privacy Records', 'Pickup Hubs', 'Seller Tools'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-bold text-zinc-400 hover:text-zinc-950 hover:translate-x-1 transition-all flex items-center group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-amber-500 mr-3 transition-colors"></span>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.3em] mb-8">Newsletter</h4>
                            <p className="text-zinc-500 text-xs mb-6 font-medium">Join the network for platform updates and exclusive drops.</p>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="name@email.edu"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-950 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                    <i className="fas fa-arrow-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Line */}
                <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
                        <div className="flex items-center space-x-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Online</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Secure & Stable</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Uptime 99.9%</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">© 2024 UniMall Global</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">Built for students</span>
                            <i className="fas fa-bolt text-amber-400 text-[10px]"></i>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
