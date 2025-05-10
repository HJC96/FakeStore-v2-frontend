// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import { ProductImage } from './product/ProductImage';
import { ProductInfo } from './product/ProductInfo';
import { AddToCartButton } from './product/AddToCartButton';
import { useProductCard } from '../hooks/useProductCard';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useProductCard();

  return (
    <article className="border p-4 rounded shadow hover:shadow-lg">
      <Link 
        to={`/products/${product.id}`}
        className="block"
        aria-label={`${product.title} 상세 정보 보기`}
      >
        <ProductImage product={product} className="mb-2" />
        <ProductInfo product={product} />
      </Link>

      <AddToCartButton 
        product={product}
        onAddToCart={handleAddToCart}
      />
    </article>
  );
}

export default ProductCard;