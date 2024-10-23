import { Categoria } from "./Categoria";
import { Pedido } from "./Pedido";


export interface Imagen {
  name: string;
  url: string;
}

export interface Producto {
  cantidad: number;
  id: number;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  ingredientes: string;
  imagenes: Imagen[]; // Cambiado a imagenes
  categoria: Categoria[];
  pedido: Pedido[];
}

export interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Pedido) => void;
}

