import React from 'react';
import { Producto } 
from '../DTOS/Producto';
import { Pedido } from '../DTOS/Pedido';


interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Pedido) => void;
}

const ProductList: React.FC<ProductListProps> = ({ productos }) => {
  return (
    <div className="row">
      {productos.length === 0 && <p className="text-center">No hay productos disponibles.</p>}
      {productos.map(producto => (
        <div className="col-md-4 mb-4" key={producto.id}>
          <div className="card">
          {producto.imagenes.length > 0 && (
               <img src={producto.imagenes[0].url} alt={producto.denominacion} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }} />
            )}
            <div className="card-body">
              <h3 className="card-title">{producto.denominacion}</h3>
              <p className="card-text">{producto.descripcion}</p>
              <p className="card-text"><strong>Precio: </strong>${producto.precioVenta}</p>
              <a href="#" className="btn btn-primary">Agregar al carrito</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
