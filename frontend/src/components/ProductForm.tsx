'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: {
    name: string;
    description: string;
    price: string;
    image_url?: string;
  };
  onSubmit: (data: { name: string; description: string; price: string; image_url: string }) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({ initialData, onSubmit, submitLabel }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ name, description, price, image_url: imageUrl });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Something went wrong';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Product Details */}
      <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Product Details</p>
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Describe your product..."
          />
        </div>
      </div>

      {/* Pricing & Media */}
      <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Pricing &amp; Media</p>
        <div>
          <label className="label">Price</label>
          <div className="relative mt-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input-field pl-7 mt-0"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label className="label">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
            placeholder="https://images.unsplash.com/..."
          />
          {imageUrl && (
            <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-slate-100">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="600px"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary flex items-center gap-2"
      >
        {submitting && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
