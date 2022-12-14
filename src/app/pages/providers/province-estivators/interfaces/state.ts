import {ProvinceEstivators} from "../models/province-estivators.model";

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof ProvinceEstivators | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
