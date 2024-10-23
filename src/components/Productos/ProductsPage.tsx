import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import '../CSS/productos.css';
import { Producto } from '../DTOS/Producto';
import { Categoria } from '../DTOS/Categoria';
import { Pedido } from '../DTOS/Pedido';

const ProductsPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrito de compras
  const [cart, setCart] = useState<Producto[]>([]);

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

  // Agregar producto al carrito
  const addToCart = (producto: Pedido) => {
    const itemInCart = cart.find((item) => item.id === producto.id);
    if (itemInCart) {
      setCart(cart.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCart([...cart, {
        ...producto, cantidad: 1,
        denominacion: '',
        descripcion: '',
        precioVenta: 0,
        ingredientes: '',
        imagenes: [],
        categoria: [],
        pedido: []
      }]);
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

  // Calcular total del carrito
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precioVenta * item.cantidad, 0).toFixed(2);
  };

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

          {/* Lista de productos */}
          <ProductList productos={filteredProductos} onAddToCart={addToCart} />
        </div>

        {/* Carrito de compras */}
        <div className="col-md-3">
          <h2>Carrito</h2>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            <>
              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.denominacion} ({item.cantidad})
                    <span>${(item.precioVenta * item.cantidad).toFixed(2)}</span>
                    <div>
                      <button onClick={() => updateCartItem(item.id, item.cantidad - 1)}>-</button>
                      <button onClick={() => updateCartItem(item.id, item.cantidad + 1)}>+</button>
                      <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <h4>Total: ${calculateTotal()}</h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
