interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  business_name: string;
}

export default function ProductCard({ name, description, price, business_name }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">by {business_name}</p>
      <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
      <p className="text-xl font-bold text-blue-600 mt-4">${price}</p>
    </div>
  );
}
