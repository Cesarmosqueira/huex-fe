import {Implement} from "../models/implement.model";

export interface State {

  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof Implement | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
