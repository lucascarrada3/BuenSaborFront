import  Domicilio  from './Domicilio';
import DataModel from './DataModel';
import Imagenes from './Imagenes';

export interface Sucursal extends DataModel<Sucursal> {
    nombre: string;
    horarioApertura: Date; // Cambiado a Date para manejar fechas y horas en TypeScript
    horarioCierre: Date; // Cambiado a Date para manejar fechas y horas en TypeScript
    esCasaMatriz: boolean; 
    domicilio: Domicilio[];
    imagenes: Imagenes[];
}
