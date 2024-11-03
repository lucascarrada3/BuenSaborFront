import DataModel from "./DataModel";
import { FormaPago } from "./enum/FormaPago";


export default interface Factura extends DataModel<Factura>{
    fechaFcturacion: Date;
    mpPaymentId: number;
    mpMerchantOrderId: number;
    mpPreferenceId: string;
    mpPaymentType: string;
    formaPago: FormaPago;
    totalVenta: number;
}