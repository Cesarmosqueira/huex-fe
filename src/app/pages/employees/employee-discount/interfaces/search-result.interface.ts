import {EmployeeDiscount} from "../models/employee-discount.model";

export interface SearchResult {
  employeeDiscount: EmployeeDiscount[];
  total: number;
}
