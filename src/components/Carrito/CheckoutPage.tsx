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
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Promocion } from '../../Types/Promocion';


interface CheckoutPageProps {
  cart: any[];
  onRemoveFromCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onFinishPurchase: () => void;
}
interface CartItem {
  data: Producto;
  cantidad: number;
}

const isPromocion = (item: Producto | Promocion): item is Promocion => {
  return (item as Promocion).precioPromocional !== undefined;
};

const CheckoutPage: React.FC<{
  cart: (Producto | Promocion)[];
  onRemoveFromCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, cantidad: number) => void;
  onFinishPurchase: () => void;
}> = ({ onRemoveFromCart, onUpdateQuantity, onFinishPurchase }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, cliente } = useAuth(); // Usar el hook de autenticación para obtener el estado de login y cliente
  const [cart, setCart] = useState<Producto[]>(location.state?.cart || []);
  const [promo, setPromo] = useState<Promocion[]>(location.state?.promo || []);
  const [formaPago, setFormaPago] = useState<FormaPago>(FormaPago.EFECTIVO);
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>(TipoEnvio.DELIVERY);
  const [horaEstimadaFinalizacion, setHoraEstimadaFinalizacion] = useState<string>('');
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<React.ReactNode>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation !== null ? savedLocation : '';
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirigir al login si no está autenticado
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setHoraEstimadaFinalizacion(calculateHoraEstimada());
  }, [cart]); // Actualiza cada vez que cambia el carrito

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const price = isPromocion(item) ? item.precioPromocional ?? 0 : item.precioVenta;
        return total + price * item.cantidad;
      }, 0)
      .toFixed(2);
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
    const newFormaPago = event.target.value as FormaPago;
    setFormaPago(newFormaPago);
    if (newFormaPago === FormaPago.MERCADOPAGO) {
      handleShowMercadoPago();
    } else {
      setShowMercadoPago(false); // Hide MercadoPago if another payment method is chosen
    }
  };

  const handleTipoEnvioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEnvio(event.target.value as TipoEnvio);
  };
  

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const horaEstimada = calculateHoraEstimada();
  
      const pedidoData = {
        horaEstimadaFinalizacion: horaEstimada,
        total: parseFloat(calculateTotal()),
        totalCosto: parseFloat(calculateTotal()),
        estado: Estado.PENDIENTE,
        tipoEnvio: tipoEnvio,
        formaPago: formaPago,
        fechaPedido: new Date().toISOString().split('T')[0],
        sucursal: { id: 1 },
        domicilio: { id: selectedLocation },
        cliente: { id: cliente?.id },
  
        detallePedidos: cart.map((producto) => ({
          cantidad: producto.cantidad,
          subTotal: producto.precioVenta * producto.cantidad,
          articulo: { id: producto.id } 
        })),

        Promocion: promo.map((promocion) => ({
          imagenes: promocion.imagenes,
          promocionDetalle: promocion.promocionDetalles.map((detalle) => ({
            cantidad: detalle.cantidad,
            subTotal: detalle.precio,
            articulo: { id: detalle.articulo.id, denominacion: detalle.articulo.denominacion }
          }))
    })),
  };
  
      console.log('Datos del pedido:', JSON.stringify(pedidoData, null, 2));
      console.log('PEDIDITO POR FAVOR :D', JSON.stringify(pedidoData.Promocion));

  
      const response = await axios.post(`http://localhost:8080/pedido`, pedidoData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
  
      if (response.status !== 200) {
        throw new Error('Error al crear el pedido');
      }
  
      // Manejo de la respuesta exitosa
      console.log('Pedido creado con éxito:', response.data);
      setSuccessMessage(
        <div>
          <h3 style={{ color: 'green' }}>¡Pedido creado con éxito!</h3>
          <p>Tu pedido ha sido registrado. Te avisaremos cuando esté listo.</p>
        </div>
      );
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/');
      }, 3000); // Aumenté el tiempo de visualización a 3 segundos para que el usuario pueda verlo mejor
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      setSuccessMessage(
        <div>
          <h3 style={{ color: 'red' }}>Error al crear el pedido</h3>
          <p style={{ color: 'red' }}>Por favor, intenta de nuevo o contacta al soporte.</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };


  // const handleCheckoutManufactured = async () => {
  //   setIsLoading(true);
  //   try {
  //     const horaEstimada = calculateHoraEstimada();
  //     const pedidoData = {
  //       horaEstimadaFinalizacion: horaEstimada,
  //       total: parseFloat(calculateTotal()),
  //       totalCosto: parseFloat(calculateTotal()),
  //       estado: Estado.PENDIENTE,
  //       tipoEnvio: tipoEnvio,
  //       formaPago: formaPago,
  //       fechaPedido: new Date().toISOString().split('T')[0],
  //       sucursal: { id: 1 },
  //       domicilio: { id: selectedLocation },
  //       cliente: { id: cliente?.id },
  //       detallePedidos: cart.map((item) => ({
  //         cantidad: item.cantidad,
  //         subTotal: item.precioVenta,
  //         articulo: { id: item.id }
  //       }))
  //     };
  
  //     console.log('Datos del pedido manufacturado:', JSON.stringify(pedidoData, null, 2));
      
  //     const response = await axios.post(`http://localhost:8080/pedido`, pedidoData, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token")
  //       }
  //     });
  
  //     // Handle success or error
  //     if (response.status === 200) {
  //       setSuccessMessage(
  //         <div>
  //           <h3 style={{ color: 'green' }}>¡Pedido de artículos manufacturados creado con éxito!</h3>
  //           <p>Tu pedido ha sido registrado. Te avisaremos cuando esté listo.</p>
  //         </div>
  //       );
  //       setTimeout(() => {
  //         setSuccessMessage(null);
  //         navigate('/');
  //       }, 3000);
  //     } else {
  //       throw new Error('Error al crear el pedido de artículos manufacturados');
  //     }
  //   } catch (error) {
  //     console.error('Error al crear el pedido de artículos manufacturados:', error);
  //     setSuccessMessage(
  //       <div>
  //         <h3 style={{ color: 'red' }}>Error al crear el pedido</h3>
  //         <p style={{ color: 'red' }}>Por favor, intenta de nuevo o contacta al soporte.</p>
  //       </div>
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCheckoutPromotions = async () => {
  //   setIsLoading(true);
  //   try {
  //     const promotionsInCart = cart.filter(item => item.data.promocion && item.data.promocion.length > 0);
      
  //     if (promotionsInCart.length > 0) {
  //       console.log("asasdaqsdsadfjuighsdoiuhsdgjhdsfo",promotionsInCart);
  //       const horaEstimada = calculateHoraEstimada();
  //       const pedidoData = {
  //         horaEstimadaFinalizacion: horaEstimada,
  //         total: parseFloat(calculateTotal()),
  //         totalCosto: parseFloat(calculateTotal()),
  //         estado: Estado.PENDIENTE,
  //         tipoEnvio: tipoEnvio,
  //         formaPago: formaPago,
  //         fechaPedido: new Date().toISOString().split('T')[0],
  //         sucursal: { id: 1 },
  //         domicilio: { id: selectedLocation },
  //         cliente: { id: cliente?.id },
  //         detallePedidos: cart.map((item) => ({
  //           cantidad: item.cantidad,
  //           subTotal: item.precioVenta,
  //           articulo: { 
  //             denominacion: item.promocion[0].promocionDetalles[0].articulo.denominacion,
  //             id: item.promocion[0].promocionDetalles[0].articulo.id, 
  //           }
  //         }))
  //       };
  
  //       console.log('Datos del pedido de promociones:', JSON.stringify(pedidoData, null, 2));
        
  //       const response = await axios.post(`http://localhost:8080/pedido`, pedidoData, {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token")
  //         }
  //       });
  
  //       if (response.status === 200) {
  //         setSuccessMessage(
  //           <div>
  //             <h3 style={{ color: 'green' }}>¡Pedido de promociones creado con éxito!</h3>
  //             <p>Tu pedido ha sido registrado. Te avisaremos cuando esté listo.</p>
  //           </div>
  //         );
  //         setTimeout(() => {
  //           setSuccessMessage(null);
  //           navigate('/');
  //         }, 3000);
  //       } else {
  //         throw new Error('Error al crear el pedido de promociones');
  //       }
  //     } else {
  //       console.log('No promotions in cart');
  //     }
  //   } catch (error) {
  //     console.error('Error al crear el pedido de promociones:', error);
  //     setSuccessMessage(
  //       <div>
  //         <h3 style={{ color: 'red' }}>Error al crear el pedido de promociones</h3>
  //         <p style={{ color: 'red' }}>Por favor, intenta de nuevo o contacta al soporte.</p>
  //       </div>
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCheckout = () => {
  //   if (cart.some(item => item.promocion)) {
  //     handleCheckoutPromotions();
  //   } else {
  //     handleCheckoutManufactured();
  //   }
  // };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">
        <strong>Checkout</strong>
      </h1>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="checkout-items">
          {cart.map((item) => {
            const price = isPromocion(item) ? item.precioPromocional ?? 0 : item.precioVenta;
            const images = isPromocion(item) ? item.imagenes ?? [] : item.imagenes ?? [];

            return (
              <div key={item.id} className="checkout-item">
                <img
                  src={images[0]?.url ?? 'placeholder-image-url'}
                  alt={item.denominacion}
                  className="checkout-item-image"
                />
                <div className="checkout-item-info">
                  <h3 className="checkout-item-title">
                    {item.denominacion} {isPromocion(item) ? "(Promoción)" : ""}
                  </h3>
                  <p className="checkout-item-price">
                    Precio: ${price.toFixed(2)}
                  </p>
                  <p className="checkout-item-quantity">
                    Cantidad: {item.cantidad}
                  </p>
                  <div className="checkout-item-controls">
                    <button
                      className="control-button"
                      onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                      style={{ border: "2px solid rgb(128 128 128 / 30%)" }}
                    >
                      <RemoveIcon />
                    </button>
                    <button
                      className="control-button"
                      onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                      style={{ border: "2px solid rgb(128 128 128 / 30%)" }}
                      disabled={isPromocion(item)} // Optional: Disable for promotions
                    >
                      <AddIcon />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
                <p className="checkout-item-total">
                  Subtotal: ${(price * item.cantidad).toFixed(2)}
                </p>
              </div>
            );
          })}
          <div className="checkout-total">
            <h3>Total: ${calculateTotal()}</h3>
          </div>
          <div>
            <div className="payment-method" style={{ alignItems: "right" }}>
              <label htmlFor="formaPago">Forma de Pago:</label>
              <select
                id="formaPago"
                value={formaPago}
                onChange={handleFormaPagoChange}
                style={{
                  width: "75%",
                  height: "50px",
                  padding: "5px",
                  fontSize: "14px",
                  border: "1.5px solid #8080807d",
                  marginLeft: "30px",
                }}
              >
                <option value={FormaPago.EFECTIVO}>Efectivo</option>
                <option value={FormaPago.MERCADOPAGO}>Mercado Pago</option>
              </select>
            </div>

            <div className="payment-method" style={{ alignItems: "right" }}>
              <label htmlFor="tipoEnvio">Forma de Envio:</label>
              <select
                id="tipoEnvio"
                value={tipoEnvio}
                onChange={handleTipoEnvioChange}
                style={{
                  width: "75%",
                  height: "50px",
                  padding: "5px",
                  fontSize: "14px",
                  border: "1.5px solid #8080807d",
                  marginLeft: "30px",
                }}
              >
                <option value={TipoEnvio.DELIVERY}>Delivery</option>
                <option value={TipoEnvio.TAKEAWAY}>Retira en local</option>
              </select>
            </div>

            {formaPago === FormaPago.MERCADOPAGO ? (
              <div style={{ marginLeft: "580px", width: "230px" }}>
                {showMercadoPago && formaPago === FormaPago.MERCADOPAGO && (
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
                      formaPago: FormaPago.MERCADOPAGO,
                      tipoEnvio: tipoEnvio ?? TipoEnvio.DELIVERY,
                      fechaPedido: new Date(),
                      horaEstimadaFinalizacion: calculateHoraEstimada(),
                      cliente: cliente,
                    }}
                  />
                )}
              </div>
            ) : (
              <div style={{ marginLeft: "700px", width: "230px" }}>
                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Finalizar compra"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default CheckoutPage;
