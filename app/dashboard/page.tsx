'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/categories';
import { getRegions } from '@/lib/gi-regions';
import { getProducts } from '@/lib/products';

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    categories: 0,
    regions: 0,
    products: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [c, r, p] = await Promise.all([
          getCategories(),
          getRegions(),
          getProducts(),
        ]);

        setCounts({
          categories: c.data.length,
          regions: r.data.length,
          products: p.data.length,
        });
      } catch (err) {
        console.error('Failed to load dashboard counts', err);
      }
    };

    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Welcome back 👋
      </h1>
      <p className="text-slate-600">
        Manage products, categories and GI regions from here.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Categories */}
        <Link
          href="/dashboard/categories"
          className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
        >
          <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
            Categories
          </h2>
          <p className="text-xl font-bold mt-2">{counts.categories}</p>
        </Link>

        {/* GI Regions */}
        <Link
          href="/dashboard/gi-regions"
          className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
        >
          <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
            GI Regions
          </h2>
          <p className="text-xl font-bold mt-2">{counts.regions}</p>
        </Link>

        {/* Products */}
        <Link
          href="/dashboard/products"
          className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
        >
          <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
            Products
          </h2>
          <p className="text-xl font-bold mt-2">{counts.products}</p>
        </Link>
      </div>
    </div>
  );
}

