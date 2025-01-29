import Base  from './Base';
import DataModel from './DataModel';

interface Pais extends DataModel<Pais> {
    id: number;
    eliminado: boolean;
    nombre: string;

}

export default Pais;

  