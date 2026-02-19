import Image from 'next/image';

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  business_name: string;
  image_url?: string;
}

export default function ProductCard({ name, description, price, business_name, image_url }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300">
      <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white rounded-lg px-2.5 py-1 shadow-sm border border-slate-100">
          <span className="text-sm font-bold text-slate-900">${price}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">{name}</h3>
        <p className="text-xs text-blue-500 font-semibold mt-1">{business_name}</p>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
