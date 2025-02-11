import DataModel from "./DataModel";
import { TipoEnvio } from './enum/TipoEnvio';
import Domicilio from './Domicilio';
import { Empleado } from './Empleado';
import { Cliente } from './Cliente';
import { Estado } from './enum/Estado';
import { FormaPago } from './enum/FormaPago';
import { Sucursal } from './Sucursal';
import { DetallePedido } from './DetallePedido';
import Factura from './Factura';

export interface Pedido extends DataModel<Pedido> {
    horaEstimadaFinalizacion: Date;
    total: number;
    totalCosto: number;
    estado: Estado;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    fechaPedido: Date;
    sucursal: Sucursal;
    domicilio: Domicilio[];
    empleado: Empleado[];
    cliente_id: Cliente[];
    DetallePedido: DetallePedido[];
    Factura: Factura[];
}