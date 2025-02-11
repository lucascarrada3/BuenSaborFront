import DataModel from './DataModel';
import { Rol } from './enum/Rol';


export interface Empleado extends DataModel<Empleado> {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    clave: string;
    fechaNacimiento: Date;
    tipoEmpleado: Rol;   
}