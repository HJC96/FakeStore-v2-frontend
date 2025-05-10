import { Product } from '../../types/Product';

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export function ProductInfo({ product, className = '' }: ProductInfoProps) {
  return (
    <div className={className}>
      <h2 className="text-sm font-bold truncate" title={product.title}>
        {product.title}
      </h2>
      <p className="text-blue-500 font-semibold">${product.price}</p>
    </div>
  );
} 