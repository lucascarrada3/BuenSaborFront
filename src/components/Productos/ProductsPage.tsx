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
import { Promocion } from '../../Types/Promocion';

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
  const [cart, setCart] = useState<Producto[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activePromociones, setActivePromociones] = useState(promociones);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const renderCard = (promocion: Promocion) => (
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
            onClick={() => addToCart({
              id: promocion.id,
              denominacion: promocion.denominacion,
              precioVenta: promocion.precioPromocional || 0,
              descripcion: promocion.descripcionDescuento,
              imagenes: promocion.imagenes,
              cantidad: 1,
              categoria: [], // Suponiendo que esto debe ser un array de objetos Categoria
              pedido: [], // No se usa en el contexto de promoción, podrías considerar eliminarlo
              ingredientes: '',
              tiempoEstimadoMinutos: 0,
              ArticuloInsumoFullDto: {
                es_para_elaborar: true,
                denominacion: '',
                stockActual: 0,
                stockMinimo: 0,
                unidadMedida: '',
                precioCompra: 0,
                precioVenta: 0,
                stockMaximo: 0,
                Imagenes: [],
                Articulo: {
                  id: 0,
                  denominacion: '',
                  precioVenta: 0
                },
                UnidadMedida: {
                  denominacion: '',
                  id: 0,
                  eliminado: false
                },
                Categoria: {
                  id: 0,
                  denominacion: '',
                  esInsumo: false
                },
              },
              es_para_elaborar: false
            })}
          >
            Aprovechar Promoción
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
  
  // Agregar producto al carrito
  const addToCart = (producto: Producto) => {
    const itemInCart = cart.find((item) => item.id === producto.id);
    if (itemInCart) {
      setCart(cart.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      // Si el producto no está en el carrito, lo agregamos
      setCart([...cart, { ...producto, cantidad: 1 }]);
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productoId: number) => {
    setCart(cart.filter((item) => item.id !== productoId));
  };

  // Actualizar cantidad de un producto en el carrito
  const updateCartItem = (productoId: number, cantidad: number) => {
    if (cantidad === 0) {
      removeFromCart(productoId);
    } else {
      setCart(cart.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      ));
    }
  };

  // Obtener promociones
  useEffect(() => {
    fetch("http://localhost:8080/promociones")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPromociones(data); // Guardar las promociones en el estado
        } else {
          console.error("Error: El formato de la respuesta no es un array");
        }
      })
      .catch(error => console.error("Error al obtener las promociones:", error));
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
            cartLength={cart.length}
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
            cart={cart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartItem}
            onClose={() => setShowCart(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductsPage;