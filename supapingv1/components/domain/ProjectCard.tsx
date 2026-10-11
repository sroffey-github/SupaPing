'use client';

import { Activity, Clock, MoreVertical, Edit2, Trash2, X, Zap } from 'lucide-react'; 
import { updateProject, deleteProject, pingProject } from '@/app/actions'; 
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  url: string;
  anon_key: string;
  last_ping_at: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ... (Keep your existing handleEdit and handleDelete functions here)
  async function handleEdit(formData: FormData) {
    setIsSubmitting(true);
    const result = await updateProject(project.id, formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Project updated successfully');
      setIsEditModalOpen(false);
    } else {
      toast.error('Failed to update: ' + result.error);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    const result = await deleteProject(project.id);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Project deleted');
      setIsDeleteModalOpen(false);
    } else {
      toast.error('Failed to delete: ' + result.error);
    }
  }

  // 3. Create the manual ping handler
  async function handlePing() {
    setIsMenuOpen(false);
    const toastId = toast.loading('Pinging project...');
    
    const result = await pingProject(project.id);
    
    if (result.success) {
      toast.success('Project pinged successfully!', { id: toastId });
    } else {
      toast.error(`Ping failed: ${result.error}`, { id: toastId });
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <h3 className="font-medium text-base-dark">{project.name}</h3>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-400 hover:text-base-dark transition p-1 rounded-md hover:bg-zinc-50"
            >
              <MoreVertical className="size-4" />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                {/* 4. Added the Ping Now button */}
                <button 
                  onClick={handlePing}
                  className="w-full text-left px-3 py-2 text-sm text-base-dark hover:bg-zinc-50 flex items-center gap-2 border-b border-zinc-100"
                >
                  <Zap className="size-3.5 text-yellow-500" /> Ping Now
                </button>
                <button 
                  onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-base-dark hover:bg-zinc-50 flex items-center gap-2"
                >
                  <Edit2 className="size-3.5" /> Edit
                </button>
                <button 
                  onClick={() => { setIsDeleteModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 mb-6 flex-1">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Project URL</p>
            <p className="text-sm text-base-dark truncate bg-zinc-50 px-2 py-1.5 rounded border border-zinc-100 font-mono">
              {project.url}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 text-xs text-base-dim">
          <div className="flex items-center gap-1.5">
            <Activity className="size-3.5" />
            <span>Pinged daily</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span>Last: {project.last_ping_at ? new Date(project.last_ping_at).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-lg font-semibold text-base-dark">Edit Project</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100">
                <X className="size-5" />
              </button>
            </div>
            
            <form className="p-5 space-y-4" action={handleEdit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-base-dark mb-1.5">Project Name</label>
                <input type="text" name="name" defaultValue={project.name} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark focus:outline-none shadow-sm" required />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-base-dark mb-1.5">Project URL</label>
                <input type="url" name="url" defaultValue={project.url} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark focus:outline-none shadow-sm" required />
              </div>
              <div>
                <label htmlFor="anonKey" className="block text-sm font-medium text-base-dark mb-1.5">Anon Key</label>
                <input type="text" name="anonKey" defaultValue={project.anon_key} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-base-dark focus:outline-none shadow-sm font-mono" required />
              </div>

              <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-zinc-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-base-dark bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#374151] rounded-lg hover:bg-[#1f2937] shadow-sm disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 text-center">
              <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="size-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-base-dark mb-2">Delete Project</h2>
              <p className="text-sm text-base-dim mb-6">Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone.</p>
              
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-base-dark bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50">
                  Cancel
                </button>
                <button type="button" onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}