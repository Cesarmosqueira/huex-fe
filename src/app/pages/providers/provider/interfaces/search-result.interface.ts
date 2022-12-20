import {Providers} from "../models/providers.model";

export interface SearchResult {
  providers: Providers[];
  total: number;
}
