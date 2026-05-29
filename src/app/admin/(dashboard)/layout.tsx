import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, FileText, Home, LogOut, Package } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Briefcase },
    { name: 'Quote Inquiries', href: '/admin/quotes', icon: FileText },
    { name: 'Enterprise ERP', href: '/admin/erp', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 flex flex-col md:flex-row transition-colors">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-gray-200/60 dark:border-slate-700/60 flex flex-col justify-between flex-shrink-0 shadow-sm md:sticky md:top-0 md:h-screen">
        
        {/* Top Portion */}
        <div>
          {/* Brand/Logo */}
          <div className="h-20 px-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-blue-400" />
            <span className="font-heading font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
              MediTex Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {sidebarLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-bold text-gray-650 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                >
                  <IconComp className="w-5 h-5 flex-shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700/60 space-y-2">
          {/* Public Website shortcut */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            Return to Public Site
          </Link>
          
          {/* Logout Action */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </form>
        </div>

      </aside>

      {/* 2. INNER PAGE WORKSPACE */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
