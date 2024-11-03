import DataModel from "./DataModel";
import Usuario from "./Usuario";

interface Cliente extends DataModel<Cliente>{
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    usuario: Usuario
}

export default Cliente;