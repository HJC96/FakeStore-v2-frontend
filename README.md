# README
# 0. Fakestore 프론트엔드 개발

이 프로젝트는 [Fake Store API](https://github.com/HJC96/FakeStore-v2)를 기반으로 한 쇼핑몰 프론트엔드입니다.  
React + TypeScript + Tailwind CSS를 활용하여 구현합니다.

⚙️ 사용 기술 스택
- React (with Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router

📁 디렉토리 구조
~~~plaintext
fakestore-v2-frontend/
├── src/                      # 소스 코드 메인 디렉토리
│   ├── api/                  # API 통신 관련 모듈
│   │   ├── axios.ts         # Axios 인스턴스 설정
│   │   ├── carts.ts         # 장바구니 관련 API 함수
│   │   └── products.ts      # 상품 관련 API 함수
│   │
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── CategoryFilter.tsx    # 카테고리 필터링 컴포넌트
│   │   ├── Header.tsx           # 헤더 네비게이션 컴포넌트
│   │   ├── LimitedProducts.tsx  # 제한된 상품 목록 컴포넌트
│   │   └── ProductCard.tsx      # 상품 카드 컴포넌트
│   │
│   ├── contexts/           # React Context 관련
│   │   └── CartContext.tsx # 장바구니 상태 관리 컨텍스트
│   │
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── AdminPage.tsx  # 관리자 페이지 (상품 관리)
│   │   ├── CartPage.tsx   # 장바구니 페이지
│   │   ├── Home.tsx       # 메인 페이지
│   │   └── ProductDetail.tsx # 상품 상세 페이지
│   │
│   ├── types/             # TypeScript 타입 정의
│   │   └── Product.ts     # 상품 관련 타입 정의
│   │
│   ├── App.tsx            # 메인 App 컴포넌트
│   ├── index.tsx          # 앱 진입점
│   ├── index.css          # 전역 스타일
│   └── ...               # 기타 설정 파일들
│
├── public/               # 정적 파일 디렉토리
├── build/               # 빌드 결과물 디렉토리
├── node_modules/        # npm 패키지 디렉토리
├── package.json         # 프로젝트 설정 및 의존성 정보
├── tsconfig.json        # TypeScript 컴파일러 설정
├── tailwind.config.js   # Tailwind CSS 설정
└── postcss.config.js    # PostCSS 설정
~~~

# 1. 프로젝트 세팅
1) nvm 설치
~~~bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
~~~
2) Node.js 설치 및 사용
~~~bash
nvm install 18
nvm use 18
~~~
3) 프로젝트 생성
~~~bash
npx create-react-app fakestore-v2-frontend --template typescript
~~~
# 2. Tailwind CSS 설치 및 설정

1) Tailwind 관련 패키지 설치
~~~plaintext
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17
./node_modules/.bin/tailwindcss init -p
~~~
2) tailwind.config.js 수정
~~~javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
~~~
3) src/index.css 수정 및 테스트
src/index.css 파일에 다음 내용을 추가
~~~css
@tailwind base;
@tailwind components;
@tailwind utilities;
~~~

src/App.tsx에 테스트 스타일 추가한 후 테스트
~~~tsx
function App() {
  return (
    <div className="text-3xl font-bold text-blue-600">
      🛍️ Welcome to Fakestore!
    </div>
  );
}
~~~
![](image.png)<!-- {"width":389} -->
# 3. 라우터 설치 및 기본 페이지 구성
1) 리액트 라우터 설치
~~~bash
npm install react-router-dom
~~~
2) 라우팅 구조 잡기
~~~tsx
// src/pages/Home.tsx
function Home() {
  return <div className="p-4 text-lg font-bold">🏠 Home Page</div>;
}

export default Home;

// src/pages/ProductDetail.tsx
function ProductDetail() {
  return <div className="p-4 text-lg font-bold">🛍️ Product Detail Page</div>;
}

export default ProductDetail;
~~~

