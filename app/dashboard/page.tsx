'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Welcome back 👋
      </h1>
      <p className="text-slate-600">
        Manage products, categories and GI regions from here.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="rounded-xl bg-slate-50 p-6 border">
          <p className="text-sm text-slate-500">Categories</p>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-6 border">
          <p className="text-sm text-slate-500">GI Regions</p>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-6 border">
          <p className="text-sm text-slate-500">Products</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
}
