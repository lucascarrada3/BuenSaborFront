import { Categoria } from "./Categoria";
import { Pedido } from "./Pedido";



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
  promocion?: {

    id: number;

    denominacion: string;

    descripcionDescuento: string;

    fechaDesde: string;

    fechaHasta: string;

    horaDesde: string;

    horaHasta: string;

    precioPromocional: number | null;

    tipoPromocion: number;

    imagenes: Imagen[];

  };
}

export interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Pedido) => void;
}

