import DataModel from "../../Types/DataModel";
import Imagenes from "../../Types/Imagenes";
import IUnidadMedida from "../../Types/UnidadMedida";
import { Categoria } from "../../Types/Categoria";


export default interface ArticuloDto extends DataModel<ArticuloDto> {
    id: number;
    eliminado: boolean;
    denominacion: string;
    precioVenta: number;
    imagen: Imagenes;
    unidadMedida: IUnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    categoria: Categoria;
    tiempoEstimadoMinutos: number;
  }