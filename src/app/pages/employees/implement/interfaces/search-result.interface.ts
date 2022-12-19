import {Implement} from "../models/implement.model";

export interface SearchResult {
  implement: Implement[];
  total: number;
}
