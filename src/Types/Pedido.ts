import { Producto } from "./Producto";
import SucursalShorDto from "../components/DTOS/Sucursal";
import Cliente from "./Cliente";
import DataModel from "./DataModel";
import DetallePedido from "./DetallePedido";
import { Estado } from "./enum/Estado";
import { FormaPago } from "./enum/FormaPago";
import { TipoEnvio } from "./enum/TipoEnvio";
import Factura from "./Factura";

export default interface Pedido extends DataModel<Pedido> {
    id: number;
    eliminado: boolean;
    horaEstimadaFinalizacion: string;
    total: number;
    totalCosto: number;
    estado: Estado;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    fechaPedido: Date;
    detallePedidos: DetallePedido[];
    sucursal: SucursalShorDto;
    factura: Factura;
    cliente: Cliente;
    Producto: Producto
  }
  