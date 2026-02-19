'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: { name: string; description: string; price: string }) => {
    await api.post('/products/manage/', data);
    router.push('/dashboard/products');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Product</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}
