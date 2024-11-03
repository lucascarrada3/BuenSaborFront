import ArticuloDto from "../components/DTOS/ArticuloDto";
import DataModel from "./DataModel";

export default interface DetallePedido extends DataModel<DetallePedido> {
  id: number;
  eliminado: boolean;
  cantidad: number;
  subTotal: number;
  articulo: ArticuloDto;
}
