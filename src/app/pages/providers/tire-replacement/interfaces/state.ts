import {TireReplacement} from "../models/tire-replacement.model";

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof TireReplacement | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
