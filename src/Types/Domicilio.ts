import DataModel from "./DataModel";
import Localidad from "./Localidad";

interface IDomicilio extends DataModel<IDomicilio> {
    calle: string;
    numero: number;
    cp: number;
    piso: number;
    nroDpto: number;
    localidad: Localidad;

}

export default IDomicilio;