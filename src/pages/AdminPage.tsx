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
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // PATCH: 가격 수정용 상태
  const [priceEditId, setPriceEditId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title,
      price: parseFloat(price),
      description,
      category,
      image,
    };

    try {
      if (editingId === null) {
        const res = await createProduct(productData);
        alert(`✅ 상품 등록 완료: ${res.data.title}`);
      } else {
        const res = await updateProduct(editingId, productData);
        alert(`✏️ 상품 수정 완료: ${res.data.title}`);
      }

      const updated = await fetchProducts();
      setProducts(updated.data);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteProduct(id);
      const updated = await fetchProducts();
      setProducts(updated.data);
      alert('🗑️ 삭제 완료');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // PATCH: 가격만 수정
  const handlePriceChange = async (id: number, newPrice: string) => {
    try {
      const res = await patchProduct(id, { price: parseFloat(newPrice) });
      alert(`💰 가격 변경 완료: $${res.data.price}`);
      const updated = await fetchProducts();
      setProducts(updated.data);
      setPriceEditId(null);
      setNewPrice('');
    } catch (err) {
      console.error(err);
      alert('가격 변경 실패');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImage('');
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
      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={() => {
                  setPriceEditId(product.id);
                  setNewPrice(String(product.price));
                }}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                💰 가격 수정
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 가격 수정 입력 UI */}
      {priceEditId !== null && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">💸 가격 수정</h3>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="새 가격"
              className="border p-2"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <button
              onClick={() => handlePriceChange(priceEditId, newPrice)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              변경
            </button>
            <button
              onClick={() => {
                setPriceEditId(null);
                setNewPrice('');
              }}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;