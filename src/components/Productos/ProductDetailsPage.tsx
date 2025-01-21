import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Producto } from '../../Types/Producto';
import { Modal } from 'react-bootstrap';
import CartButton from '../Carrito/CartButtom';
import Cart from '../Carrito/Cart';
import '../CSS/ProductDetails.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

interface ProductDetailsPageProps {
  addToCart: (producto: Producto) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [sugeridos, setSugeridos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Producto[]>([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate(); // hook para navegar

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Obtener detalles del producto
        const response = await fetch(`http://localhost:8080/articuloManufacturado/${id}`);
        if (!response.ok) throw new Error('Error al obtener los detalles del producto');
        const data = await response.json();
        setProducto(data);
  
        // Obtener productos sugeridos
        const responseSugeridos = await fetch(`http://localhost:8080/articuloManufacturado`);
        if (!responseSugeridos.ok) throw new Error('Error al obtener los productos sugeridos');
        const sugeridosData = await responseSugeridos.json();
  
        // Filtrar productos sugeridos para excluir el producto actual
        const filteredSugeridos = sugeridosData.filter((producto: Producto) => producto.id !== parseInt(id!));
        setSugeridos(filteredSugeridos);
      } catch (err) {
        console.error(err);
        setError('Error al obtener los detalles del producto.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducto();
  }, [id]);

  const handleSuggestedClick = (suggestedId: string) => {
    navigate(`/product/${suggestedId}`);
  };

  const addToCartHandler = (producto: Producto) => {
    const itemInCart = cart.find((item) => item.id === producto.id);
    if (itemInCart) {
      setCart(cart.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCart([...cart, { ...producto, cantidad: 1 }]);
    }
  };

  const toggleCartModal = () => {
    setShowCart(!showCart);
  };

  // Función para manejar el click en el botón Volver
  const handleGoBack = () => {
    navigate('/productos');
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!producto) return <p>No se encontró el producto.</p>;

  return (
    <div className="container">
      {/* Botón de Volver a Productos con flecha */}
      <Button variant="success" onClick={handleGoBack}>
        <FaArrowLeft /> Volver a Productos
      </Button>

      <div className="d-flex flex-wrap" style={{marginLeft: '30px'}}>
        {/* Div de la imagen */}
        <div className="col-md-5">
          {producto.imagenes.length > 0 ? (
            producto.imagenes.map((imagen, index) => (
              <img 
                key={index} 
                src={imagen.url} 
                alt={`${producto.denominacion}`} 
                className="img-fluid" 
              />
            ))
          ) : (
            <p>No hay imágenes disponibles</p>
          )}
        </div>

        {/* Div de la descripción */}
        <div style={{marginRight: '70px'}}>
          <h1>{producto.denominacion}</h1>
          <p>{producto.descripcion}</p>
          <p>Precio: ${producto.precioVenta}</p>
          <p>Categoría: {(producto.categoria as any).denominacion}</p>
          <div style={{ textAlign: 'right', marginTop: '170px'}}>
            <button className="btn btn-success" onClick={() => addToCartHandler(producto)}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2>Productos Sugeridos</h2>
        <div className="row">
          {sugeridos.map((sugerido) => (
            <div key={sugerido.id} className="col-md-3" onClick={() => handleSuggestedClick(sugerido.id.toString())}>
              <div className="card">
                <img src={sugerido.imagenes[0].url} alt={sugerido.denominacion} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{sugerido.denominacion}</h5>
                  <p className="card-text">Precio: ${sugerido.precioVenta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CartButton cartLength={cart.length} onClick={toggleCartModal} />

      <Modal show={showCart} onHide={toggleCartModal}>
        <Cart 
          cart={cart} 
          onRemoveFromCart={(id: number) => setCart(cart.filter(item => item.id !== id))} 
          onUpdateQuantity={(id: number, cantidad: number) => setCart(cart.map(item => item.id === id ? { ...item, cantidad } : item))} 
          onClose={toggleCartModal} 
        />
      </Modal>
    </div>
  );
};

export default ProductDetailsPage;
