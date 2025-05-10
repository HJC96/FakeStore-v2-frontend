import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';

export function useProductCard() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return {
    handleAddToCart,
  };
} 