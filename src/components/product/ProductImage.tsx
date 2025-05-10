import { Product } from '../../types/Product';

interface ProductImageProps {
  product: Product;
  className?: string;
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  return (
    <img
      src={product.image}
      alt={product.title}
      className={`w-full h-40 object-contain ${className}`}
      loading="lazy"
    />
  );
} 