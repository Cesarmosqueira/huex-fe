import { IMensaje } from "./mensaje.interface";

export interface IMetaData {
    mensajes: IMensaje[];
    totalRegistros: number;
    idTransaccion: string;
    numeroPaginaSiguiente: string;
    numeroTotalPaginas: string;
}