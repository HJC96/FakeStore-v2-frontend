// src/api/products.ts
import { api } from './axios';
import { Product } from '../types/Product';

// 옵션 기반 통합 상품 조회 함수
export const fetchProducts = (options?: { category?: string; limit?: number }) => {
  // fakestore에서는 limit은 category랑 같이 못 씀
  if (options?.category && options?.limit) {
    console.warn('⚠️ category와 limit은 fakestore API에서 함께 사용 불가');
  }

  let url = '/products';

  if (options?.category) {
    url = `/products/category/${options.category}`;
    return api.get<Product[]>(url); // 바로 반환
  }

  // limit만 적용되는 경우
  if (options?.limit) {
    url += `?limit=${options.limit}`;
  }

  return api.get<Product[]>(url);
};

export const fetchProductById = (id: number) => {
  return api.get<Product>(`/products/${id}`);
};

// src/api/products.ts
export const fetchCategories = () => {
  return api.get<string[]>('/products/categories');
};

// export const fetchProductsByCategory = (category: string) => {
//   return api.get<Product[]>(`/products/category/${category}`);
// };

// 상품 추가 요청 - POST /products
export const createProduct = (newProduct: Omit<Product, 'id'>) => {
  return api.post<Product>('/products', newProduct);
};

// src/api/products.ts

// 상품 전체 수정 - PUT
export const updateProduct = (id: number, updatedProduct: Omit<Product, 'id'>) => {
  return api.put<Product>(`/products/${id}`, updatedProduct);
};

// 상품 삭제 요청
export const deleteProduct = (id: number) => {
  return api.delete(`/products/${id}`);
};

// 상품 부분 수정 - PATCH
export const patchProduct = (id: number, partialData: Partial<Omit<Product, 'id'>>) => {
  return api.patch<Product>(`/products/${id}`, partialData);
};