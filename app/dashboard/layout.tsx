'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading admin dashboard...
      </div>
    );
  }

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${pathname === path
      ? 'bg-indigo-600 text-white shadow'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      {/* Sidebar (FIXED) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0f172a] text-white p-6">
        <div className="mb-10">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition">
              GiTagged
            </h1>
            <p className="text-sm text-slate-400">Admin Dashboard</p>
          </Link>
        </div>

        <nav>
          <Link
            href="/dashboard/categories"
            className={linkClass('/dashboard/categories')}
          >
            📂 Categories
          </Link>

          <Link
            href="/dashboard/gi-regions"
            className={linkClass('/dashboard/gi-regions')}
          >
            🌍 GI Regions
          </Link>

          <Link
            href="/dashboard/products"
            className={linkClass('/dashboard/products')}
          >
            🛒 Products
          </Link>

          <Link
            href="/dashboard/users"
            className={linkClass('/dashboard/users')}
          >
            👤 Users
          </Link>

        </nav>
      </aside>

      {/* Main Content (SCROLLABLE) */}
      <main className="ml-72 h-screen overflow-y-auto p-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
