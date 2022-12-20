import { KardexFuel } from "../models/kardex-fuel";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof KardexFuel | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
  }