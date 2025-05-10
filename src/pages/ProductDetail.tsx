// src/pages/ProductDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { Product } from '../types/Product';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchProductById(Number(id))
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>상품을 찾을 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-60 object-contain mb-4"
      />
      <h1 className="text-xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-blue-500 font-semibold text-lg">${product.price}</p>
      <p className="text-sm text-gray-500 mt-2">카테고리: {product.category}</p>
    </div>
  );
}

export default ProductDetail;