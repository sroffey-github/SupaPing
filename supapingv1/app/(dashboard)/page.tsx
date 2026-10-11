import React from 'react';
import { getProjects } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import AddProjectModal from '@/components/domain/AddProjectModal';
import ProjectCard from '@/components/domain/ProjectCard';
import SettingsModal from '@/components/domain/SettingsModal';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; 

  const [projects, { data: settings }] = await Promise.all([
    getProjects(),
    supabase.from('user_settings').select('ping_frequency').eq('user_id', user.id).single()
  ]);

  const initialFrequency = settings?.ping_frequency || 'daily';

  return (
    <div className="h-full flex flex-col">
      <header className="relative flex items-center justify-center mb-10 pt-4">
        <h1 className="text-3xl font-bold text-base-dark tracking-tight">SupaPing</h1>
        
        <div className="absolute right-0 flex items-center gap-3">
          <AddProjectModal />
          <SettingsModal initialFrequency={initialFrequency} userEmail={user.email || ''} />
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-zinc-300 rounded-xl py-20 text-center">
          <p className="text-base-dark font-medium mb-1">No projects found</p>
          <p className="text-sm text-base-dim mb-4">Add your first Supabase project to start monitoring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}