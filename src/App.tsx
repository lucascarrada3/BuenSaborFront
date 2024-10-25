import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Introduccion/Navbar';
import Home from './components/Routeo/Home';
import ProductsPage from './components/Productos/ProductsPage';
import PromocionesPage from './components/Promociones/PromocionesPage'; // Importar la página de promociones
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/promociones" element={<PromocionesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
