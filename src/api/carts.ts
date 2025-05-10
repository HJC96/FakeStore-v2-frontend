// src/api/carts.ts
import { api } from './axios';

export interface RawCartItem {
  productId: number;
  quantity: number;
}

export interface RawCart {
  id: number;
  userId: number;
  date: string;
  products: RawCartItem[];
}

export const fetchCartByUserId = (userId: number) => {
  return api.get<RawCart[]>(`/carts?userId=${userId}`);
};