~~~tsx
// src/App.tsx <- 앱의 시작점에서 전체 구조를 설정하는 진입 파일
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/products" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/" element={<Navigate to="/products" />} />  {/* 루트로 들어오면 자동 이동 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;


~~~
# 4. 구현
## 4.1 GET /products 상품 리스트 
1) 타입 정의
~~~ts
// src/types/Product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
~~~
2) Axios 인스턴스 생성
~~~ts
// src/api/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});
~~~
3) 상품 목록 가져오는 API 함수 작성
~~~ts
// src/api/products.ts
import { api } from './axios';
import { Product } from '../types/Product';

export const fetchAllProducts = () => {
  return api.get<Product[]>('/products');
};
~~~
4) Home.tsx 구현
~~~tsx
// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { fetchAllProducts } from '../api/products';
import { Product } from '../types/Product';

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg">
          <img src={product.image} alt={product.title} className="w-full h-40 object-contain mb-2" />
          <h2 className="text-sm font-bold truncate">{product.title}</h2>
          <p className="text-blue-500 font-semibold">${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
~~~
5) 적용 확인
![](image%202.png)<!-- {"width":395} -->
## 4.2 ProductCard.tsx 컴포넌트 분리
~~~tsx
// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border p-4 rounded shadow hover:shadow-lg cursor-pointer">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-contain mb-2"
        />
        <h2 className="text-sm font-bold truncate">{product.title}</h2>
        <p className="text-blue-500 font-semibold">${product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;

// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { fetchAllProducts } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Home;
~~~
- Link 컴포넌트를 이용해 클릭 시 /products/:id로 이동
- product 객체를 props로 받아 카드 렌더링
## 4.3 상품 상세 페이지 구현
~~~ts
// src/api/products.ts
import { api } from './axios';
import { Product } from '../types/Product';

// 기존 함수 아래에 추가
export const fetchProductById = (id: number) => {
  return api.get<Product>(`/products/${id}`);
};
~~~
~~~tsx
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
~~~
## 4.4 카테고리 필터링 기능
~~~ts
// src/api/products.ts

export const fetchCategories = () => {
  return api.get<string[]>('/products/categories');
};

export const fetchProductsByCategory = (category: string) => {
  return api.get<Product[]>(`/products/category/${category}`);
};

// src/components/CategoryFilter.tsx
import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/products';

// props 타입 정의: 부모로부터 onSelectCategory 함수를 받는다.
// 이 함수는 category(string 또는 null)를 인자로 받아 실행된다.
interface Props {
  onSelectCategory: (category: string | null) => void;
}

function CategoryFilter({ onSelectCategory }: Props) {
  // 카테고리 목록을 저장하는 상태
  const [categories, setCategories] = useState<string[]>([]);

  // 컴포넌트가 처음 렌더링될 때 카테고리 목록을 API에서 가져온다.
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))   // 성공하면 카테고리 목록 저장
      .catch((err) => console.error(err));      // 실패 시 에러 출력
  }, []);

  return (
    <div className="flex gap-2 p-4 flex-wrap">
      {/* 전체 상품 보기 버튼 (category: null) */}
      <button
        onClick={() => onSelectCategory(null)}  // null을 넘겨 전체 상품 보기
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        All
      </button>

      {/* 각각의 카테고리를 버튼으로 렌더링 */}
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)} // 해당 카테고리를 선택하면 전달
          className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300 capitalize"
        >
          {cat}  {/* 카테고리 이름 출력 */}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;

// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { fetchAllProducts, fetchProductsByCategory } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

