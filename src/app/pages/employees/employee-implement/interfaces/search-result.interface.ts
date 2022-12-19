import {EmployeeImplement} from "../models/employee-implement.model";

export interface SearchResult {
  employeeImplement: EmployeeImplement[];
  total: number;
}
