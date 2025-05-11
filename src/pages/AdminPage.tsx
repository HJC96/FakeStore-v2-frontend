// src/pages/AdminPage.tsx

import { useEffect, useState } from 'react';
import {
  createProduct,
  fetchProducts,
  updateProduct,
  deleteProduct,
  patchProduct,
} from '../api/products';
import { Product } from '../types/Product';

function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [priceEditId, setPriceEditId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState('');

  // 폼 상태
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  // 상품 목록 불러오기
  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data.dtoList))
      .catch((err) => console.error(err));
  }, []);

  // 폼 초기화
  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImage('');
    setEditingId(null);
  };

  // 상품 등록/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      price: Number(price),
      description,
      category,
      image,
      rating: {
        rate: 0,
        count: 0
      }
    };

    try {
      if (editingId === null) {
        // 등록
        await createProduct(productData);
        alert('✅ 등록 완료');
      } else {
        // 수정
        await updateProduct(editingId, productData);
        alert('✏️ 수정 완료');
      }

      // 목록 새로고침
      const updated = await fetchProducts();
      setProducts(updated.data.dtoList);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('❌ 실패');
    }
  };

  // 상품 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteProduct(id);
      const updated = await fetchProducts();
      setProducts(updated.data.dtoList);
      alert('🗑️ 삭제 완료');
    } catch (err) {
      console.error(err);
      alert('❌ 삭제 실패');
    }
  };

  // 가격 수정
  const handlePriceEdit = async (id: number) => {
    if (!newPrice) return;

    try {
      const res = await patchProduct(id, { price: Number(newPrice) });
      alert(`💰 가격 변경 완료: $${res.data.price}`);
      const updated = await fetchProducts();
      setProducts(updated.data.dtoList);
      setPriceEditId(null);
      setNewPrice('');
    } catch (err) {
      console.error(err);
      alert('❌ 가격 변경 실패');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingId === null ? '📦 상품 등록' : '✏️ 상품 수정'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="상품명"
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="가격"
          className="w-full border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="카테고리"
          className="w-full border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="이미지 URL"
          className="w-full border p-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <textarea
          placeholder="상품 설명"
          className="w-full border p-2 h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingId === null ? '등록하기' : '수정 완료'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold mb-2">📋 상품 목록</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{product.title}</h3>
              <p className="text-gray-600">${product.price}</p>
            </div>
            <div className="flex gap-2">
              {priceEditId === product.id ? (
                <>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="border p-1 w-24"
                    placeholder="새 가격"
                  />
                  <button
                    onClick={() => handlePriceEdit(product.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    확인
                  </button>
                  <button
                    onClick={() => {
                      setPriceEditId(null);
                      setNewPrice('');
                    }}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPriceEditId(product.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    가격 수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;