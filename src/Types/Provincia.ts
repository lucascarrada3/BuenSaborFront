import DataModel from "./DataModel";
import Pais from "./Pais";

interface IProvincia extends DataModel<IProvincia> {
    id: number;
    eliminado: boolean;
    nombre: string;
    pais: Pais;

}

export default IProvincia;