function Home() {
  // 상품 목록을 저장하는 상태
  const [products, setProducts] = useState<Product[]>([]);

  // 로딩 중 여부를 나타내는 상태
  const [loading, setLoading] = useState(true);

  /**
   * 카테고리에 따라 상품 데이터를 로딩하는 함수
   * @param category null이면 전체 상품, 문자열이면 해당 카테고리 상품만 조회
   */
  const loadProducts = (category: string | null) => {
    setLoading(true); // 로딩 시작

    // 조건에 따라 호출할 API 함수 선택
    const fetchFn = category ? fetchProductsByCategory : fetchAllProducts;

    // API 호출 (category가 null이면 빈 문자열 전달)
    fetchFn(category || '')
      .then((res) => {
        setProducts(res.data); // 성공 시 상품 저장
        setLoading(false);     // 로딩 종료
      })
      .catch((err) => {
        console.error(err);    // 실패 시 에러 출력
        setLoading(false);     // 로딩 종료
      });
  };

  // 컴포넌트가 처음 마운트될 때 전체 상품 목록 로드
  useEffect(() => {
    loadProducts(null);
  }, []);

  return (
    <div>
      {/* 카테고리 필터 컴포넌트 - 선택 시 loadProducts 실행됨 */}
      <CategoryFilter onSelectCategory={(cat) => loadProducts(cat)} />

      {/* 로딩 중이면 메시지 출력, 아니면 상품 카드 목록 출력 */}
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {/* 상품 목록을 ProductCard 컴포넌트로 렌더링 */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
~~~
![](image%203.png)<!-- {"width":452} -->
## 4.5 장바구니 담기 버튼
~~~tsx
// src/contexts/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/Product';

// 장바구니 항목의 타입 정의
export interface CartItem {
  product: Product;
  quantity: number;
}

// Context에서 사용할 타입 정의
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

// Context 생성
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider 컴포넌트
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 상품을 장바구니에 추가하는 함수
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // 이미 장바구니에 있는 상품이면 수량만 증가
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // 처음 담는 상품이면 새로 추가
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Context를 사용하는 훅
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './contexts/CartContext'; // 추가


function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/products" element={<Home />}/>
                    <Route path="/products/:id" element={<ProductDetail />}/>
                    <Route path="/" element={<Navigate to = "/products" />}/> {/* 루트로 들어오면 자동 이동 */}
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;

// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // 장바구니 훅 import

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); // 장바구니 추가 함수 사용

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      {/* 클릭 시 상세 페이지로 이동 */}
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-contain mb-2"
        />
        <h2 className="text-sm font-bold truncate">{product.title}</h2>
        <p className="text-blue-500 font-semibold">${product.price}</p>
      </Link>

      {/* 장바구니 담기 버튼 */}
      <button
        onClick={() => addToCart(product)}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm"
      >
        장바구니 담기
      </button>
    </div>
  );
}

export default ProductCard;


~~~
### 이걸 왜 쓸까?

React는 컴포넌트끼리 데이터를 주고받을 때 props를 사용하는데,
**props는 부모 → 자식으로만 전달됨.**

하지만 CartContext를 쓰면
- 어느 컴포넌트든 useCart()만 쓰면
- 전역 장바구니 상태에 접근할 수 있음 ! 
![](image%204.png)<!-- {"width":471} -->

## 4.6 장바구니 페이지 만들기
~~~tsx
// src/pages/CartPage.tsx
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { cart } = useCart(); // 장바구니 상태 가져오기

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 장바구니</h1>

      {cart.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.product.id}
              className="border p-4 rounded flex gap-4 items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-20 object-contain"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.title}</h2>
                <p className="text-sm text-gray-600">
                  수량: {item.quantity}개
                </p>
              </div>
              <p className="text-blue-500 font-bold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-6" />
      <div className="text-right font-bold text-lg">
        총 합계: ${total.toFixed(2)}
      </div>
    </div>
  );
}

export default CartPage;

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/products" element={<Home />}/>
                    <Route path="/products/:id" element={<ProductDetail />}/>
                    <Route path="/cart" element={<CartPage />}/>
                    <Route path="/" element={<Navigate to = "/products" />}/> {/* 루트로 들어오면 자동 이동 */}
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}


// src/components/Header.tsx -> 헤더에 장바구니 가기 버튼 추가
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🛍️ Fakestore</Link>
      <Link to="/cart" className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        장바구니
      </Link>
    </header>
  );
}

