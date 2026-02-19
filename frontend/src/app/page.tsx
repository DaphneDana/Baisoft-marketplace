'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  business_name: string;
  created_at: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/public/')
      .then(({ data }) => setProducts(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Marketplace</h1>
      <p className="text-gray-600 mb-8">Browse approved products from our businesses</p>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
