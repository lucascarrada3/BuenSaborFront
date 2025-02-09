import DataModel from './DataModel';
import { ImagenPromocion } from './ImagenPromocion';
import { PromocionDetalle } from './PromocionDetalle';
import { Sucursal } from './Sucursal';
import { TipoPromocion } from './enum/TipoPromocion';


export interface Promocion extends DataModel<Promocion> {
    denominacion: string;
    fechaDesde: Date;
    fechaHasta: Date;
    horaDesde: Date;
    horaHasta: Date;
    descripcionDescuento: string;
    precioPromocional: number;
    tipoPromocion: TipoPromocion;
    imagenesPromocion: ImagenPromocion[];
    sucursales: Sucursal[];
    promocionDetalles: PromocionDetalle[];
}