import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { User, Mail } from 'lucide-react';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch the user's settings (default to 'daily' if they don't have a row yet)
  const { data: settings } = await supabase
    .from('user_settings')
    .select('ping_frequency')
    .eq('user_id', user.id)
    .single();

  const initialFrequency = settings?.ping_frequency || 'daily';

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-base-dark">Settings</h1>
        <p className="text-sm text-base-dim mt-1">Manage your account and application preferences.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-zinc-100 rounded-lg text-base-dark">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-base-dark">Account Profile</h2>
              <p className="text-sm text-base-dim">Your personal account information.</p>
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-base-dark mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed shadow-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Your email address is managed securely via your Google SSO provider.
            </p>
          </div>
        </div>

        {/* Pass the initial data to the form */}
        <SettingsForm initialFrequency={initialFrequency} />
      </div>
    </div>
  );
}