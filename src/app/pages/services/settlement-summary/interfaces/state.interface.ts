import {SettlementSummary} from "../models/settlement-summary.model";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: keyof SettlementSummary | '';
    sortDirection: 'asc' | 'desc' | '';
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    status: string;
    payment: string;
    date: string;
  }
