import DataModel from "./DataModel";
import Localidad from "./Localidad";

interface IDomicilio extends DataModel<IDomicilio> {
    calle: string;
    numero: number; 
    cp: number;    
    piso: number | null; 
    nroDpto: number | null; 
    localidad: Localidad;
}

export default IDomicilio;