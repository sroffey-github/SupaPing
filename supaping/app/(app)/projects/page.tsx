import React from 'react';
import { getProjects } from './actions';
import AddProjectModal from './AddProjectModal';
import ProjectCard from './ProjectCard';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-base-dark">Projects</h1>
          <p className="text-sm text-base-dim mt-1">Manage the Supabase projects you want to keep active.</p>
        </div>
        <AddProjectModal />
      </header>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-zinc-300 rounded-xl py-16 text-center">
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