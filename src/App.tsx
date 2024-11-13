import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Introduccion/Navbar';
import Home from './components/Routeo/Home';
import ProductsPage from './components/Productos/ProductsPage';
import ProductDetailsPage from './components/Productos/ProductDetailsPage';
// import PromocionesPage from './components/Promociones/PromocionesPage';
import CheckoutPage from './components/Carrito/CheckoutPage';
import CartButton from './components/Carrito/CartButtom'; // Agregar el botón de carrito
import 'bootstrap/dist/css/bootstrap.min.css';
import { Producto } from './components/DTOS/Producto';
import MisPedidos from './components/Pedidos/MisPedidos';


const App: React.FC = () => {
  const [cart, setCart] = useState<Producto[]>([]); 

  const addToCart = (producto: Producto) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item.id === producto.id);

    if (productIndex !== -1) {
      updatedCart[productIndex].cantidad += 1; 
    } else {
      updatedCart.push({ ...producto, cantidad: 1 }); 
    }

    setCart(updatedCart);
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad <= 0) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, cantidad } : item
    );
    setCart(updatedCart);
  };

  return (
    <Router>
      <Navbar />
      <CartButton cartLength={cart.length} onClick={() => {}} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onFinishPurchase={() => setCart([])} // Limpiar el carrito al finalizar la compra
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
