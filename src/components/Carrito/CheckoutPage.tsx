import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Producto } from '../../Types/Producto';
import '../CSS/CheckoutPage.css';
import axios from 'axios';
import CheckoutMP from '../MercadoPago/CheckoutMp';
import { FormaPago } from '../../Types/enum/FormaPago';
import { TipoEnvio } from '../../Types/enum/TipoEnvio';
import { Estado } from '../../Types/enum/Estado';
import { useAuth } from '../Auth/AuthContext';


interface CheckoutPageProps {
  cart: any[];
  onRemoveFromCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onFinishPurchase: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onRemoveFromCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, cliente } = useAuth(); // Usar el hook de autenticación para obtener el estado de login y cliente
  const [cart, setCart] = useState<Producto[]>(location.state?.cart || []);
  const [formaPago, setFormaPago] = useState<FormaPago>(FormaPago.EFECTIVO);
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>();
  const [horaEstimadaFinalizacion, setHoraEstimadaFinalizacion] = useState<string>('');
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirigir al login si no está autenticado
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setHoraEstimadaFinalizacion(calculateHoraEstimada());
  }, [cart]); // Actualiza cada vez que cambia el carrito

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
    onRemoveFromCart(itemId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleShowMercadoPago = () => {
    if (!showMercadoPago) {
      setShowMercadoPago(true);
    }
  };

  const calculateTiempoEstimadoTotal = () => {
    return cart.reduce((total, producto) => {
      const tiempo = producto.tiempoEstimadoMinutos || 0; // Verifica que exista y sea numérico.
      return total + tiempo * producto.cantidad;
    }, 0);
  };
  
  const calculateHoraEstimada = () => {
    const tiempoEstimadoMinutos = calculateTiempoEstimadoTotal();
    if (isNaN(tiempoEstimadoMinutos) || tiempoEstimadoMinutos <= 0) {
      return '00:00:00'; // Valor por defecto si los cálculos son inválidos.
    }
    const horas = Math.floor(tiempoEstimadoMinutos / 60);
    const minutos = tiempoEstimadoMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
  };

  const handleFormaPagoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormaPago(event.target.value as FormaPago);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
        const horaEstimada = calculateHoraEstimada();
  
        const pedidoData = {
            sucursal: { id: 1 },
            domicilio: null,
            detallePedidos: cart.map((producto) => ({
                articulo: { id: producto.id },
                cantidad: producto.cantidad,
                precio: producto.precioVenta,
            })),
            total: parseFloat(calculateTotal()),
            totalCosto: parseFloat(calculateTotal()),
            formaPago,
            tipoEnvio,
            fechaPedido: new Date().toISOString().split('T')[0],
            horaEstimadaFinalizacion: horaEstimada,
            clienteId: cliente?.id,
            Estado,

      };
  
      console.log('Datos del pedido:', JSON.stringify(pedidoData, null, 2));
      console.log("TOKEN PUTO", localStorage.getItem("token"))

      const response = await axios.post(`http://localhost:8080/pedido`, pedidoData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (response.status === 200) {
          alert('Pedido creado exitosamente');
          navigate('/');
      } else {
          console.error('Error: No se pudo crear el pedido');
      }
  } catch (error) {
      const errorMessage = (error as any).response?.data || (error as any).message;
      console.error('Error al crear el pedido:', errorMessage);
      alert('Ocurrió un error al crear el pedido. Inténtalo de nuevo.');
  } finally {
      setIsLoading(false);
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
              <img
                src={producto.imagenes[0].url}
                alt={producto.denominacion}
                className="checkout-item-image"
              />
              <div className="checkout-item-info">
                <h3 className="checkout-item-title">{producto.denominacion}</h3>
                <p className="checkout-item-price">Precio: ${producto.precioVenta}</p>
                <p className="checkout-item-quantity">Cantidad: {producto.cantidad}</p>
                <div className="checkout-item-controls">
                  <button
                    className="control-button"
                    onClick={() => handleUpdateQuantity(producto.id, producto.cantidad - 1)}
                  >
                    -
                  </button>
                  <button
                    className="control-button"
                    onClick={() => handleUpdateQuantity(producto.id, producto.cantidad + 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromCart(producto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="checkout-item-total">
                Subtotal: ${(producto.precioVenta * producto.cantidad).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Total: ${calculateTotal()}</h3>

            <div className="payment-method">
              <label htmlFor="formaPago">Forma de Pago:</label>
              <select
                id="formaPago"
                value={formaPago}
                onChange={handleFormaPagoChange}
              >
                <option value={FormaPago.EFECTIVO}>Efectivo</option>
                <option value={FormaPago.MERCADOPAGO}>Mercado Pago</option>
              </select>
            </div>

            {!showMercadoPago ? (
              <>
                <button className="checkout-button" onClick={handleShowMercadoPago}>
                  Pagar con Mercado Pago
                </button>
                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </>
            ) : (
              <>
                <CheckoutMP
                  montoCarrito={parseFloat(calculateTotal())}
                  pedido={{
                    id: 0,
                    eliminado: false,
                    totalCosto: parseFloat(calculateTotal()),
                    estado: Estado.PENDIENTE,
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
                    cliente: cliente,
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
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CheckoutPage;
