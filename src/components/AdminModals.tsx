import React from 'react';
import { UserRole, Profile, Product, VendorApplication } from '../types';

interface EditUserModalProps {
    editingUser: Profile | null;
    setEditingUser: (user: Profile | null) => void;
    onUpdateUser: (user: Profile) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ editingUser, setEditingUser, onUpdateUser }) => {
    if (!editingUser) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" onClick={() => setEditingUser(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-4xl overflow-hidden p-10 md:p-12 animate-in zoom-in-95 duration-300">
                <h3 className="text-2xl font-black text-zinc-950 tracking-tighter mb-8">Edit Identity</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input type="text" value={editingUser.fullName} onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Role</label>
                        <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as UserRole })} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold">
                            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Status</label>
                        <div className="flex gap-4">
                            {['Active', 'Suspended'].map(st => (
                                <button key={st} onClick={() => setEditingUser({ ...editingUser, status: st as any })} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${editingUser.status === st ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-400 border-zinc-100'}`}>{st}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-12">
                    <button onClick={() => setEditingUser(null)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Discard</button>
                    <button onClick={() => { onUpdateUser(editingUser); setEditingUser(null); }} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Commit Changes</button>
                </div>
            </div>
        </div>
    );
};

interface EditProductModalProps {
    editingProduct: Product | null;
    setEditingProduct: (product: Product | null) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (id: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ editingProduct, setEditingProduct, onUpdateProduct, onDeleteProduct }) => {
    if (!editingProduct) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" onClick={() => setEditingProduct(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-4xl overflow-hidden p-10 md:p-12 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-black text-zinc-950 tracking-tighter mb-8">Asset Parameters</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Item Name</label>
                        <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Price ($)</label>
                            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Stock</label>
                            <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-12">
                    <button onClick={() => { onDeleteProduct(editingProduct.id); setEditingProduct(null); }} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Delete Asset</button>
                    <button onClick={() => { onUpdateProduct(editingProduct); setEditingProduct(null); }} className="flex-1 bg-zinc-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Sync Database</button>
                </div>
            </div>
        </div>
    );
};

interface ApplicationReviewModalProps {
    selectedApp: VendorApplication | null;
    setSelectedApp: (app: VendorApplication | null) => void;
    onApproveApplication: (id: string) => void;
    onRejectApplication: (id: string) => void;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({ selectedApp, setSelectedApp, onApproveApplication, onRejectApplication }) => {
    if (!selectedApp) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
            <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row h-[80vh]">
                <div className="flex-1 bg-zinc-100 p-8 flex items-center justify-center overflow-hidden">
                    <img
                        src={selectedApp.documentUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1200&fit=crop'}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        alt="Verification Document"
                    />
                </div>
                <div className="w-full lg:w-[380px] p-12 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-zinc-950 tracking-tighter mb-2">Document Review</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-10">Application ID: {selectedApp.id}</p>

                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Applicant</label>
                                <p className="font-bold text-zinc-950">{selectedApp.fullName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">ID Number</label>
                                <p className="font-bold text-zinc-950">{selectedApp.idNumber || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">University</label>
                                <p className="font-bold text-zinc-950">{selectedApp.university}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Proposed Store</label>
                                <p className="font-bold text-zinc-950">{selectedApp.storeName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => { onRejectApplication(selectedApp.id); setSelectedApp(null); }}
                            className="w-full bg-red-50 text-red-600 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition"
                        >
                            Reject Application
                        </button>
                        <button
                            onClick={() => { onApproveApplication(selectedApp.id); setSelectedApp(null); }}
                            className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-600 transition"
                        >
                            Approve & Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
