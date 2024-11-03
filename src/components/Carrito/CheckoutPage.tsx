import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Producto } from '../DTOS/Producto';
import '../CSS/CheckoutPage.css';
import axios from 'axios';
import CheckoutMP from '../MercadoPago/CheckoutMp';
import { FormaPago } from '../../Types/enum/FormaPago';
import { TipoEnvio } from '../../Types/enum/TipoEnvio';


interface CheckoutPageProps {
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, cantidad: number) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onRemoveFromCart, onUpdateQuantity }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart }: { cart: Producto[] } = location.state || { cart: [] };
  const [formaPago, setFormaPago] = useState<FormaPago>();
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>();
  const [horaEstimadaFinalizacion, setHoraEstimadaFinalizacion] = useState<string>("");

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precioVenta * item.cantidad, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
        const pedidoData = {
            productos: cart.map((producto) => ({
                idProducto: producto.id,
                cantidad: producto.cantidad,
                precio: producto.precioVenta,
            })),
            total: parseFloat(calculateTotal()),
            formaPago,
            tipoEnvio,
            fechaPedido: new Date().toISOString().split("T")[0],
            horaEstimadaFinalizacion,
        };

        const sucursalId = 1; // Reemplaza esto con el valor correcto de sucursalId
        const response = await axios.post(`http://localhost:8080/pedido/crear/${sucursalId}`, pedidoData); 
        if (response.status === 201) {
            alert('Pedido creado exitosamente');
            navigate('/');
        }
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        alert('Ocurrió un error al crear el pedido. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="checkout-items">
          {cart.map((producto) => (
            <div key={producto.id} className="checkout-item">
              <img src={producto.imagenes[0].url} alt={producto.denominacion} className="checkout-item-image" />
              <div className="checkout-item-info">
                <h3 className="checkout-item-title">{producto.denominacion}</h3>
                <p className="checkout-item-price">Precio: ${producto.precioVenta}</p>
                <p className="checkout-item-quantity">Cantidad: {producto.cantidad}</p>
                <div className="checkout-item-controls">
                  <button className="control-button" onClick={() => onUpdateQuantity(producto.id, producto.cantidad - 1)}>-</button>
                  <button className="control-button" onClick={() => onUpdateQuantity(producto.id, producto.cantidad + 1)}>+</button>
                  <button className="remove-button" onClick={() => onRemoveFromCart(producto.id)}>Eliminar</button>
                </div>
              </div>
              <p className="checkout-item-total">Subtotal: ${(producto.precioVenta * producto.cantidad).toFixed(2)}</p>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Total: ${calculateTotal()}</h3>
            <button className="checkout-button" onClick={handleCheckout}>Finalizar compra</button>
            {/* Componente de Mercado Pago */}
            <CheckoutMP
              montoCarrito={parseFloat(calculateTotal())}
              pedido={{
                productos: cart.map((producto) => ({
                  idProducto: producto.id,
                  cantidad: producto.cantidad,
                  precio: producto.precioVenta,
                })),
                total: parseFloat(calculateTotal()),
                formaPago: formaPago ?? FormaPago.MERCADOPAGO, // Valor por defecto si es undefined
                tipoEnvio: tipoEnvio ?? TipoEnvio.DELIVERY, // Valor por defecto si es undefined
                fechaPedido: new Date(), // Cambiado a Date
                horaEstimadaFinalizacion,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
