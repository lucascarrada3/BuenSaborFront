import DataModel from "../../Types/DataModel";
import Domicilio from "../../Types/Domicilio";
import EmpresaShorDto from "./EmpresaShortDto";

interface SucursalShorDto extends DataModel<SucursalShorDto>{
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    esCasaMatriz: boolean;
    domicilio: Domicilio;
    empresa: EmpresaShorDto;
}

export default SucursalShorDto;