import { Articulo } from './Articulo';
import { Categoria } from './Categoria';
import { Imagen } from './Producto';
import UnidadMedida from './UnidadMedida';

export interface ArticuloInsumoFullDto {
    Articulo: Articulo;
    denominacion: string;
    stockActual: number;
    stockMinimo: number;
    unidadMedida: string;
    precioCompra: number;
    precioVenta: number;
    stockMaximo: number;
    es_para_elaborar: boolean;
    UnidadMedida: UnidadMedida;
    Categoria: Categoria;
    Imagenes: Imagen[];
    
  }
  