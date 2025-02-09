import DataModel from "./DataModel";


export interface ImagenPromocion extends DataModel<ImagenPromocion> {
    url: string;
    name: string;
}