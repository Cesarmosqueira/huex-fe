import {Route} from "../models/route.model";

export interface SearchResult {
  routes: Route[];
  total: number;
}
