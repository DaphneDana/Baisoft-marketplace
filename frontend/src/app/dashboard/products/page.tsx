'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import ProductStatusBadge from '@/components/ProductStatusBadge';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  status: string;
  image_url?: string;
  created_by_username: string;
  created_at: string;
}

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'pending_approval', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
];

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchProducts = () => {
    api.get('/products/manage/')
      .then(({ data }) => setProducts(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAction = async (id: number, action: string) => {
    setActionError(null);
    try {
      await api.post(`/products/manage/${id}/${action}/`);
      fetchProducts();
    } catch {
      setActionError(`Failed to ${action} product`);
    }
  };

  const handleDelete = async (id: number) => {
    setActionError(null);
    try {
      await api.delete(`/products/manage/${id}/`);
      setConfirmDelete(null);
      fetchProducts();
    } catch {
      setActionError('Failed to delete product');
      setConfirmDelete(null);
    }
  };

  const canEdit = user?.role_name === 'admin' || user?.role_name === 'editor';
  const canApprove = user?.role_name === 'admin' || user?.role_name === 'approver';

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.status === activeFilter);

  const counts = {
    all: products.length,
    draft: products.filter((p) => p.status === 'draft').length,
    pending_approval: products.filter((p) => p.status === 'pending_approval').length,
    approved: products.filter((p) => p.status === 'approved').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} products total</p>
        </div>
        {canEdit && (
          <Link href="/dashboard/products/new" className="btn-primary flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Product
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              activeFilter === key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
              activeFilter === key ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {counts[key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-4 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-14 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">
            {activeFilter === 'all' ? 'No products yet.' : `No ${activeFilter === 'pending_approval' ? 'pending' : activeFilter} products.`}
          </p>
          {canEdit && activeFilter === 'all' && (
            <Link href="/dashboard/products/new" className="btn-primary inline-flex items-center gap-1.5 mt-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created by</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">${product.price}</td>
                  <td className="px-6 py-4"><ProductStatusBadge status={product.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-400">{product.created_by_username}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {canEdit && (
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </Link>
                      )}
                      {canEdit && product.status === 'draft' && (
                        <button
                          onClick={() => handleAction(product.id, 'submit')}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        >
                          Submit
                        </button>
                      )}
                      {canApprove && product.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleAction(product.id, 'approve')}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(product.id, 'reject')}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {canEdit && (
                        confirmDelete === product.id ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-xs text-slate-400">Sure?</span>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              No
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            Delete
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
