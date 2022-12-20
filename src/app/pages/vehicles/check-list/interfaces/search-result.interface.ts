import { CheckList } from "../models/check-list.model";

export interface SearchResult {
  checkLists: CheckList[];
  total: number;
}