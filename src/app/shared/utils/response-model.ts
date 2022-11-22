import { IMetaData } from "./interfaces/meta-data.interface";

export class ResponseModel<E> {
    constructor(public meta: IMetaData,
                public datos: E) { }
}