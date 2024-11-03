import DataModel from "./DataModel";


interface IUsuario extends DataModel<IUsuario>{
    id: number;
    username: string;
    email: string;
    rol: string;

    empleado: {
        tipoEmpleado: string;
        sucursal: {
            id: number;
        };
    };
}

export default IUsuario;