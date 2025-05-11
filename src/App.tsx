import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import {CartProvider} from './contexts/CartContext';
import {AuthProvider} from './contexts/AuthContext';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/" element={<Navigate to="/products" />}/>
                        
                        {/* 보호된 라우트들 */}
                        <Route path="/products" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }/>
                        <Route path="/products/:id" element={
                            <ProtectedRoute>
                                <ProductDetail />
                            </ProtectedRoute>
                        }/>
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }/>
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        }/>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;