import {CustomerEmployees} from "../models/customer-employees.model";

export interface SearchResult {
  customerEmployees: CustomerEmployees[];
  total: number;
}
