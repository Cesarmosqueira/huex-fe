import {Providers} from "../models/providers.model";

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof Providers | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
