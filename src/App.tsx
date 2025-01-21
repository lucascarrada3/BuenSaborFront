import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Introduccion/Navbar';
import Home from './components/Routeo/Home';
import ProductsPage from './components/Productos/ProductsPage';
import ProductDetailsPage from './components/Productos/ProductDetailsPage';
import CheckoutPage from './components/Carrito/CheckoutPage';
import RegisterCliente from './components/Auth/Register';
import LoginCliente from './components/Auth/LoginCliente';
import PrivateRoute from './components/Auth/Privateroute';
import { Producto } from './Types/Producto';
import MisPedidos from './components/Pedidos/MisPedidos';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn, cliente, logout } = useAuth();
  const [cart, setCart] = useState<Producto[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (producto: Producto) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item.id === producto.id);

    if (productIndex !== -1) {
      updatedCart[productIndex].cantidad += 1;
    } else {
      updatedCart.push({ ...producto, cantidad: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad <= 0) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, cantidad } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleLogout = () => {
    logout();
  };

  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar onLogout={handleLogout} />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="/register" element={<RegisterCliente />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        {/* Ruta protegida para finalizar compra */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <CheckoutPage
                cart={cart}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onFinishPurchase={() => setCart([])}
              />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;