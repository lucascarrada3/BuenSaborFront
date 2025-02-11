import { Categoria } from "../Types/Categoria";
import { Articulo } from "./Articulo";
import { ArticuloInsumoFullDto } from "./ArticuloInsumo";
import { Pedido }  from "./Pedido";
import { Promocion } from "./Promocion";



export interface Imagen {
  name: string;
  url: string;
}

export interface Producto {
  tiempoEstimadoMinutos: number;
  cantidad: number;
  id: number;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  ingredientes: string;
  imagenes: Imagen[]; // Cambiado a imagenes
  categoria: Categoria[];
  pedido: Pedido[];
  es_para_elaborar: boolean;
  ArticuloInsumoFullDto: ArticuloInsumoFullDto;
  Articulo: Articulo;
  promocion?: Promocion[];
}

export interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Pedido) => void;
}

