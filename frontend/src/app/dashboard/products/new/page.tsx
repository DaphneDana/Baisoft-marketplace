'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: { name: string; description: string; price: string; image_url: string }) => {
    await api.post('/products/manage/', data);
    router.push('/dashboard/products');
  };

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
        <span className="text-slate-700 font-semibold">New Product</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New Product</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in the details below to create a new product</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
}
