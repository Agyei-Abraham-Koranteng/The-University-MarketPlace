
import React, { useState, useMemo } from 'react';
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
  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' :
      color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
        color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          color === 'red' ? 'bg-red-50 text-red-600 border-red-100' :
            'bg-zinc-100 text-zinc-600 border-zinc-200'
    }`}>
    {children}
  </span>
);

const Sparkline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 20" className="w-24 h-6 opacity-30">
    <path
      d="M0,10 Q10,2 20,10 T40,18 T60,5 T80,12 T100,2"
      fill="none"
      stroke={color}
      strokeWidth="2"
      className="animate-pulse"
    />
  </svg>
);

export const AdminPanel: React.FC<AdminProps> = (props) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'products' | 'vendors' | 'approvals' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingApps = useMemo(() => props.applications.filter(a => a.status === 'Pending'), [props.applications]);

  const filteredUsers = useMemo(() =>
    props.users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [props.users, searchQuery]);

  const filteredProducts = useMemo(() =>
    props.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [props.products, searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sleek Command Sidebar */}
      <aside className="w-full lg:w-80 bg-zinc-950 text-zinc-400 p-10 flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <div className="flex items-center space-x-4 mb-16 px-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">A</div>
            <div>
              <p className="text-white font-black text-sm tracking-tight">System Core</p>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">v2.5 Terminal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', icon: 'fa-chart-pie', label: 'Monitor' },
              { id: 'users', icon: 'fa-fingerprint', label: 'Identities' },
              { id: 'products', icon: 'fa-cube', label: 'Inventory' },
              { id: 'vendors', icon: 'fa-store', label: 'Nodes' },
              { id: 'approvals', icon: 'fa-shield-check', label: 'Verification', count: pendingApps.length },
              { id: 'settings', icon: 'fa-sliders', label: 'Config' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${adminTab === tab.id ? 'bg-white/5 text-white border border-white/5 shadow-2xl' : 'hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <i className={`fas ${tab.icon} text-sm transition-transform group-hover:scale-110 ${adminTab === tab.id ? 'text-indigo-400' : 'text-zinc-600'}`}></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                </div>
                {tab.count ? (
                  <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold animate-pulse">{tab.count}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-[32px] border border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Security Layer Active</p>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">Auto-purge protocol engaged. Next cycle in 12h 4m.</p>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-16 h-screen overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 text-zinc-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Root</span>
              <i className="fas fa-chevron-right text-[8px]"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">{adminTab}</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-950 tracking-tighter capitalize">{adminTab} Center</h2>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-950 transition-colors"></i>
              <input
                type="text"
                placeholder="Query database..."
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </header>

        {adminTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Global Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                { label: 'Network Value', value: '$84,200', trend: '+12.4%', color: '#6366f1', icon: 'fa-bank' },
                { label: 'Active Peers', value: props.users.length.toString(), trend: '+5.2%', color: '#10b981', icon: 'fa-users-cog' },
                { label: 'Asset Throughput', value: props.products.length.toString(), trend: 'Stable', color: '#f59e0b', icon: 'fa-bolt' },
                { label: 'System Uptime', value: '99.99%', trend: 'Reliable', color: '#6366f1', icon: 'fa-microchip' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-50 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-all`}><i className={`fas ${stat.icon} text-lg`}></i></div>
                    <Sparkline color={stat.color} />
                  </div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-black text-zinc-950 tracking-tighter">{stat.value}</h3>
                    <span className={`text-[9px] font-black pb-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-zinc-400'}`}>{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Visual Analytics Hub */}
              <div className="lg:col-span-8 bg-zinc-950 rounded-[64px] p-12 text-white relative overflow-hidden h-[500px] shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 text-gradient-indigo">Growth Engine Phase II</h4>
                    <p className="text-2xl font-black tracking-tight">Ecosystem Traffic Visualizer</p>
                  </div>
                  <div className="flex gap-4">
                    <Badge color="indigo">Live Feed</Badge>
                    <Badge color="zinc">24h Cycle</Badge>
                  </div>
                </div>

                {/* Mock Visualization Graphics */}
                <div className="relative h-64 mt-10">
                  <svg viewBox="0 0 800 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path d="M0,150 Q100,50 200,120 T400,30 T600,100 T800,40" fill="none" stroke="#6366f1" strokeWidth="4" className="animate-reveal" />
                    <path d="M0,150 Q100,50 200,120 T400,30 T600,100 T800,40 V200 H0 Z" fill="url(#grad)" />
                    {[200, 400, 600].map(x => (
                      <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="white" strokeOpacity="0.05" strokeDasharray="4" />
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-8 border-t border-white/5 pt-8">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Peak Load</p>
                    <p className="text-xl font-bold">1.2m Req/s</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Exchange Latency</p>
                    <p className="text-xl font-bold">14ms</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Cluster Nodes</p>
                    <p className="text-xl font-bold">84 Active</p>
                  </div>
                </div>
              </div>

              {/* Activity Protocol Feed */}
              <div className="lg:col-span-4 bg-zinc-50 rounded-[64px] p-12 border border-zinc-100 flex flex-col h-[500px]">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-10">Security Logs</h4>
                <div className="space-y-8 overflow-y-auto no-scrollbar flex-1">
                  {props.auditLogs.map((log, i) => (
                    <div key={log.id} className="flex gap-4 group">
                      <div className="relative">
                        <div className={`w-2 h-2 rounded-full mt-2 ${log.severity === 'High' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-indigo-500'}`}></div>
                        {i !== props.auditLogs.length - 1 && <div className="absolute top-4 left-1 w-px h-12 bg-zinc-200"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-zinc-950 leading-none mb-1">{log.action}</p>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{log.details}</p>
                        <span className="text-[8px] font-black text-zinc-300 uppercase mt-2 block">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'approvals' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Pending Protocol</h4>
                <p className="text-2xl font-black text-zinc-950 tracking-tight">Identity Verification Queue</p>
              </div>
              <Badge color="amber">{pendingApps.length} Requests Found</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {pendingApps.map(app => (
                <div key={app.id} className="bg-white p-10 rounded-[56px] border border-zinc-100 shadow-sm hover:shadow-3xl transition-all group">
                  <div className="flex items-center gap-6 mb-10">
                    <img src={`https://ui-avatars.com/api/?name=${app.fullName}&background=f4f4f5&color=09090b&size=128`} className="w-16 h-16 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-inner" />
                    <div>
                      <h4 className="font-black text-xl text-zinc-950 tracking-tight">{app.fullName}</h4>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{app.university}</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">Requested Store Handle</label>
                      <p className="text-sm font-black text-zinc-950 flex items-center gap-2">
                        <i className="fas fa-link text-[10px] text-indigo-400"></i>
                        {app.storeName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                        <label className="text-[8px] font-black text-zinc-400 uppercase mb-1 block">ID Number</label>
                        <p className="text-xs font-bold text-zinc-950">{app.idNumber}</p>
                      </div>
                      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                        <label className="text-[8px] font-black text-zinc-400 uppercase mb-1 block">Submission</label>
                        <p className="text-xs font-bold text-zinc-950">{new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => props.onRejectApplication(app.id)} className="flex-1 bg-zinc-50 text-zinc-950 py-5 rounded-3xl font-black text-[10px] uppercase hover:bg-red-50 hover:text-red-500 transition-colors">Deny</button>
                    <button onClick={() => props.onApproveApplication(app.id)} className="flex-[2] bg-zinc-950 text-white py-5 rounded-3xl font-black text-[10px] uppercase shadow-xl hover:bg-emerald-600 transition-all group-hover:scale-[1.02]">Verify Peer</button>
                  </div>
                </div>
              ))}
              {pendingApps.length === 0 && (
                <div className="col-span-full py-40 text-center rounded-[64px] border-4 border-dashed border-zinc-100">
                  <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-500 text-3xl">
                    <i className="fas fa-check-double scale-125"></i>
                  </div>
                  <p className="text-xl font-black text-zinc-950 uppercase tracking-[0.2em]">All Clusters Operational</p>
                  <p className="text-sm text-zinc-400 mt-2 font-medium">No pending identity verifications in queue.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="animate-in fade-in duration-700">
            <div className="bg-white rounded-[64px] border border-zinc-100 shadow-sm overflow-hidden p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-50">
                    <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entity Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Access</th>
                    <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50 transition-all group">
                      <td className="px-8 py-10">
                        <div className="flex items-center gap-5">
                          <img src={`https://ui-avatars.com/api/?name=${u.fullName}&background=f4f4f5&color=09090b`} className="w-12 h-12 rounded-2xl shadow-sm" />
                          <div>
                            <p className="text-sm font-black text-zinc-950">{u.fullName}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-wider">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-10">
                        <Badge color={u.role === UserRole.ADMIN ? 'red' : u.role === UserRole.VENDOR ? 'indigo' : 'zinc'}>{u.role}</Badge>
                      </td>
                      <td className="px-8 py-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">{u.status || 'Active'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-10 text-right">
                        <button className="w-10 h-10 bg-zinc-50 rounded-xl text-zinc-400 hover:bg-zinc-950 hover:text-white transition-all"><i className="fas fa-ellipsis-h text-xs"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'products' && (
          <div className="animate-in fade-in duration-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[48px] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                  <div className="relative h-48 mb-8 rounded-[36px] overflow-hidden">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <Badge color="zinc">{p.category}</Badge>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-lg text-zinc-950 tracking-tight leading-none mb-2">{p.name}</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Locked: ${p.price}</p>
                      </div>
                      <button onClick={() => props.onDeleteProduct(p.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-zinc-50">
                      <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[8px] font-bold tracking-tighter">NI</div>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Asset Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-zinc-950 rounded-[56px] p-10 text-white relative overflow-hidden group">
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-8">System Override</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group/toggle cursor-pointer" onClick={props.onToggleMaintenance}>
                      <div>
                        <p className="font-black text-sm mb-1">Maintenance Mode</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Suspend cluster activity</p>
                      </div>
                      <div className={`w-14 h-8 rounded-full border border-white/10 relative transition-colors ${props.siteMaintenance ? 'bg-indigo-600' : 'bg-zinc-900 shadow-inner'}`}>
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${props.siteMaintenance ? 'left-7 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-900 rounded-full blur-3xl group-hover:bg-indigo-950 transition-colors"></div>
                </div>

                <div className="bg-zinc-50 rounded-[56px] p-10 border border-zinc-100">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Node Parameters</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Primary Active Campus</label>
                      <select
                        value={props.activeCampus}
                        onChange={(e) => props.setActiveCampus(e.target.value)}
                        className="w-full bg-white border border-zinc-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none ring-zinc-950 focus:ring-2 transition-all appearance-none"
                      >
                        {CAMPUSES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white rounded-[64px] border border-zinc-100 shadow-sm p-12">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-12">Protocol Metadata</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[
                      { label: 'Network Name', value: 'UniMall Global - Cluster A', type: 'text' },
                      { label: 'Admin Endpoint', value: 'https://core.unimall.edu.gh/v2', type: 'text' },
                      { label: 'Security Token', value: '**************************', type: 'password' },
                      { label: 'Audit Retention', value: '90 Cycles', type: 'text' }
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">{field.label}</label>
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 transition-all font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-16 pt-12 border-t border-zinc-50 flex justify-end">
                    <button className="bg-zinc-950 text-white px-12 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Update Core Config</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
