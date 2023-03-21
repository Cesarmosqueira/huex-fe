import {AdditionalServices} from "../models/additional-services.model";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof AdditionalServices | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
  }
