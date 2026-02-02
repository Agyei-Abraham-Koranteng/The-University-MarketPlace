
import React, { useState } from 'react';
import { UserRole, Product, Vendor, Profile, AuditEntry, VendorApplication } from './types.ts';
import { CATEGORIES, CAMPUSES } from './constants.tsx';

interface AdminProps {
  currentUser: Profile;
  users: Profile[];
  products: Product[];
  vendors: Vendor[];
  auditLogs: AuditEntry[];
  applications: VendorApplication[];
  onUpdateUser: (user: Profile) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;
  onToggleMaintenance: () => void;
  siteMaintenance: boolean;
  activeCampus: string;
  setActiveCampus: (id: string) => void;
}

const Badge = ({ children, color = 'zinc' }: { children: React.ReactNode, color?: string }) => (
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

export const AdminPanel: React.FC<AdminProps> = (props) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'products' | 'vendors' | 'approvals' | 'analytics' | 'settings'>('overview');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);

  const pendingApps = props.applications.filter(a => a.status === 'Pending');

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-zinc-50">
      <aside className="w-full lg:w-80 bg-zinc-950 text-zinc-400 p-8 flex flex-col gap-10">
        <div>
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-8 px-4">Command Center</h4>
          <nav className="space-y-3">
            {[
              { id: 'overview', icon: 'fa-rocket', label: 'Monitor' },
              { id: 'users', icon: 'fa-id-card', label: 'Identities' },
              { id: 'products', icon: 'fa-cube', label: 'Inventory' },
              { id: 'vendors', icon: 'fa-shop', label: 'Vendors' },
              { id: 'approvals', icon: 'fa-fingerprint', label: 'Approvals' },
              { id: 'settings', icon: 'fa-sliders-h', label: 'Config' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`w-full flex items-center space-x-5 px-5 py-4 rounded-[24px] transition-all group ${
                  adminTab === tab.id ? 'bg-white/10 text-white border border-white/10 shadow-3xl shadow-white/5 backdrop-blur-md' : 'hover:text-white'
                }`}
              >
                <i className={`fas ${tab.icon} w-5 text-sm transition-transform group-hover:rotate-6 ${adminTab === tab.id ? 'text-indigo-400' : ''}`}></i>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                  {tab.id === 'approvals' && pendingApps.length > 0 && (
                    <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">{pendingApps.length}</span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-14 overflow-y-auto no-scrollbar">
        {adminTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">System Pulse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { label: 'Network Assets', value: props.products.length.toString(), trend: 'Stable', icon: 'fa-box', color: 'indigo' },
                { label: 'Authorized Peers', value: props.users.length.toString(), trend: 'Growing', icon: 'fa-users', color: 'emerald' },
                { label: 'Pending Nodes', value: pendingApps.length.toString(), trend: 'Critical', icon: 'fa-shield-halved', color: 'amber' },
                { label: 'System Errors', value: '0', trend: 'Healthy', icon: 'fa-bug', color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 mb-8`}><i className={`fas ${stat.icon} text-lg`}></i></div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-zinc-950 tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </div>
            
            <div className="bg-zinc-950 rounded-[56px] p-12 text-white flex flex-col relative overflow-hidden h-[400px]">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">Security Audit Log</h3>
               <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                  {props.auditLogs.map(log => (
                    <div key={log.id} className="flex gap-5 group">
                       <div className={`w-1 h-12 rounded-full bg-${log.severity === 'High' ? 'red' : log.severity === 'Medium' ? 'amber' : 'indigo'}-500`}></div>
                       <div>
                          <p className="text-xs font-bold text-white tracking-tight">{log.action}</p>
                          <p className="text-[10px] text-zinc-500 font-medium mt-1 leading-relaxed">{log.details}</p>
                       </div>
                       <span className="ml-auto text-[8px] font-black text-zinc-700 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {adminTab === 'approvals' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">Vendor Queue</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {pendingApps.map(app => (
                <div key={app.id} className="bg-white p-12 rounded-[56px] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
                        {app.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-zinc-950 tracking-tight">{app.fullName}</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{app.university}</p>
                      </div>
                    </div>
                    <Badge color="amber">Verification Required</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">Store Handle</label>
                      <p className="text-sm font-bold text-zinc-950">{app.storeName}</p>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">Request Date</label>
                      <p className="text-sm font-bold text-zinc-950">{new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => props.onRejectApplication(app.id)} className="flex-1 bg-red-50 text-red-600 py-5 rounded-2xl font-black text-[10px] uppercase">Deny</button>
                    <button onClick={() => props.onApproveApplication(app.id)} className="flex-2 bg-zinc-950 text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-xl">Approve Node</button>
                  </div>
                </div>
              ))}
              {pendingApps.length === 0 && (
                <div className="col-span-full py-40 text-center opacity-20">
                  <i className="fas fa-check-double text-[80px] mb-8"></i>
                  <p className="text-xl font-black uppercase tracking-[0.2em]">All Nodes Verified</p>
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">Network Identities</h2>
            <div className="bg-white rounded-[56px] border border-zinc-100 shadow-sm overflow-hidden p-4">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-zinc-50">
                        <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">User Entity</th>
                        <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Role</th>
                        <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cluster Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                     {props.users.map(u => (
                        <tr key={u.id} className="hover:bg-zinc-50/50 transition-all group">
                           <td className="px-10 py-8">
                              <p className="text-sm font-black text-zinc-950">{u.fullName}</p>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">{u.email}</p>
                           </td>
                           <td className="px-10 py-8"><Badge color={u.role === UserRole.ADMIN ? 'red' : u.role === UserRole.VENDOR ? 'indigo' : 'zinc'}>{u.role}</Badge></td>
                           <td className="px-10 py-8"><Badge color={u.status === 'Active' ? 'emerald' : 'red'}>{u.status || 'Active'}</Badge></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
