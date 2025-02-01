// ProductList.tsx
import React from 'react';
import { Producto } from '../../Types/Producto';
import "../CSS/boton.css";

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
      <div className="card product-card">
        {producto.imagenes.length > 0 && (
          <img 
            src={producto.imagenes[0].url} 
            alt={producto.denominacion} 
            className="card-img-top product-image"
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{producto.denominacion}</h5>
          <p className="card-text price">Precio: ${producto.precioVenta}</p>
          <div className="button-group d-flex justify-content-between">
            <button 
              className="btn custom-btn" 
              onClick={() => onAddToCart(producto)}
            >
              🛒 Agregar al carrito
            </button>
            <button 
              className="btn custom-btn" 
              onClick={() => onViewDetails(producto.id)}
            >
              🔍 Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
  );
};

export default ProductList;
