'use client';

import React, { useState } from 'react';
import { Settings2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { updatePingFrequency } from './actions';

export default function SettingsForm({ initialFrequency }: { initialFrequency: string }) {
  const [frequency, setFrequency] = useState(initialFrequency);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Call our server action
    const result = await updatePingFrequency(frequency);
    
    if (result.success) {
      toast.success('Preferences updated successfully!');
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
    <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-zinc-100 rounded-lg text-base-dark">
          <Settings2 className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-base-dark">Application Preferences</h2>
          <p className="text-sm text-base-dim">Configure how SupaPing interacts with your projects.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-dark mb-1">Ping Frequency</label>
          <p className="text-sm text-base-dim mb-4">
            Supabase pauses free projects after 7 days of inactivity. Choose how often we should wake them up.
          </p>
        </div>

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
      </div>

      <div className="pt-6 mt-6 border-t border-zinc-100 flex justify-end">
        <button
          type="submit"
          disabled={isSaving || frequency === initialFrequency} // Also disable if no changes made
          className="px-4 py-2 text-sm font-medium text-white bg-[#374151] rounded-lg hover:bg-[#1f2937] transition shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
}