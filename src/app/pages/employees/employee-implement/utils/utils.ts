import { PipeTransform } from "@angular/core";
import {EmployeeImplement} from "../models/employee-implement.model";

export type SortColumn = keyof EmployeeImplement | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(employeeImplements: EmployeeImplement[], column: SortColumn, direction: string): EmployeeImplement[] {
    if (direction === '' || column === '') {
        return employeeImplements;
    } else {
        return [...employeeImplements].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(employeeImplement: EmployeeImplement, term: string, pipe: PipeTransform) {
    return employeeImplement.employee.fullName.toLowerCase().includes(term.toLowerCase());
}
