import { Categoria } from "../Types/Categoria";
import { ArticuloInsumoFullDto } from "./ArticuloInsumo";
import { Pedido }  from "./Pedido";
import { ImagenPromocion } from "./ImagenPromocion";



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

    ImagenPromocion: ImagenPromocion[];

  };
}

export interface ProductListProps {
  productos: Producto[];
  onAddToCart: (producto: Pedido) => void;
}

