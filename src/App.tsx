import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Introduccion/Navbar';
import Home from './components/Routeo/Home';
import ProductsPage from './components/Productos/ProductsPage';
import PromocionesPage from './components/Promociones/PromocionesPage'; // Importar la página de promociones
import CheckoutPage from './components/Carrito/CheckoutPage'; // Asegúrate de importar el componente de Checkout
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/promociones" element={<PromocionesPage />} />
        <Route path="/checkout" element={<CheckoutPage cart={[]} onRemoveFromCart={() => {}} onUpdateQuantity={() => {}} onFinishPurchase={() => {}} />} /> {/* Añadir esta línea */}
      </Routes>
    </Router>
  );
};

export default App;
