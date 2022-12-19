import {EmployeeAttendance} from "../models/employee-attendance.model";

export interface SearchResult {
  employeeAttendance: EmployeeAttendance[];
  total: number;
}
