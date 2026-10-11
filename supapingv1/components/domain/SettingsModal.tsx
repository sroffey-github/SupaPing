'use client';

import React, { useState } from 'react';
import { Settings, X, User, Mail, Settings2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { updatePingFrequency } from '@/app/actions';

export default function SettingsModal({ initialFrequency, userEmail }: { initialFrequency: string, userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState(initialFrequency);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await updatePingFrequency(frequency);
    
    if (result.success) {
      toast.success('Preferences updated successfully!');
      setIsOpen(false);
    } else {
      toast.error('Failed to update: ' + result.error);
    }
    setIsSaving(false);
  };

  const frequencyOptions = [
    { id: 'daily', label: 'Daily', desc: 'Every 24 hours', recommended: true },
    { id: '3_days', label: 'Every 3 Days', desc: 'Saves API calls', recommended: false },
    { id: '5_days', label: 'Every 5 Days', desc: 'Cutting it close', recommended: false },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition"
        title="Settings"
      >
        <Settings className="size-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-semibold text-base-dark">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {/* Account Profile Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-zinc-100 rounded-lg text-base-dark">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-base-dark">Account Profile</h3>
                    <p className="text-sm text-base-dim">Your personal account information.</p>
                  </div>
                </div>

                <div className="max-w-md ml-12">
                  <label className="block text-sm font-medium text-base-dark mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      type="email"
                      defaultValue={userEmail}
                      disabled
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed shadow-sm focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Your email address is managed securely via your Google SSO provider.
                  </p>
                </div>
              </div>

              <hr className="border-zinc-100 mb-8" />

              {/* Preferences Section */}
              <form onSubmit={handleSave}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-zinc-100 rounded-lg text-base-dark">
                    <Settings2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-base-dark">Application Preferences</h3>
                    <p className="text-sm text-base-dim">Configure how SupaPing interacts with your projects.</p>
                  </div>
                </div>

                <div className="ml-12 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {frequencyOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`relative flex flex-col p-4 cursor-pointer border rounded-xl transition-all ${
                          frequency === option.id
                            ? 'border-[#374151] bg-zinc-50 ring-1 ring-[#374151]'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={option.id}
                          checked={frequency === option.id}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-base-dark">{option.label}</span>
                          {option.recommended && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-base-dim flex items-center gap-1.5 mt-auto pt-3">
                          <Clock className="size-3.5" />
                          {option.desc}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="pt-6 mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving || frequency === initialFrequency}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#374151] rounded-lg hover:bg-[#1f2937] transition shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}