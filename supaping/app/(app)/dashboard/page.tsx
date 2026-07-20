import React from 'react';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-base-dark">Dashboard</h1>
        <p className="text-sm text-base-dim mt-1">Welcome back to SupaPing.</p>
      </header>
      
      <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="size-12 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h2 className="text-lg font-medium text-base-dark mb-2">You're all set!</h2>
        <p className="text-sm text-base-dim max-w-md">
          Head over to the Projects tab to start adding your Supabase databases to the daily ping schedule.
        </p>
      </div>
    </div>
  );
}