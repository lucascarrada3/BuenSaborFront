import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import '../CSS/carrito.css'; // Importa tu archivo CSS

interface CartButtonProps {
  cartLength: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ cartLength, onClick }) => {
  return (
    <button className="cart" onClick={onClick}>
      <FaShoppingCart size={24} />
      <span className="cart-count">{cartLength}</span>
    </button>
  );
};

export default CartButton;
