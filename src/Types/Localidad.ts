import DataModel from "./DataModel";
import IProvincia from "./Provincia";

interface ILocalidad extends DataModel<ILocalidad> {
    nombre: string;
    provincia: IProvincia

}

export default ILocalidad;