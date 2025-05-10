import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import {CartProvider} from './contexts/CartContext';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import AdminPage from './pages/AdminPage';

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

export default App;
