import {Toll} from "../models/toll.model";

export interface SearchResult {
  toll: Toll[];
  total: number;
}
