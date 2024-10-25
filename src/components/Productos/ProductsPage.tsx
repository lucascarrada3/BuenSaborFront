import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import '../CSS/productos.css';
import { Producto } from '../DTOS/Producto';
import { Categoria } from '../DTOS/Categoria';
import '../CSS/PromocionesPage.css';
import CartButton from '../Carrito/CartButtom';
import { Modal } from 'react-bootstrap';
import Cart from '../Carrito/cart';

// Definición de la interfaz para las promociones
interface Promocion {
  id: number;
  denominacion: string;
  descripcionDescuento: string;
  fechaDesde: string;
  fechaHasta: string;
  horaDesde: string;
  horaHasta: string;
  precioPromocional: number | null;  // Permitir que sea null si el precio no está definido
  tipoPromocion: number;
  imagenes: Imagen[];
}

interface Imagen {
  name: string;
  url: string;
}

const ProductsPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cart, setCart] = useState<Producto[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Función para renderizar cada tarjeta de promoción
  const renderCard = (promocion: Promocion) => (
    <div className="col-md-4 mb-4" key={promocion.id}>
      <div className="card">
        {promocion.imagenes.length > 0 && (
          <div>
            <img
              src={promocion.imagenes[0].url}
              alt={promocion.denominacion}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
            />
          </div>
        )}
        <div className="card-body">
          <h3 className="card-title">{promocion.denominacion}</h3>
          <p className="card-text">{promocion.descripcionDescuento}</p>
          <p>
            <strong>Precio Promocional: </strong>
            {typeof promocion.precioPromocional === 'number'
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
              ingredientes: '',
              categoria: [],
              pedido: []
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
        const response = await fetch("http://localhost:8080/articuloManufacturado");
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();
        setProductos(data);
      } catch {
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
        setCategorias(data);
      } catch {
        setError("Error al obtener las categorías.");
      }
    };

    fetchProductos();
    fetchCategorias();
  }, []);

  // Filtrar productos por búsqueda y categoría seleccionada
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.denominacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria ? (producto.categoria as unknown as Categoria).denominacion === selectedCategoria : true;
    return matchesSearch && matchesCategoria;
  });

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Menú de categorías */}
        <div className="col-md-3">
          <h2>Categorías</h2>
          <ul className="list-group">
            <li className="list-group-item" onClick={() => setSelectedCategoria(null)}>
              Todas las categorías
            </li>
            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                className="list-group-item"
                onClick={() => setSelectedCategoria(categoria.denominacion)}
              >
                {categoria.denominacion}
              </li>
            ))}
          </ul>
        </div>

        {/* Contenedor principal con el buscador y la lista de productos */}
        <div className="col-md-6">
          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <h3>Promociones: </h3>
          <div className="promotion-container">
            {promociones.length > 0 ? (
              promociones.map(promocion => renderCard(promocion))
            ) : (
              <p>No hay promociones disponibles</p>
            )}
          </div>

          <h3>Otras comidas: </h3>
          {/* Lista de productos */}
          <ProductList productos={filteredProductos} onAddToCart={addToCart} />
        </div>

        {/* Contenedor del carrito */}
        <div className="col-md-3">
          <CartButton cartLength={cart.length} onClick={() => setShowCart(true)} />
        </div>
      </div>

      {/* Modal del carrito */}
      <Modal show={showCart} onHide={() => setShowCart(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Carrito de Compras</Modal.Title>
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
