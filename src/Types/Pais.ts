import DataModel from "./DataModel";

interface IPais extends DataModel<IPais> {
    id: number;
    eliminado: boolean;
    nombre: string;

}

export default IPais;