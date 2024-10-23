/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Producto } from '../DTOS/Producto';

interface ProductDetailsPageProps {
  addToCart: (producto: Producto) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:8080/articuloManufacturado/${id}`);
        if (!response.ok) throw new Error('Error al obtener los detalles del producto');
        const data = await response.json();
        setProducto(data);
      } catch {
        setError('Error al obtener los detalles del producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!producto) return <p>No se encontró el producto.</p>;

  return (
    <div className="container">
      <h1>{producto.denominacion}</h1>
      {producto.imagenes.map((imagen, index) => (
        <img key={index} src={imagen.url} alt={`${producto.denominacion} ${index + 1}`} className="img-fluid" />
      ))}
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precioVenta}</p>
      <p>Categoría: {(producto.categoria as any).denominacion}</p>
      
      {/* Botón para agregar al carrito */}
      <button className="btn btn-success" onClick={() => addToCart(producto)}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductDetailsPage;
