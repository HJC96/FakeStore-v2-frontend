// src/api/products.ts
import { authApi } from './axios';
import { Product, ProductListResponse } from '../types/Product';

// 옵션 기반 통합 상품 조회 함수
export const fetchProducts = (options?: { 
  category?: string; 
  limit?: number;
  page?: number;
  size?: number;
}) => {
  let url = '/products';

  // 쿼리 파라미터 구성
  const params = new URLSearchParams();
  
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  
  if (options?.size) {
    params.append('size', options.size.toString());
  }

  if (options?.category) {
    url = `/products/category/${options.category}`;
  }

  // 쿼리 파라미터가 있으면 URL에 추가
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return authApi.get<ProductListResponse>(url);
};

export const fetchProductById = (id: number) => {
  return authApi.get<Product>(`/products/${id}`);
};

// src/api/products.ts
export const fetchCategories = () => {
  return authApi.get<string[]>('/products/categories');
};

// export const fetchProductsByCategory = (category: string) => {
//   return api.get<Product[]>(`/products/category/${category}`);
// };

// 상품 추가 요청 - POST /products
export const createProduct = (newProduct: Omit<Product, 'id'>) => {
  return authApi.post<Product>('/products', newProduct);
};

// src/api/products.ts

// 상품 전체 수정 - PUT
export const updateProduct = (id: number, updatedProduct: Omit<Product, 'id'>) => {
  return authApi.put<Product>(`/products/${id}`, updatedProduct);
};

// 상품 삭제 요청
export const deleteProduct = (id: number) => {
  return authApi.delete(`/products/${id}`);
};

// 상품 부분 수정 - PATCH
export const patchProduct = (id: number, partialData: Partial<Omit<Product, 'id'>>) => {
  return authApi.patch<Product>(`/products/${id}`, partialData);
};