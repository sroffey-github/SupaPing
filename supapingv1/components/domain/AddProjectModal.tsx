'use client';

import React, { useState } from 'react';
import { Plus, X, Terminal, Copy, Check } from 'lucide-react';
import { addProject } from '@/app/actions';
import toast from 'react-hot-toast';

export default function AddProjectModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlString = `CREATE TABLE IF NOT EXISTS keep_alive (
  id INT PRIMARY KEY,
  ping TEXT
);

-- 1. Grant base table permissions to the API
GRANT SELECT, UPDATE ON keep_alive TO anon;

-- 2. Insert the initial row
INSERT INTO keep_alive (id, ping) 
VALUES (1, 'initial_ping') 
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security
ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;

-- 4. Allow SupaPing (via anon key) to read the row
CREATE POLICY "Allow anon select to keep_alive" 
ON keep_alive FOR SELECT TO anon 
USING (true);

-- 5. Allow SupaPing (via anon key) to update the row
CREATE POLICY "Allow anon update to keep_alive" 
ON keep_alive FOR UPDATE TO anon 
USING (true) WITH CHECK (true);`;

  async function handleCopy() {
    await navigator.clipboard.writeText(sqlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const result = await addProject(formData);
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Project added successfully!');
      setIsModalOpen(false);
    } else {
      toast.error("Failed to add project: " + result.error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-[#374151] hover:bg-[#1f2937] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
      >
        <Plus className="size-4" />
        Add Project
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-semibold text-base-dark">Add New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition p-1 rounded-md hover:bg-zinc-100"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form className="p-5 space-y-5" action={handleSubmit}>
              
              {/* SQL Setup Instructions Box */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Terminal className="size-5 text-zinc-600 mt-0.5 shrink-0" />
                  <div className="w-full min-w-0">
                    <h3 className="text-sm font-medium text-base-dark">Required: Database Setup</h3>
                    <p className="text-xs text-base-dim mt-1 mb-3">
                      Before adding your project, run this script in your Supabase SQL Editor. It creates a table for SupaPing to safely ping.
                    </p>
                    <div className="relative group">
                      <pre className="text-[11px] leading-relaxed bg-zinc-900 text-zinc-300 p-3 rounded-md overflow-y-auto max-h-32 shadow-inner font-mono scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                        <code>{sqlString}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-2 top-2 p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-base-dark mb-1.5">Project Name</label>
                <input 
                  type="text" 
                  name="name"
                  id="name"
                  placeholder="e.g. My Portfolio Blog"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none focus:border-[#374151] focus:ring-1 focus:ring-[#374151] shadow-sm transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-base-dark mb-1.5">Project URL</label>
                <input 
                  type="url" 
                  name="url"
                  id="url"
                  placeholder="https://[PROJECT-REF].supabase.co"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none focus:border-[#374151] focus:ring-1 focus:ring-[#374151] shadow-sm transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="anonKey" className="block text-sm font-medium text-base-dark mb-1.5">Anon Key</label>
                <input 
                  type="text" 
                  name="anonKey"
                  id="anonKey"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none focus:border-[#374151] focus:ring-1 focus:ring-[#374151] shadow-sm transition font-mono"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1.5">We use this key to update the keep_alive table via your project's API.</p>
              </div>

              <div className="pt-2 mt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-base-dark bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#374151] rounded-lg hover:bg-[#1f2937] transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}