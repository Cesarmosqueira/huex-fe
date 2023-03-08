import {ServiceIncidents} from "../models/service-incidents.model";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof ServiceIncidents | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
    searchName: string;

}
