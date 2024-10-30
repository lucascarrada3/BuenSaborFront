import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '../CSS/Carousel.css';  // Importa tu CSS personalizado si es necesario

interface Producto {
  id: number;
  denominacion: string;
  descripcion: string;
  imagenes: Imagen[]; // Lista de URLs de imágenes
}

interface Imagen {
  name: string;
  url: string;
}

const ProductCarousel: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/articuloManufacturado");
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();

        const productosConImagenes = await Promise.all(
          data.map(async (producto: Producto) => {
            const imagenesResponse = await fetch(`http://localhost:8080/articuloManufacturado/getAllImagesByArticuloManufacturadoId/${producto.id}`);
            const imagenes = await imagenesResponse.json();
            return { ...producto, imagenes };
          })
        );

        setProductos(productosConImagenes);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div className="loader">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-carousel">
      <Carousel>
        {productos.map((producto) => (
          <Carousel.Item key={producto.id}>
            {producto.imagenes.length > 0 ? (
              <img
                className="d-block w-100"
                src={producto.imagenes[0].url}
                alt={producto.denominacion}
              />
            ) : (
              <img
                className="d-block w-100"
                src="ruta-a-imagen-predeterminada.jpg"
                alt="Imagen no disponible"
              />
            )}
            <Carousel.Caption className="carousel-caption">
              <h3>{producto.denominacion}</h3>
              <p>{producto.descripcion}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
