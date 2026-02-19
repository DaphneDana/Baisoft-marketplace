'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<{ name: string; description: string; price: string; image_url: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/manage/${params.id}/`)
      .then(({ data }) => setProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url || '',
      }))
      .catch(() => router.push('/dashboard/products'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleSubmit = async (data: { name: string; description: string; price: string; image_url: string }) => {
    await api.patch(`/products/manage/${params.id}/`, data);
    router.push('/dashboard/products');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/dashboard/products" className="hover:text-blue-600 transition-colors font-medium">Products</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-semibold">Edit Product</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
        <p className="text-slate-500 text-sm mt-0.5">Update the product details below</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Update Product" />
      </div>
    </div>
  );
}
