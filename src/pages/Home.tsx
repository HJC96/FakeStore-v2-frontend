// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';

const ITEMS_PER_PAGE = 6;

function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지에 해당하는 상품만 잘라서 보여주기
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchProducts()
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🛒 상품 목록</h1>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;