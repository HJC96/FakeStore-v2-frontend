// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // 장바구니 훅 import

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); // 장바구니 추가 함수 사용

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      {/* 클릭 시 상세 페이지로 이동 */}
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-contain mb-2"
        />
        <h2 className="text-sm font-bold truncate">{product.title}</h2>
        <p className="text-blue-500 font-semibold">${product.price}</p>
      </Link>

      {/* 장바구니 담기 버튼 */}
      <button
        onClick={() => addToCart(product)}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm"
      >
        장바구니 담기
      </button>
    </div>
  );
}

export default ProductCard;