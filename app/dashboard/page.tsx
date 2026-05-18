'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/categories';
import { getRegions } from '@/lib/gi-regions';
import { getProducts } from '@/lib/products';
import { getUsers } from '@/lib/users';
import { getAllOrders } from '@/lib/orders';
import { getAllSellers } from '@/lib/sellers';
import { getPendingProducts } from '@/lib/product_approval';

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    categories: 0,
    regions: 0,
    products: 0,
    users: 0,
    orders: 0,
    sellers: 0,
    pendingApprovals: 0,
    pendingSellerApprovals: 0,
  });

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    const loadCounts = async () => {
      try {
        let users = { data: [] };
        let sellers = { data: [] };

        if (storedRole === 'ADMIN') {
          users = await getUsers();
          sellers = await getAllSellers();
        }

        const pendingSellers =
          sellers.data.filter(
            (s: any) => s.status === 'PENDING'
          ).length;

        let a = { data: [] };
        if (storedRole === 'ADMIN') {
          a = await getPendingProducts();
        }

        const [c, r, p, o] = await Promise.all([
          getCategories(),
          getRegions(),
          getProducts(),
          getAllOrders(),
        ]);

        setCounts({
          categories: c.data.length,
          regions: r.data.length,
          products: p.data.length,
          users: users.data.length,
          orders: o?.data?.length || 0,
          sellers: sellers.data.length,
          pendingApprovals: a.data.length,
          pendingSellerApprovals: pendingSellers,
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
        Here's a quick overview of your platform's stats.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Categories */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/categories"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
              Categories
            </h2>
            <p className="text-xl font-bold mt-2">{counts.categories}</p>
          </Link>)
        }

        {/* GI Regions */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/gi-regions"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
              GI Regions
            </h2>
            <p className="text-xl font-bold mt-2">{counts.regions}</p>
          </Link>)
        }

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

        {/* Users */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/users"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
              Users
            </h2>
            <p className="text-xl font-bold mt-2">{counts.users}</p>
          </Link>)
        }

        {/* orders */}
        <Link
          href="/dashboard/orders"
          className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
        >
          <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
            Orders
          </h2>
          <p className="text-xl font-bold mt-2">{counts.orders}</p>
        </Link>

        {/* sellers */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/sellers"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
              Sellers
            </h2>
            {counts.pendingSellerApprovals > 0 && (
              <p className="text-xl font-bold mt-2">{counts.sellers}</p>
            )}
          </Link>)
        }

        {/* Product Approval */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/product-approval"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
                Product Approval
              </h2>
              {/* 🔴 RED DOT */}
              {counts.pendingApprovals > 0 && (
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-xl font-bold mt-2">{counts.pendingApprovals}</p>
          </Link>)
        }

        {/* Seller Approval */}
        {
          role == 'ADMIN' && (<Link
            href="/dashboard/seller-approval"
            className="rounded-xl bg-slate-50 p-6 border block hover:border-indigo-600 transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black hover:text-indigo-600 transition">
                Seller Approval
              </h2>
              {/* 🔴 RED DOT */}
              {counts.pendingSellerApprovals > 0 && (
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-xl font-bold mt-2">{counts.pendingSellerApprovals}</p>
          </Link>)
        }

      </div>
    </div>
  );
}
