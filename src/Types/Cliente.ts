import  Base  from './Base';
import  Domicilio  from './Domicilio';
import { ImagenCliente } from './ImagenesCliente';
import { Pedido } from './Pedido';


export interface Cliente extends Base {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento?: string;
    domicilios: Domicilio[];
    imagenCliente?: ImagenCliente;
    pedidos?: Pedido[];
    clave: string;

}