import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Producto } from '../DTOS/Producto';
import '../CSS/CheckoutPage.css';
import axios from 'axios';
import CheckoutMP from '../MercadoPago/CheckoutMp';
import { FormaPago } from '../../Types/enum/FormaPago';
import { TipoEnvio } from '../../Types/enum/TipoEnvio';
import { Estado } from '../../Types/enum/Estado';

interface CheckoutPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any[];

  onRemoveFromCart: (itemId: number) => void;

  onUpdateQuantity: (itemId: number, quantity: number) => void;

  onFinishPurchase: () => void;
}


const CheckoutPage: React.FC<CheckoutPageProps> = ({ onRemoveFromCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Producto[]>(location.state?.cart || []); // Define cart y setCart
  const [formaPago, setFormaPago] = useState<FormaPago>();
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>();
  const [horaEstimadaFinalizacion, setHoraEstimadaFinalizacion] = useState<string>("");
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precioVenta * item.cantidad, 0).toFixed(2);
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, cantidad: Math.max(newQuantity, 1) } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: number) => {
    onRemoveFromCart(itemId); // Llama a la función que maneja la eliminación en el estado superior
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId)); // Actualiza el estado local del carrito
  };
  

  const handleShowMercadoPago = () => {
    if (!showMercadoPago) {
      setShowMercadoPago(true);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true); // Iniciar el loading
    try {
      const pedidoData = {
        sucursal: { id: 1 }, // Reemplaza esto con el valor correcto de sucursalId
        domicilio: null, // Reemplaza esto con el domicilio si aplica
        detallePedidos: cart.map((producto) => ({
          articulo: { id: producto.id },
          cantidad: producto.cantidad,
          precio: producto.precioVenta,
        })),
        totalCosto: parseFloat(calculateTotal()),
        formaPago,
        tipoEnvio,
        fechaPedido: new Date().toISOString().split("T")[0],
        horaEstimadaFinalizacion,
      };

      const response = await axios.post(`http://localhost:8080/pedido`, pedidoData);

      console.log(response); // Verifica el contenido de la respuesta
        if (response.status === 200) {
            alert('Pedido creado exitosamente');
            navigate('/'); // Navegar a la página principal
        } else {
            console.error('Error: No se pudo crear el pedido');
        }
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Ocurrió un error al crear el pedido. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false); // Finaliza el loading
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
                  <button className="control-button" onClick={() => handleUpdateQuantity(producto.id, producto.cantidad - 1)}>-</button>
                  <button className="control-button" onClick={() => handleUpdateQuantity(producto.id, producto.cantidad + 1)}>+</button>
                  <button className="remove-button" onClick={() => handleRemoveFromCart(producto.id)}>Eliminar</button>
                </div>
              </div>
              <p className="checkout-item-total">Subtotal: ${(producto.precioVenta * producto.cantidad).toFixed(2)}</p>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Total: ${calculateTotal()}</h3>

            
            {!showMercadoPago ? (
              <>
                <button className="checkout-button" onClick={handleShowMercadoPago}>Pagar con Mercado Pago</button>
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout} 
                  disabled={isLoading} // Deshabilita el botón mientras se está creando el pedido
                >
                  {isLoading ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </>
            ) : (
              <>
                <CheckoutMP
                  montoCarrito={parseFloat(calculateTotal())}
                  pedido={{
                    id: 0, // Add appropriate id
                    eliminado: false,
                    totalCosto: parseFloat(calculateTotal()),
                    estado: Estado.PENDIENTE, // Add appropriate estado
                    productos: cart.map((producto) => ({
                      idProducto: producto.id,
                      cantidad: producto.cantidad,
                      precio: producto.precioVenta,
                    })),
                    total: parseFloat(calculateTotal()),
                    formaPago: formaPago ?? FormaPago.MERCADOPAGO,
                    tipoEnvio: tipoEnvio ?? TipoEnvio.DELIVERY,
                    fechaPedido: new Date(),
                    horaEstimadaFinalizacion,
                  }}
                />
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </>
            )}

          </div>
        </div>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Mostrar mensaje de éxito */}
    </div>
  );
};

export default CheckoutPage;
