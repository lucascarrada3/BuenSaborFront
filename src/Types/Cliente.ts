import { Base } from './Base';
import  Domicilio  from './Domicilio';
import { ImagenCliente } from './ImagenesCliente';
import { Pedido } from './Pedido';


export class Cliente extends Base {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    domicilios: Domicilio[];
    imagenCliente: ImagenCliente;
    pedidos?: Pedido[];
    clave: string;

    constructor(
        // Asegúrate de que 'id' se inicialice correctamente
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        apellido: string = '',
        telefono: string = '',
        email: string = '',
        fechaNacimiento: string = '',
        domicilios: Domicilio[] = [],
        imagenCliente: ImagenCliente,
        pedidos: Pedido[] = [],
        clave: string = ''
    ) {
        super(id, eliminado);
        this.id = id; // Asegúrate de que 'id' se asigna aquí
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.domicilios = domicilios;
        this.imagenCliente = imagenCliente;
        this.pedidos = pedidos;
        this.clave = clave;
    }
}