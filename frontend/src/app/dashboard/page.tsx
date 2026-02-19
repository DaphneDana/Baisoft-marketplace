'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RoleBadge from '@/components/RoleBadge';
import ProductStatusBadge from '@/components/ProductStatusBadge';
import api from '@/lib/api';

interface Stats {
  total: number;
  approved: number;
  pending: number;
  draft: number;
}

interface RecentProduct {
  id: number;
  name: string;
  status: string;
  price: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, draft: 0 });
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    api.get('/products/manage/')
      .then(({ data }) => {
        const products = data.results || data;
        setStats({
          total: products.length,
          approved: products.filter((p: { status: string }) => p.status === 'approved').length,
          pending: products.filter((p: { status: string }) => p.status === 'pending_approval').length,
          draft: products.filter((p: { status: string }) => p.status === 'draft').length,
        });
        setRecentProducts(products.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  if (!user) return null;

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      accent: 'border-l-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Approved',
      value: stats.approved,
      accent: 'border-l-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: stats.pending,
      accent: 'border-l-amber-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Drafts',
      value: stats.draft,
      accent: 'border-l-slate-400',
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-0.5 text-sm">Welcome back, {user.first_name || user.username}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {(user.first_name?.[0] || user.username[0]).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user.first_name} {user.last_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">{user.business_name}</span>
              <RoleBadge role={user.role_name} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 border-l-4 ${stat.accent}`}
          >
            <div className={`w-9 h-9 rounded-lg ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/products" className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all p-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Products</p>
                <p className="text-xs text-slate-400 mt-0.5">Manage your business products</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {user.role_name === 'admin' && (
              <Link href="/dashboard/users" className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-md transition-all p-4 group">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                  <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-600 transition-colors">Users</p>
                  <p className="text-xs text-slate-400 mt-0.5">Manage users in your business</p>
                </div>
                <svg className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            <Link href="/" className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all p-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">Public Store</p>
                <p className="text-xs text-slate-400 mt-0.5">View the public marketplace</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Products</h2>
            <Link href="/dashboard/products" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View all →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {recentProducts.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 font-medium">No products yet</p>
                <Link href="/dashboard/products/new" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold mt-2 transition-colors">
                  Create your first product →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-sm font-semibold text-emerald-600">${product.price}</span>
                      <ProductStatusBadge status={product.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
