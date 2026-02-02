import React, { useState } from 'react';
import { UserRole, Product, Vendor, Profile, AuditEntry, VendorApplication } from './types';
import { CAMPUSES } from './constants';
import { Badge } from './components/Badge';
import { EditUserModal, EditProductModal, ApplicationReviewModal } from './components/AdminModals';

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

export const AdminPanel: React.FC<AdminProps> = (props) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'products' | 'vendors' | 'approvals' | 'analytics' | 'settings'>('overview');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);

  // Modals are now handled by imported components

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
              { id: 'analytics', icon: 'fa-chart-network', label: 'Pulse' },
              { id: 'settings', icon: 'fa-sliders-h', label: 'Config' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`w-full flex items-center space-x-5 px-5 py-4 rounded-[24px] transition-all group ${adminTab === tab.id ? 'bg-white/10 text-white border border-white/10 shadow-3xl shadow-white/5 backdrop-blur-md' : 'hover:text-white'
                  }`}
              >
                <i className={`fas ${tab.icon} w-5 text-sm transition-transform group-hover:rotate-6 ${adminTab === tab.id ? 'text-amber-400' : ''}`}></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
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
                { label: 'Active Capital', value: '$24.9k', trend: '+18.4%', icon: 'fa-money-bill-trend-up', color: 'indigo' },
                { label: 'Network Load', value: '4.2k', trend: 'Stable', icon: 'fa-signal-stream', color: 'emerald' },
                { label: 'Pending Appr.', value: props.applications.filter(a => a.status === 'Pending').length.toString(), trend: 'Urgent', icon: 'fa-shield-halved', color: 'amber' },
                { label: 'Critical Errors', value: '0', trend: 'Clear', icon: 'fa-bug', color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 mb-8`}><i className={`fas ${stat.icon} text-lg`}></i></div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-zinc-950 tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 rounded-[56px] p-12 text-white flex flex-col relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">Live Audit</h3>
              <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar max-h-80">
                {props.auditLogs.map(log => (
                  <div key={log.id} className="flex gap-5 group">
                    <div className={`w-1 h-12 rounded-full bg-${log.severity === 'High' ? 'red' : log.severity === 'Medium' ? 'amber' : 'indigo'}-500 transition-all group-hover:scale-y-110`}></div>
                    <div>
                      <p className="text-xs font-bold text-white tracking-tight">{log.action}</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1 leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'approvals' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">Identity Validation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {props.applications.filter(app => app.status === 'Pending').map(app => (
                <div key={app.id} className="bg-white p-12 rounded-[56px] border border-zinc-100 shadow-sm flex flex-col justify-between hover:shadow-2xl transition-all">
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
                    <Badge color="amber">Pending Review</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">Store</label>
                      <p className="text-sm font-bold text-zinc-950">{app.storeName}</p>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">Applied</label>
                      <p className="text-sm font-bold text-zinc-950">{new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="w-full bg-zinc-50 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-eye"></i> View Documents
                  </button>
                </div>
              ))}
              {props.applications.filter(app => app.status === 'Pending').length === 0 && (
                <div className="col-span-full py-40 text-center opacity-20">
                  <i className="fas fa-check-double text-[80px] mb-8"></i>
                  <p className="text-xl font-black uppercase tracking-[0.2em]">Queue Empty</p>
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">Identities</h2>
            <div className="bg-white rounded-[56px] border border-zinc-100 shadow-sm overflow-hidden p-4">
              <table className="w-full text-left">
                <tbody className="divide-y divide-zinc-50">
                  {props.users.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50/50 transition-all group">
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-zinc-950">{u.fullName}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">{u.email}</p>
                      </td>
                      <td className="px-10 py-8"><Badge color={u.role === UserRole.ADMIN ? 'red' : 'indigo'}>{u.role}</Badge></td>
                      <td className="px-10 py-8"><button onClick={() => setEditingUser(u)} className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all"><i className="fas fa-edit text-xs"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'products' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-10">Inventory Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {props.products.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[48px] border border-zinc-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                  <img src={p.imageUrl} className="w-full aspect-[4/3] rounded-[32px] object-cover mb-8" />
                  <h4 className="font-black text-lg text-zinc-950 mb-2 truncate tracking-tight">{p.name}</h4>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.category}</p>
                    <p className="text-xl font-black text-zinc-950">${p.price}</p>
                  </div>
                  <button onClick={() => setEditingProduct(p)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition">Adjust Parameters</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className="animate-in fade-in duration-700 max-w-4xl">
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter mb-14">Platform Config</h2>
            <div className="bg-white p-12 rounded-[56px] border border-zinc-100 shadow-sm mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-sm text-zinc-950">Maintenance Protocol</p>
                  <p className="text-[11px] font-medium text-zinc-400 mt-1">Locks all transactions site-wide.</p>
                </div>
                <button onClick={props.onToggleMaintenance} className={`w-16 h-8 rounded-full transition-all relative ${props.siteMaintenance ? 'bg-amber-400' : 'bg-zinc-100'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${props.siteMaintenance ? 'left-9' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
            <div className="bg-zinc-950 p-12 rounded-[56px] text-white">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Default Campus Node</label>
              <select value={props.activeCampus} onChange={e => props.setActiveCampus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-400 outline-none">
                {CAMPUSES.map(c => <option key={c.id} value={c.id} className="text-zinc-900">{c.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </main>

      <EditUserModal
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onUpdateUser={props.onUpdateUser}
      />
      <EditProductModal
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        onUpdateProduct={props.onUpdateProduct}
        onDeleteProduct={props.onDeleteProduct}
      />
      <ApplicationReviewModal
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
        onApproveApplication={props.onApproveApplication}
        onRejectApplication={props.onRejectApplication}
      />
    </div>
  );
};
