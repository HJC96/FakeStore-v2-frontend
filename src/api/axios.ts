// src/api/axios.ts
import axios from 'axios';

// 공용 API용 axios 인스턴스
export const publicApi = axios.create({
  baseURL: 'http://localhost:8080',
});

// 인증이 필요한 API용 axios 인스턴스
export const authApi = axios.create({
  baseURL: 'http://localhost:8080',
});

// 요청 인터셉터 추가
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);