import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const Badge = ({ children, color = 'zinc' }: BadgeProps) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
    color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
    color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
    color === 'red' ? 'bg-red-50 text-red-600 border-red-100' :
    'bg-zinc-100 text-zinc-600 border-zinc-200'
  }`}>
    {children}
  </span>
);
