// ProductList.tsx
import React from 'react';
import { Producto } from '../../Types/Producto';

interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Producto) => void;
  onViewDetails: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ productos, onAddToCart, onViewDetails }) => {
  return (
    <div className="row">
      {productos.map((producto) => (
        <div key={producto.id} className="col-md-4 mb-4">
          <div className="card">
            {producto.imagenes.length > 0 && (
              <img src={producto.imagenes[0].url} alt={producto.denominacion} className="card-img-top" />
            )}
            <div className="card-body">
              <h5 className="card-title">{producto.denominacion}</h5>
              <p className="card-text">Precio: ${producto.precioVenta}</p>
              <button onClick={() => onAddToCart(producto)} className="btn btn-primary">
                Agregar al carrito
              </button>
              <button onClick={() => onViewDetails(producto.id)} className="btn btn-secondary ml-2">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
