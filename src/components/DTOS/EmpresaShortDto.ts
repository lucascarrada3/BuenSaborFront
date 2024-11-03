import DataModel from "../../Types/DataModel";


interface EmpresaShorDto extends DataModel<EmpresaShorDto>{
    nombre: string,
    razonSocial: string,
    cuil: number
}

export default EmpresaShorDto;