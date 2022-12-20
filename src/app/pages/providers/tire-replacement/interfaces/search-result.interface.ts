import {TireReplacement} from "../models/tire-replacement.model";

export interface SearchResult {
  tireReplacement: TireReplacement[];
  total: number;
}
