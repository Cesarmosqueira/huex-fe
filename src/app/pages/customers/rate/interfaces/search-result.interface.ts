import {Rate} from "../models/rate.model";

export interface SearchResult {
  rates: Rate[];
  total: number;
}
