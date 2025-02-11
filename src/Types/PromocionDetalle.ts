import { Articulo } from './Articulo';
import DataModel from './DataModel';

export interface PromocionDetalle extends DataModel<PromocionDetalle> {
    cantidad: number;
    articulo: Articulo;
}