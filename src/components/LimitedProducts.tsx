// src/components/LimitedProducts.tsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from './ProductCard';

interface Props {
  limit: number;
}

export default function LimitedProducts({ limit }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit })
      .then((res) => setProducts(res.data.dtoList))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}