export default Header;

// App.tsx에서 Header 추가
function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Header />  {/* 여기 */}
                <Routes>
                    <Route path="/products" element={<Home />}/>
                    <Route path="/products/:id" element={<ProductDetail />}/>
                    <Route path="/cart" element={<CartPage />}/>
                    <Route path="/" element={<Navigate to = "/products" />}/> {/* 루트로 들어오면 자동 이동 */}
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}
~~~
![](image%205.png)
![](image%206.png)
## 4.7 장바구니 기능추가(상품 수량 변경 & 삭제 기능 추가)
~~~tsx
// src/contexts/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}


// src/pages/CartPage.tsx
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 장바구니</h1>

      {cart.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.product.id}
              className="border p-4 rounded flex gap-4 items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-20 object-contain"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}개</span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-500 font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  ❌ 삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-6" />
      <div className="text-right font-bold text-lg">
        총 합계: ${total.toFixed(2)}
      </div>
    </div>
  );
}

export default CartPage;
~~~
![](image%207.png)
## 4.8 상품 등록 기능 구현
~~~tsx
// src/api/products.ts
import { api } from './axios';
import { Product } from '../types/Product';

// 상품 추가 요청 - POST /products
export const createProduct = (newProduct: Omit<Product, 'id'>) => {
  return api.post<Product>('/products', newProduct);
};

// src/pages/AdminPage.tsx
import { useState } from 'react';
import { createProduct } from '../api/products';

function AdminPage() {
  // 폼 입력 상태 관리
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  // 상품 등록 버튼 클릭 시 실행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 막기

    try {
      const newProduct = {
        title,
        price: parseFloat(price),
        description,
        category,
        image,
      };

      const res = await createProduct(newProduct);
      alert(`상품 등록 완료: ${res.data.title}`);
      console.log(res.data); // 서버 응답 확인

      // 입력 초기화
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImage('');
    } catch (err) {
      console.error(err);
      alert('상품 등록 실패');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">📦 상품 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="상품명"
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="가격"
          className="w-full border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="카테고리"
          className="w-full border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="이미지 URL"
          className="w-full border p-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="상품 설명"
          className="w-full border p-2 h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}

export default AdminPage;

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Header />  {/* 여기 */}
                <Routes>
                    <Route path="/products" element={<Home />}/>
                    <Route path="/products/:id" element={<ProductDetail />}/>
                    <Route path="/cart" element={<CartPage />}/>
                    <Route path="/admin" element={<AdminPage />}/>
                    <Route path="/" element={<Navigate to = "/products" />}/> {/* 루트로 들어오면 자동 이동 */}
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}
~~~
![](image%208.png)
## 4.9 상품 수정 기능 구현
~~~tsx
// src/api/products.ts

// 상품 전체 수정 - PUT
export const updateProduct = (id: number, updatedProduct: Omit<Product, 'id'>) => {
  return api.put<Product>(`/products/${id}`, updatedProduct);
};


// src/pages/AdminPage.tsx

import { useEffect, useState } from 'react';
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
} from '../api/products';
import { Product } from '../types/Product';

