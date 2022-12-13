import {ExpenseType} from "../models/expense-type.model";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof ExpenseType | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
  }
