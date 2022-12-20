import {FuelSupply} from "../models/fuel-supply.model";
export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof FuelSupply | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
