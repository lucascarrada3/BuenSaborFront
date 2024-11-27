import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('jwt'));
  const [cart, setCart] = useState<Producto[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

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
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
};

const AppContent: React.FC<{
  isAuthenticated: boolean;
  handleLogout: () => void;
  cart: Producto[];
  addToCart: (producto: Producto) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  isAuthenticated,
  handleLogout,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  setIsAuthenticated,
}) => {
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
        <Route
          path="/login"
          element={<LoginCliente setAuth={setIsAuthenticated} />}
        />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        {/* Ruta protegida para finalizar compra */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
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