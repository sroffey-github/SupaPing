import React from 'react';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
        <div className="p-8 text-center border-b border-zinc-100 bg-zinc-50/50">
          {/* Logo */}
          <div className="size-12 rounded-xl bg-[#374151] flex items-center justify-center shadow-sm mx-auto mb-4">
            <svg className="size-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75L12 12m0 0l3.75 3.75M12 12V3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9.75a7.5 7.5 0 00-15 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-base-dark mb-2">Welcome to SupaPing</h1>
          <p className="text-sm text-base-dim">
            Keep your free-tier Supabase projects awake and active automatically.
          </p>
        </div>
        
        <div className="p-8">
          <GoogleLoginButton />
          
          <p className="text-xs text-center text-zinc-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}