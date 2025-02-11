import { Sucursal } from './Sucursal';
import  Imagenes  from './Imagenes';
import DataModel from './DataModel';

export interface Empresa extends DataModel<Empresa> {
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursales: Sucursal[];
    imagenes: Imagenes[];
}