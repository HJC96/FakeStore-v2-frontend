// src/components/LimitedProducts.tsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from './ProductCard';

interface Props {
  limit: number;
}

function LimitedProducts({ limit }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">🔥 인기 상품 Top {limit}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default LimitedProducts;