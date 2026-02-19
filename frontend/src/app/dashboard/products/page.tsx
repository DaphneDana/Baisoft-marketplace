'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import ProductStatusBadge from '@/components/ProductStatusBadge';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  status: string;
  created_by_username: string;
  created_at: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await api.post(`/products/manage/${id}/${action}/`);
      fetchProducts();
    } catch {
      alert(`Failed to ${action} product`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/manage/${id}/`);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  const canEdit = user?.role_name === 'admin' || user?.role_name === 'editor';
  const canApprove = user?.role_name === 'admin' || user?.role_name === 'approver';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {canEdit && (
          <Link
            href="/dashboard/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            New Product
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${product.price}</td>
                  <td className="px-6 py-4"><ProductStatusBadge status={product.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.created_by_username}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {canEdit && (
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    )}
                    {canEdit && product.status === 'draft' && (
                      <button
                        onClick={() => handleAction(product.id, 'submit')}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        Submit
                      </button>
                    )}
                    {canApprove && product.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => handleAction(product.id, 'approve')}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(product.id, 'reject')}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
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
