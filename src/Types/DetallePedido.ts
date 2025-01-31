import DataModel from "./DataModel";
import { Articulo } from './Articulo';

export interface DetallePedido extends DataModel<DetallePedido> {
    cantidad: number;
    subTotal: number;
    articulo: Articulo;
}