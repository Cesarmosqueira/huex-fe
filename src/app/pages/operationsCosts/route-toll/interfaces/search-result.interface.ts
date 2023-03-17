import {RouteToll} from "../models/route-toll.model";

export interface SearchResult {
  routeToll: RouteToll[];
  total: number;
}
