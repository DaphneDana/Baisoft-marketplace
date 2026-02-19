'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<{ name: string; description: string; price: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/manage/${params.id}/`)
      .then(({ data }) => setProduct({ name: data.name, description: data.description, price: data.price }))
      .catch(() => router.push('/dashboard/products'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleSubmit = async (data: { name: string; description: string; price: string }) => {
    await api.patch(`/products/manage/${params.id}/`, data);
    router.push('/dashboard/products');
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!product) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Update Product" />
    </div>
  );
}
