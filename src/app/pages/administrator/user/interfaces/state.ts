import {User} from "../models/user.model";

export interface State {

  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof User | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
