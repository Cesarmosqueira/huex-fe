import { KardexFuel } from "../models/kardex-fuel";


export interface SearchResult {
  kardexFuels: KardexFuel[];
  total: number;
}