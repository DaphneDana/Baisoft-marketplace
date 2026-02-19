'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import RoleBadge from '@/components/RoleBadge';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome, {user.first_name || user.username}</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Business: <span className="font-medium text-gray-900">{user.business_name}</span></p>
          <p>Role: <RoleBadge role={user.role_name} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/products"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Products</h3>
          <p className="text-sm text-gray-600 mt-1">View and manage your business products</p>
        </Link>

        {user.role_name === 'admin' && (
          <Link
            href="/dashboard/users"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Users</h3>
            <p className="text-sm text-gray-600 mt-1">Manage users in your business</p>
          </Link>
        )}

        <Link
          href="/"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Public Marketplace</h3>
          <p className="text-sm text-gray-600 mt-1">View the public product listing</p>
        </Link>
      </div>
    </div>
  );
}
