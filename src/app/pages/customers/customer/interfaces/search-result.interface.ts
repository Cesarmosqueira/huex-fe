import {Customer} from "../models/customer.model";

export interface SearchResult {
  customers: Customer[];
  total: number;
}
