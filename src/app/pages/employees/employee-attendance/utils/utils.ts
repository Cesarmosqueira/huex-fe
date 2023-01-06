import { PipeTransform } from "@angular/core";
import {EmployeeAttendance} from "../models/employee-attendance.model";

export type SortColumn = keyof EmployeeAttendance | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(employeeAttendances: EmployeeAttendance[], column: SortColumn, direction: string): EmployeeAttendance[] {
    if (direction === '' || column === '') {
        return employeeAttendances;
    } else {
        return [...employeeAttendances].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(employeeAttendance: EmployeeAttendance, term: string, pipe: PipeTransform) {
    return employeeAttendance.status.toLowerCase().includes(term.toLowerCase());
}
