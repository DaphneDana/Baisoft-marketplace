'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  business_name: string;
  image_url?: string;
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-20 sm:py-28">
            {/* Left: Text */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-blue-100 font-medium">Live marketplace</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                Discover
                <span className="block mt-1 text-blue-200">Amazing Products</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-lg mx-auto lg:mx-0">
                Browse curated products from trusted businesses. Quality you can count on, delivered with care.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
                >
                  Browse Products
                </a>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Start Selling
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Photo */}
            <div className="lg:w-1/2 w-full">
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80"
                  alt="Marketplace shopping"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-100">
            {[
              { value: '500+', label: 'Products Listed' },
              { value: '100+', label: 'Trusted Businesses' },
              { value: '100%', label: 'Quality Verified' },
            ].map(({ value, label }) => (
              <div key={label} className="px-4">
                <p className="text-2xl font-bold text-blue-600">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="mt-2 text-slate-500">Handpicked products from our top-rated businesses</p>
          </div>
          <Link href="/register" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors shrink-0">
            Start selling
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No products available yet.</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to list a product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">We make it simple to buy and sell quality products</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                iconBg: 'bg-blue-100',
                title: 'Verified Quality',
                desc: 'Every product goes through our approval workflow before being listed publicly.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                iconBg: 'bg-violet-100',
                title: 'Fast & Reliable',
                desc: 'Streamlined marketplace built for speed and reliability at every step.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                iconBg: 'bg-emerald-100',
                title: 'Trusted Businesses',
                desc: 'Connect with verified businesses and their carefully curated product lines.',
              },
            ].map(({ icon, iconBg, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to start selling?</h2>
          <p className="mt-3 text-blue-100 max-w-lg mx-auto">Create your business account and list your first product in minutes.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
              Create Account
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-base font-bold">Marketplace</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">A curated marketplace for quality products from verified businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Start Selling</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center pt-8">&copy; 2026 Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
