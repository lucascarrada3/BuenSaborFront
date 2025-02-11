import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ProductCarousel from '../Introduccion/Carousel';
import AboutUs from '../Introduccion/AboutUs';
import Testimonials from '../Introduccion/Testimonials';
import Cart from '../Carrito/Cart';
import CartButton from '../Carrito/CartButtom'; // Assuming the path to CartButton
import { Producto } from '../../Types/Producto'; // Adjust the import path if needed

const Home: React.FC = () => {
  const [cart, setCart] = useState<Producto[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showModal, setShowModal] = useState(false);

  const onRemoveFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const onUpdateQuantity = (id: number, cantidad: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item
    ));
  };

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <ProductCarousel />
      <AboutUs />
      <Testimonials />
      
      {/* Cart Button */}
      <CartButton 
        cartLength={cart.length} 
        onClick={toggleModal} 
      />

      {/* Cart Modal */}
      <Modal show={showModal} onHide={toggleModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Carrito de Compras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cart 
            cart={cart} 
            onRemoveFromCart={onRemoveFromCart} 
            onUpdateQuantity={onUpdateQuantity} 
            onClose={toggleModal}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Home;