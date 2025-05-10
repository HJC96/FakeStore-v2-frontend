import { Product } from '../../types/Product';

interface AddToCartButtonProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export function AddToCartButton({ product, onAddToCart, className = '' }: AddToCartButtonProps) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className={`mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm ${className}`}
      aria-label={`${product.title} 장바구니에 담기`}
    >
      장바구니 담기
    </button>
  );
} 