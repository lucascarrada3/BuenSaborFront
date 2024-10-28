import DataModel from "./DataModel";

interface IImagenes extends DataModel<IImagenes> {
    url: string;
    name: string;
}

export default IImagenes;