import React from 'react';
import { Button } from 'react-bootstrap';
import { Producto } from '../DTOS/Producto';

const Cart: React.FC<{
  cart: Producto[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, cantidad: number) => void;
  onClose: () => void;
}> = ({ cart, onRemoveFromCart, onUpdateQuantity, onClose }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precioVenta * item.cantidad, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <ul className="list-group">
          {cart.map((producto) => (
            <li key={producto.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{producto.denominacion}</strong>
                <p>Cantidad: {producto.cantidad}</p>
              </div>
              <span>${(producto.precioVenta * producto.cantidad).toFixed(2)}</span>
              <div>
                <button className="btn btn-sm btn-danger cart-button" onClick={() => onRemoveFromCart(producto.id)}>Eliminar</button>
                <button className="btn btn-sm btn-secondary cart-button" onClick={() => onUpdateQuantity(producto.id, producto.cantidad - 1)}>-</button>
                <button className="btn btn-sm btn-secondary cart-button" onClick={() => onUpdateQuantity(producto.id, producto.cantidad + 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h4  style={{ padding: '10px' }}>Total: ${calculateTotal()}</h4>
      <div className="modal-buttons">
        <Button variant="primary" onClick={() => alert('Finalizar compra')} className="cart-button">Finalizar compra</Button>
        <Button variant="secondary" onClick={onClose} className="cart-button">Cerrar</Button>
      </div>
    </div>
  );
};

export default Cart;
