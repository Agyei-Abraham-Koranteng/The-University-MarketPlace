
import React, { useState } from 'react';
import { VendorApplication, Profile } from './types';

interface OnboardingProps {
  currentUser: Profile;
  onSubmit: (app: Partial<VendorApplication>) => void;
  onCancel: () => void;
}

export const VendorOnboardingView: React.FC<OnboardingProps> = ({ currentUser, onSubmit, onCancel }) => {
  const [storeName, setStoreName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [docFile, setDocFile] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulating file upload to base64 or a mock URL
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      storeName,
      idNumber,
      documentUrl: docFile || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop', // fallback mock
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-zinc-950 rounded-[48px] md:rounded-[64px] p-10 md:p-24 text-white relative overflow-hidden shadow-4xl">
        <div className="relative z-10">
          <button 
            onClick={onCancel} 
            className="mb-12 text-zinc-500 hover:text-white transition uppercase text-[10px] font-bold tracking-widest flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Cancel
          </button>

          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none text-gradient-gold">
              {step === 1 ? 'Start Your Legacy.' : 'Verify Identity.'}
            </h2>
            <p className="text-zinc-400 text-lg font-medium">
              {step === 1 ? 'Configure your store parameters.' : 'Upload student ID or official documents.'}
            </p>
          </div>

          <div className="max-w-md space-y-8">
            {step === 1 ? (
              <>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Store Identity</label>
                  <input 
                    type="text" 
                    value={storeName} 
                    onChange={e => setStoreName(e.target.value)} 
                    placeholder="e.g. Knightly Gear" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold focus:ring-2 focus:ring-amber-400 transition-all outline-none" 
                  />
                </div>
                <button 
                  disabled={!storeName}
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-zinc-950 py-6 rounded-2xl font-black text-lg hover:scale-105 transition shadow-2xl disabled:opacity-50"
                >
                  Continue to Verification
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Student ID Number</label>
                  <input 
                    type="text" 
                    value={idNumber} 
                    onChange={e => setIdNumber(e.target.value)} 
                    placeholder="e.g. 10928374" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold focus:ring-2 focus:ring-amber-400 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">ID Document Photo</label>
                  <div className={`relative w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${docFile ? 'border-amber-400 bg-amber-400/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                    {docFile ? (
                      <img src={docFile} className="w-full h-full object-cover rounded-3xl" alt="Preview" />
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload text-4xl mb-4 opacity-30"></i>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Click to browse or drag photo</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/5 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!idNumber || !docFile}
                    onClick={handleSubmit}
                    className="flex-2 bg-amber-400 text-zinc-950 py-6 rounded-2xl font-black text-lg hover:scale-105 transition shadow-2xl disabled:opacity-50 px-10"
                  >
                    Submit Application
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <i className="fas fa-rocket absolute -bottom-20 -right-20 text-white/5 text-[400px] pointer-events-none rotate-12"></i>
      </div>
    </div>
  );
};
