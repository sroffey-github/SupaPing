'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, X, AlertCircle } from 'lucide-react';

export default function KeepAliveSetupBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlString = `CREATE TABLE IF NOT EXISTS keep_alive (
  id INT PRIMARY KEY,
  ping TEXT
);

-- Insert the initial row that SupaPing will update
INSERT INTO keep_alive (id, ping) 
VALUES (1, 'initial_ping') 
ON CONFLICT (id) DO NOTHING;

-- Secure the table
ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;

-- Allow SupaPing (via anon key) to update the row
CREATE POLICY "Allow anon update to keep_alive" 
ON keep_alive FOR UPDATE TO anon 
USING (true) WITH CHECK (true);`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sqlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Banner */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="mb-8 cursor-pointer rounded-xl border border-zinc-300 bg-white p-4 transition-all hover:bg-zinc-50 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-zinc-600" />
          <div className="flex-1">
            <h3 className="font-medium text-base-dark">
              Action Required: Set up your Keep-Alive table
            </h3>
            <p className="text-sm text-base-dim mt-0.5">
              Click here to get the SQL snippet required for SupaPing to prevent your projects from pausing.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-base-dark">
                <Terminal className="h-5 w-5" />
                SQL Setup Script
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-base-dark transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-4 text-sm text-base-dim">
              Run this script in your Supabase SQL Editor for each project you want to keep active. It creates a dedicated table and grants just enough permission for SupaPing to update a single row securely.
            </p>

            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
                <code>{sqlString}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded-md bg-zinc-800 p-2 text-zinc-300 shadow-sm transition-all hover:text-white hover:bg-zinc-700"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}