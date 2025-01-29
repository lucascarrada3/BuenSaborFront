import DataModel from './DataModel';
import  Pais  from './Pais';

interface Provincia extends DataModel<Provincia> {
    id: number;
    eliminado: boolean;
    nombre: string;
    pais: Pais;

}

export default Provincia;
