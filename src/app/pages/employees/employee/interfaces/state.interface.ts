import {Employee} from "../models/employee.model";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof Employee | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
  }
