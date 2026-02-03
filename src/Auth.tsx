
import React, { useState } from 'react';
import { View, UserRole, Profile } from './types.ts';

interface AuthProps {
  authMode: 'LOGIN' | 'SIGNUP';
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  onAuthSuccess: (user: Profile) => void;
  onClose: () => void;
}

export const AuthView: React.FC<AuthProps> = ({
  authMode, setAuthMode, onAuthSuccess, onClose
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: Profile = {
      id: `user-${Date.now()}`,
      email: email, // Use actual entered email
      role: UserRole.CUSTOMER, // Default role for new signups
      fullName: authMode === 'SIGNUP' ? fullName : (email === 'admin@unimall.edu.gh' ? 'Platform Admin' : 'Member'),
      status: 'Active'
    };
    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-zinc-50">
      <div className="absolute top-0 left-0 w-full h-full gradient-modern opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 md:p-10 border border-zinc-100 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-950 text-white rounded-[24px] mb-6 shadow-2xl">
            <span className="text-2xl font-black">U</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-950 tracking-tighter mb-2">
            {authMode === 'LOGIN' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-6">
          {authMode === 'SIGNUP' && (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Campus Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@edu.gh"
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>


          <button type="submit" className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
            {authMode === 'LOGIN' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
            className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-950 transition-colors"
          >
            {authMode === 'LOGIN' ? "Don't have an ID? Create one" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
