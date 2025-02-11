import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import '../CSS/productos.css';
import { Producto } from '../../Types/Producto';
import { Categoria } from '../../Types/Categoria';
import '../CSS/PromocionesPage.css';
import CartButton from '../Carrito/CartButtom'; // Asegúrate de que el nombre esté correcto
import { Modal } from 'react-bootstrap';
import Cart from '../Carrito/Cart'; // Asegúrate de que el nombre esté correcto
import { TipoPromocion } from '../../Types/enum/TipoPromocion'; // Asegúrate de que la ruta sea correcta
import { Promocion } from '../../Types/Promocion';

// Definición de la interfaz para las promociones
// interface Promocion {
//   id: number;
//   denominacion: string;
//   descripcionDescuento: string;
//   fechaDesde: string;
//   fechaHasta: string;
//   horaDesde: string;
//   horaHasta: string;
//   precioPromocional: number | null;
//   tipoPromocion: number;
//   imagenes: Imagen[];
// }

interface Imagen {
  name: string;
  url: string;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cartProductos, setCartProductos] = useState<Producto[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart) as (Producto | Promocion)[];
      return parsedCart.filter((item): item is Producto => !('precioPromocional' in item));
    }
    return [];
  });
  const [cartPromociones, setCartPromociones] = useState<Promocion[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart) as (Producto | Promocion)[];
      return parsedCart.filter((item): item is Promocion => 'precioPromocional' in item);
    }
    return [];
  });
  const [showCart, setShowCart] = useState(false);
  
  useEffect(() => {
    const combinedCart = [...cartProductos, ...cartPromociones];
    localStorage.setItem('cart', JSON.stringify(combinedCart));
  }, [cartProductos, cartPromociones]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const renderCard = (promocion: Promocion) => {
    const now = new Date();
  
    // Convertimos las fechas de string a objetos Date para comparación
    const fechaDesde = new Date(promocion.fechaDesde);
    const fechaHasta = new Date(promocion.fechaHasta);
  
    // Aseguramos que la comparación sea solo de fechas, ignorando la hora para PROMOCION
    fechaDesde.setHours(0, 0, 0, 0);
    fechaHasta.setHours(23, 59, 59, 999);
  
    let esPromocionActiva = true;
  
    if (promocion.tipoPromocion === TipoPromocion.HAPPY_HOUR) {
      // Para HAPPY_HOUR, verificar el horario diario y la misma fecha
      const startHour = new Date(now.toDateString() + ' ' + promocion.horaDesde);
      let endHour = new Date(now.toDateString() + ' ' + promocion.horaHasta);
  
      // Si la hora de fin es antes que la de inicio, significa que cruza la medianoche
      if (endHour <= startHour) {
        endHour.setDate(endHour.getDate() + 1);
      }
  
      // Verificamos si la fecha actual está dentro del rango de fechas de la promoción
      const dentroDelRangoDeFecha = now >= fechaDesde && now <= fechaHasta;
  
      // Verificamos si la hora actual está dentro del rango horario
      const dentroDelRangoHorario = now >= startHour && now <= endHour;
  
      // Verificamos si la promoción está activa dentro de la próxima hora
      const unaHoraDespues = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora después
      const dentroDeLaProximaHora = now <= endHour && unaHoraDespues >= startHour;
  
      // La promoción está activa si ambas condiciones son verdaderas
      esPromocionActiva = dentroDelRangoDeFecha && dentroDelRangoHorario && dentroDeLaProximaHora;
    } else if (promocion.tipoPromocion === TipoPromocion.PROMOCION) {
      // Para PROMOCION, verificar el rango de fechas y horas
      const startDateTime = new Date(promocion.fechaDesde + 'T' + promocion.horaDesde);
      const endDateTime = new Date(promocion.fechaHasta + 'T' + promocion.horaHasta);
  
      esPromocionActiva = now >= startDateTime && now <= endDateTime;
    }
  
    return (
      <div className="col-md-4 mb-4" key={promocion.id}>
        <div className="card">
          {promocion.imagenes.length > 0 && (
            <img
              src={promocion.imagenes[0].url}
              alt={promocion.denominacion}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
            />
          )}
          <div className="card-body">
            <h3 className="card-title">{promocion.denominacion}</h3>
            <p className="card-text">{promocion.descripcionDescuento}</p>
            <p>
              <strong>Precio Promocional: </strong>
              {promocion.precioPromocional !== null
                ? `$${promocion.precioPromocional.toFixed(2)}`
                : "No disponible"}
            </p>
            <p>
              <strong>Horario: </strong>{promocion.horaDesde} - {promocion.horaHasta}
            </p>
            <button
              className="promocion-button"
              onClick={() => {
                if (esPromocionActiva) {
                  addToCart(promocion);
                } else {
                  alert("Esta promoción no está disponible en este momento.");
                }
              }}
              disabled={!esPromocionActiva}
            >
              {esPromocionActiva ? "Aprovechar Promoción" : "Promoción no disponible"}
            </button>
            <div style={{ fontSize: '10px', marginTop: '10px' }}>
              <p>
                Desde el {promocion.fechaDesde} hasta el {promocion.fechaHasta}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProductos));
  }, [cartProductos, cartPromociones]);
  
  // Agregar producto al carrito
  const addToCart = (item: Producto | Promocion) => {
    if ("promocionDetalles" in item) {
      // Si el item es una Promoción
      const promoInCart = cartPromociones.find((promoItem) => promoItem.id === item.id);
      if (promoInCart) {
        // Si la promoción ya está en el carrito, aumentar su cantidad
        setCartPromociones(
          cartPromociones.map((promoItem) =>
            promoItem.id === item.id
              ? { ...promoItem, cantidad: promoItem.cantidad + 1 }
              : promoItem
          )
        );
      } else {
        // Si la promoción no está en el carrito, agregarla con cantidad 1
        setCartPromociones([...cartPromociones, { ...item, cantidad: 1 }]);
      }
    } else {
      // Si el item es un Producto
      const itemInCart = cartProductos.find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        // Si el producto ya está en el carrito, aumentar su cantidad
        setCartProductos(
          cartProductos.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
              : cartItem
          )
        );
      } else {
        // Si el producto no está en el carrito, agregarlo con cantidad 1
        setCartProductos([...cartProductos, { ...item, cantidad: 1 }]);
      }
    }
  };
  
  // Agregar promoción al carrito
  // const addPromotionToCart = (promocion: Promocion) => {
  //   console.log("PROMOOOOOOOOOOOO", promocion);
    
  //   const promoEnCarrito = cart.find((item) => item.id === promocion.id);
  
  //   // const nuevaPromocion: Promocion = {
  //   //   promocion: {
  //   //     denominacion: promocion.denominacion,
  //   //     descripcionDescuento: promocion.descripcionDescuento,
  //   //     fechaDesde: promocion.fechaDesde,
  //   //     fechaHasta: promocion.fechaHasta,
  //   //     horaDesde: promocion.horaDesde,
  //   //     horaHasta: promocion.horaHasta,
  //   //     precioPromocional: promocion.precioPromocional,
  //   //     tipoPromocion: promocion.tipoPromocion,
  //   //     imagenesPromocion: promocion.imagenesPromocion,
  //   //     sucursales: promocion.sucursales,
  //   //     promocionDetalles: promocion.promocionDetalles.map(item => ({
  //   //       cantidad: item.cantidad,
  //   //       articulo: {
  //   //         id: item.articulo.id,
  //   //         denominacion: item.articulo.denominacion,
  //   //       }
  //   //     }))
  //   //   },
  //   //   denominacion: '',
  //   //   fechaDesde: new Date(),
  //   //   fechaHasta:  new Date(),
  //   //   horaDesde:  new Date(),
  //   //   horaHasta:  new Date(),
  //   //   descripcionDescuento: '',
  //   //   precioPromocional: 0,
  //   //   tipoPromocion: TipoPromocion.HAPPY_HOUR,
  //   //   imagenesPromocion: [],
  //   //   sucursales: [],
  //   //   promocionDetalles: [],
  //   //   id: 0
  //   // };
  //   if (promoEnCarrito) {
  //     setCart(cart.map((item) =>
  //       item.id === promocion.id ? { ...item, cantidad: item.cantidad + 1 } : item
  //     ));
  //   } else {
  //     setCart([...cart, { ...promoc, cantidad: 1 }]);
  //   }

  //   }
  
  // Remover producto del carrito
  const removeFromCart = (itemId: number) => {
    setCartProductos(cartProductos.filter((item) => item.id !== itemId));
    setCartPromociones(cartPromociones.filter((item) => item.id !== itemId));
  };

  // Actualizar cantidad de un producto o promoción en el carrito
  const updateCartItem = (itemId: number, cantidad: number) => {
    if (cantidad === 0) {
      removeFromCart(itemId);
    } else {
      setCartProductos(
        cartProductos.map((item) =>
          item.id === itemId ? { ...item, cantidad } : item
        )
      );
      setCartPromociones(
        cartPromociones.map((item) =>
          item.id === itemId ? { ...item, cantidad } : item
        )
      );
    }
  };
  // Obtener promociones
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await fetch("http://localhost:8080/promociones");
        const data = await response.json();
  
        if (Array.isArray(data)) {
          // Convertimos los datos de las promociones a objetos Date para comparación
          const now = new Date();
          const promocionesActivas = data.map(promocion => {
            const fechaDesde = new Date(promocion.fechaDesde);
            const fechaHasta = new Date(promocion.fechaHasta);
            let esPromocionActiva = false;
  
            if (promocion.tipoPromocion === TipoPromocion.HAPPY_HOUR) {
              // Para HAPPY_HOUR, verificar el horario diario y el rango de fechas
              const startHour = new Date(now.toDateString() + ' ' + promocion.horaDesde);
              let endHour = new Date(now.toDateString() + ' ' + promocion.horaHasta);
              
              // Si la hora de fin es antes que la de inicio, significa que cruza la medianoche
              if (endHour <= startHour) {
                endHour.setDate(endHour.getDate() + 1);
              }
              
              // Verificamos si la fecha actual está dentro del rango de fechas de la promoción
              const dentroDelRangoDeFecha = now >= fechaDesde && now <= fechaHasta;
              
              // Verificamos si la hora actual está dentro del rango horario
              const dentroDelRangoHorario = now >= startHour && now <= endHour;
              
              // La promoción está activa si ambas condiciones son verdaderas
              esPromocionActiva = dentroDelRangoDeFecha && dentroDelRangoHorario;
            } else if (promocion.tipoPromocion === TipoPromocion.PROMOCION) {
              // Para PROMOCION, verificar solo el rango de fechas
              const nowDateOnly = new Date(now);
              nowDateOnly.setHours(0, 0, 0, 0);
              esPromocionActiva = nowDateOnly >= fechaDesde && nowDateOnly <= fechaHasta;
            }
  
            // Añadimos el estado de la promoción al objeto promocion
            return { ...promocion, esPromocionActiva };
          });
  
          setPromociones(promocionesActivas);
        } else {
          console.error("Error: El formato de la respuesta no es un array");
        }
      } catch (error) {
        console.error("Error al obtener las promociones:", error);
      }
    };
  
    fetchPromociones();
  }, []);

  // Obtener productos y categorías
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const manufacturadosResponse = await fetch("http://localhost:8080/articuloManufacturado");

        if (!manufacturadosResponse.ok) {
          throw new Error("Error al obtener productos");
        }

        const manufacturadosData = await manufacturadosResponse.json();

        setProductos(manufacturadosData); // Guardar solo los articuloManufacturado
      } catch (error) {
        console.error(error);
        setError("Error al obtener los productos.");
      } finally {
        setLoading(false);
      }
    };
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/categoria");
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        
        // Filtrar categorías donde esInsumo es false
        const filteredCategorias = data.filter(cat => cat.esInsumo === false);
        
        setCategorias(filteredCategorias);
      } catch (error) {
        console.error(error);
        setError("Error al obtener las categorías.");
      }
    };

    fetchProductos();
    fetchCategorias();
  }, []);

  // Filtrar productos por búsqueda y categoría seleccionada
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.denominacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria
      ? Array.isArray(producto.categoria) 
        ? (producto.categoria as Categoria[]).some(cat => cat.denominacion === selectedCategoria)
        : (producto.categoria as Categoria)?.denominacion === selectedCategoria
      : true;
    
    return matchesSearch && matchesCategoria;
  });


  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Menú de categorías alineado a la izquierda */}
        <div className="col-md-2 text-left sidebar">
          <h2
            className="mb-3"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            Categorías
          </h2>
          <div className="btn-group-vertical w-100">
            <button
              className="btn btn-outline-primary"
              onClick={() => setSelectedCategoria(null)}
              style={{
                color: "black",
                fontWeight: "bold",
                backgroundColor: "white",
                border: "2px solid rgb(128 128 128 / 30%)",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(128, 128, 128, 0.74)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "black";
              }}
            >
              Todas las categorías
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="btn btn-outline-secondary"
                onClick={() => setSelectedCategoria(categoria.denominacion)}
                style={{
                  color: "black",
                  border: "2px solid rgb(128 128 128 / 30%)",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(128, 128, 128, 0.74)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "black";
                }}
              >
                {categoria.denominacion}
              </button>
            ))}
          </div>
        </div>

        {/* Contenedor principal con productos (más chico ahora) */}
        <div className="col-md-6 product-container" style={{marginLeft: "200px"}} >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ borderColor: "#80808070", textAlign: "center" }}
            />
          </div>

          <h3>Promociones:</h3>
          <div className="promotion-container">
            {promociones.length > 0 ? (
              promociones.map((promocion) => renderCard(promocion))
            ) : (
              <p>No hay promociones disponibles</p>
            )}
          </div>
          <h3>Otras comidas:</h3>
          <ProductList
            productos={filteredProductos}
            onAddToCart={addToCart}
            onViewDetails={handleProductClick}
          />
          <CartButton
            cartLength={cartProductos.length + cartPromociones.length}
            onClick={() => setShowCart(true)}
          />
        </div>
      </div>

      {/* Modal del carrito */}
      <Modal show={showCart} onHide={() => setShowCart(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title
            style={{ textAlign: "center", fontWeight: "bold", width: "100%" }}
          >
            Carrito de Compras
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cart
            cart={[...cartProductos, ...cartPromociones]}
            onRemoveFromCart={(id) => {
              setCartProductos(cartProductos.filter((item) => item.id !== id));
              setCartPromociones(cartPromociones.filter((item) => item.id !== id));
            }}
            onUpdateQuantity={(id, cantidad) => {
              setCartProductos(
                cartProductos.map((item) =>
                  item.id === id ? { ...item, cantidad } : item
                )
              );
              setCartPromociones(
                cartPromociones.map((item) =>
                  item.id === id ? { ...item, cantidad } : item
                )
              );
            }}
            onClose={() => setShowCart(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductsPage;