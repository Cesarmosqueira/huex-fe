import {Employee} from "../models/employee.model";

export interface SearchResult {
  employees: Employee[];
  total: number;
}
