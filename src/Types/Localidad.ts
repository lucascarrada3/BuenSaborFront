import DataModel from "./DataModel";
import { Provincia } from "./Provincia";

interface ILocalidad extends DataModel<ILocalidad> {
    nombre: string;
    provincia: Provincia
    id: number;
}

export default ILocalidad;