function AdminPage() {
  // 상품 목록 상태
  const [products, setProducts] = useState<Product[]>([]);

  // 폼 입력 상태
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  // 수정 중인 상품 ID (null이면 등록 모드)
  const [editingId, setEditingId] = useState<number | null>(null);

  // 상품 전체 조회 → 페이지 처음 렌더링될 때 실행
  useEffect(() => {
    fetchAllProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 폼 제출 핸들러 (등록 또는 수정)
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
        // 등록 모드: POST
        const res = await createProduct(productData);
        alert(`✅ 상품 등록 완료: ${res.data.title}`);
      } else {
        // 수정 모드: PUT
        const res = await updateProduct(editingId, productData);
        alert(`✏️ 상품 수정 완료: ${res.data.title}`);
      }

      // 상품 목록 다시 불러오기
      const updated = await fetchAllProducts();
      setProducts(updated.data);

      // 폼 초기화
      resetForm();
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  // 수정 버튼 클릭 시 기존 값 채우기
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
  };

  // 폼 초기화
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

      {/* 상품 등록/수정 폼 */}
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

      {/* 상품 목록 */}
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
            <button
              onClick={() => handleEdit(product)}
              className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              수정
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
~~~
![](image%209.png)

## 4.9 상품 삭제 기능 구현
~~~tsx
// src/api/products.ts

import { api } from './axios';

// 상품 삭제 요청
export const deleteProduct = (id: number) => {
  return api.delete(`/products/${id}`);
};

// src/pages/AdminPage.tsx

import { useEffect, useState } from 'react';
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
} from '../api/products';
import { Product } from '../types/Product';

