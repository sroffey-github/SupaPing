'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { addProject } from './actions';
import toast from 'react-hot-toast';

export default function AddProjectModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-semibold text-base-dark">Add New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition p-1 rounded-md hover:bg-zinc-100"
              >
                <X className="size-5" />
              </button>
            </div>
            
            {/* The action attribute calls our Server Action */}
            <form className="p-5 space-y-4" action={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-base-dark mb-1.5">Project Name</label>
                <input 
                  type="text" 
                  name="name"
                  id="name"
                  placeholder="e.g. My Portfolio Blog"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none shadow-sm"
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
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none shadow-sm"
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
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark placeholder:text-zinc-400 focus:outline-none shadow-sm font-mono"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1.5">We use this public key to make a secure read-only request to your API.</p>
              </div>

              <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-zinc-100">
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