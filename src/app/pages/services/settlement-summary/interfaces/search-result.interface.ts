import {SettlementSummary} from "../models/settlement-summary.model";

export interface SearchResult {
  settlementSummary: SettlementSummary[];
  total: number;
}