function AdminPage() {
  // 상품 목록 상태
  const [products, setProducts] = useState<Product[]>([]);

  // 폼 입력 상태
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  // 수정 중인 상품 ID (null이면 등록 모드)
  const [editingId, setEditingId] = useState<number | null>(null);

  // 페이지가 처음 렌더링될 때 상품 목록 불러오기
  useEffect(() => {
    fetchAllProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 등록/수정 폼 제출 핸들러
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
        // 등록
        const res = await createProduct(productData);
        alert(`✅ 상품 등록 완료: ${res.data.title}`);
      } else {
        // 수정
        const res = await updateProduct(editingId, productData);
        alert(`✏️ 상품 수정 완료: ${res.data.title}`);
      }

      // 등록/수정 후 상품 목록 다시 불러오기
      const updated = await fetchAllProducts();
      setProducts(updated.data);

      // 폼 초기화
      resetForm();
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  // 수정 버튼 클릭 시 기존 데이터 폼에 채우기
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
  };

  // 삭제 버튼 클릭 시
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteProduct(id);
      const updated = await fetchAllProducts();
      setProducts(updated.data);
      alert('🗑️ 삭제 완료');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 폼 입력 초기화
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

      {/* 상품 등록/수정 폼 */}
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

      {/* 상품 목록 */}
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
            <div className="flex gap-2">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
~~~
![](image%2010.png)
## 4.10 상품 부분 변경 기능 구현(patch)
~~~tsx
// src/api/products.ts

export const patchProduct = (id: number, partialData: Partial<Omit<Product, 'id'>>) => {
  return api.patch<Product>(`/products/${id}`, partialData);
};

// src/pages/AdminPage.tsx

import { useEffect, useState } from 'react';
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  patchProduct, // 👈 PATCH 추가
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
    fetchAllProducts()
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

      const updated = await fetchAllProducts();
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
      const updated = await fetchAllProducts();
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
      const updated = await fetchAllProducts();
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
~~~
![](image%2011.png)
## 4.11 기존 코드 통합
GET /products, 
GET /products?limit=5, 
GET /products/category/:cat
위 세가지 API를 통합한 API 생성
~~~tsx
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

// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = (category: string | null) => {
    setLoading(true);
    fetchProducts(category ? { category } : undefined)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts(null); // 초기 전체 상품 불러오기
  }, []);

  return (
    <div>
      <CategoryFilter onSelectCategory={(cat) => loadProducts(cat)} />
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

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

~~~

## 4.12 페이지 구현
~~~tsx
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
~~~
프론트에서 전부 가져온 후 페이지 기능 구현
추후 offset/pagination 구현시 추가 구현 필요
## 4.13 장바구니 데이터 가져오기 구현
~~~tsx
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

// src/contexts/CartContext.tsx
import { fetchCartByUserId } from '../api/carts';
import { fetchProductById } from '../api/products';

const initializeCartFromServer = async (userId: number) => {
  try {
    const res = await fetchCartByUserId(userId);
    const cartData = res.data[0]; // 가장 최근 장바구니

    if (!cartData) return;

    // productId → Product 정보 가져오기
    const items = await Promise.all(
      cartData.products.map(async (item) => {
        const res = await fetchProductById(item.productId);
        return {
          product: res.data,
          quantity: item.quantity,
        };
      })
    );

    setCart(items);
  } catch (err) {
    console.error('장바구니 초기화 실패', err);
  }
};

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Product } from '../types/Product';
import { fetchCartByUserId } from '../api/carts';
import { fetchProductById } from '../api/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ 서버에서 장바구니 불러오기
  const initializeCartFromServer = async (userId: number) => {
    try {
      const res = await fetchCartByUserId(userId);
      const cartData = res.data[0]; // 가장 최근 장바구니

      if (!cartData) return;

      const items: CartItem[] = await Promise.all(
        cartData.products.map(async (item) => {
          const productRes = await fetchProductById(item.productId);
          return {
            product: productRes.data,
            quantity: item.quantity,
          };
        })
      );

      setCart(items);
    } catch (err) {
      console.error('🛑 장바구니 초기화 실패:', err);
    }
  };

  useEffect(() => {
    const userId = 1; // 테스트용 고정 ID
    initializeCartFromServer(userId);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

~~~
5. 컴포넌트 구조 개선
1. 컴포넌트 분리하여 재사용성 높이기
* ProductImage: 상품 이미지 표시
~~~tsx
import { Product } from '../../types/Product';

interface ProductImageProps {
  product: Product;
  className?: string;
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  return (
    <img
      src={product.image}
      alt={product.title}
      className={`w-full h-40 object-contain ${className}`}
      loading="lazy"
    />
  );
} 

// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import { ProductImage } from './product/ProductImage';
import { ProductInfo } from './product/ProductInfo';
import { AddToCartButton } from './product/AddToCartButton';
import { useProductCard } from '../hooks/useProductCard';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useProductCard();

  return (
    <article className="border p-4 rounded shadow hover:shadow-lg">
      <Link 
        to={`/products/${product.id}`}
        className="block"
        aria-label={`${product.title} 상세 정보 보기`}
      >
        <ProductImage product={product} className="mb-2" />
        <ProductInfo product={product} />
      </Link>

      <AddToCartButton 
        product={product}
        onAddToCart={handleAddToCart}
      />
    </article>
  );
}

export default ProductCard;
~~~

* ProductInfo: 상품 제목과 가격 표시
~~~tsx
import { Product } from '../../types/Product';

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export function ProductInfo({ product, className = '' }: ProductInfoProps) {
  return (
    <div className={className}>
      <h2 className="text-sm font-bold truncate" title={product.title}>
        {product.title}
      </h2>
      <p className="text-blue-500 font-semibold">${product.price}</p>
    </div>
  );
} 

~~~
* AddToCartButton: 장바구니 추가 버튼
~~~tsx
import { Product } from '../../types/Product';

interface AddToCartButtonProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export function AddToCartButton({ product, onAddToCart, className = '' }: AddToCartButtonProps) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className={`mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm ${className}`}
      aria-label={`${product.title} 장바구니에 담기`}
    >
      장바구니 담기
    </button>
  );
} 


import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';

export function useProductCard() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return {
    handleAddToCart,
  };
} 
~~~

적용 파일
~~~tsx
// src/components/ProductCard.tsx
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import { ProductImage } from './product/ProductImage';
import { ProductInfo } from './product/ProductInfo';
import { AddToCartButton } from './product/AddToCartButton';
import { useProductCard } from '../hooks/useProductCard';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useProductCard();

  return (
    <article className="border p-4 rounded shadow hover:shadow-lg">
      <Link 
        to={`/products/${product.id}`}
        className="block"
        aria-label={`${product.title} 상세 정보 보기`}
      >
        <ProductImage product={product} className="mb-2" />
        <ProductInfo product={product} />
      </Link>

      <AddToCartButton 
        product={product}
        onAddToCart={handleAddToCart}
      />
    </article>
  );
}

export default ProductCard;

~~~