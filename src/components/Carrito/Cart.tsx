import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Producto } from '../../Types/Producto';
import { Promocion } from '../../Types/Promocion';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

// Utility function to check if an item is a Promocion
const isPromocion = (item: Producto | Promocion): item is Promocion => {
  return (item as Promocion).precioPromocional !== undefined;
};

const Cart: React.FC<{
  cart: (Producto | Promocion)[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, cantidad: number) => void;
  onClose: () => void;
}> = ({ cart, onRemoveFromCart, onUpdateQuantity, onClose }) => {
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const price = isPromocion(item) ? item.precioPromocional ?? 0 : item.precioVenta;
        return total + price * item.cantidad;
      }, 0)
      .toFixed(2);
  };

  const handleAddQuantity = (item: Producto | Promocion) => {
    onUpdateQuantity(item.id, item.cantidad + 1);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      console.log('Carrito cargado del localStorage:', JSON.parse(savedCart));
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.denominacion}</strong>
                  <p>Cantidad: {item.cantidad}</p>
                </div>
                <span>
                  $
                  {(
                    (isPromocion(item) ? item.precioPromocional ?? 0 : item.precioVenta) *
                    item.cantidad
                  ).toFixed(2)}
                </span>
                <div>
                  {/* Remove Button with Tooltip for both Promocion and Producto */}
                  <Tooltip
                    title={
                      item.cantidad <= 1
                        ? isPromocion(item)
                          ? "Promoción mínima 1 cantidad"
                          : "Producto mínimo 1 cantidad"
                        : ""
                    }
                    placement="top"
                  >
                    <span>
                      <button
                        className="btn btn-sm btn-secondary cart-button"
                        onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1} // Disable for both Promocion and Producto if quantity <= 1
                      >
                        <RemoveIcon />
                      </button>
                    </span>
                  </Tooltip>

                  {/* Add Button with Tooltip for Promocion (max 2) */}
                  <Tooltip
                    title={
                      isPromocion(item) && item.cantidad >= 2
                        ? "Promoción máxima 2 cantidades"
                        : ""
                    }
                    placement="top"
                  >
                    <span>
                      <button
                        className="btn btn-sm btn-secondary cart-button"
                        onClick={() => handleAddQuantity(item)}
                        disabled={isPromocion(item) && item.cantidad >= 2} // Disable for Promocion if quantity >= 2
                      >
                        <AddIcon />
                      </button>
                    </span>
                  </Tooltip>

                  <button
                    className="btn btn-sm btn-danger cart-button"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4 style={{ padding: '10px' }}>Total: ${calculateTotal()}</h4>
          <div className="modal-buttons">
            <Button variant="primary" onClick={handleCheckout} className="cart-button">
              Finalizar compra
            </Button>
            <Button variant="secondary" onClick={onClose} className="cart-button">
              Cerrar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;