'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileStack, Settings, Search, Mic, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Logo from './Logo'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FileStack },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    
    // Tell Supabase to clear the session
    await supabase.auth.signOut();
    
    // Force a router refresh to re-evaluate the middleware and redirect to home
    router.refresh();
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen p-6 bg-base flex flex-col gap-8 border-r border-[#e2e8f0]">
      <Logo />

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-[#9ca3af]" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full h-11 pl-11 pr-11 bg-search rounded-full text-base-dark placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-base-dark/20 text-sm"
        />
        <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#9ca3af] hover:text-base-dark hover:bg-zinc-100 transition">
          <Mic className="size-5" />
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-3 h-11 px-3.5 text-base-dim font-medium hover:text-base-dark transition ${
                    isActive ? 'active-link' : ''
                  }`}
                >
                  <Icon
                    className={`size-5 transition ${
                      isActive ? 'text-base-dark' : 'text-base-dim'
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button Pushed to Bottom */}
      <div className="mt-auto pt-6 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 h-11 px-3.5 text-base-dim font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
        >
          <LogOut className="size-5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;