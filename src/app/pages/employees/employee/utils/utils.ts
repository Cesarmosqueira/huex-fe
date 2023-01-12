import { PipeTransform } from "@angular/core";
import {Employee} from "../models/employee.model";

export type SortColumn = keyof Employee | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(employees: Employee[], column: SortColumn, direction: string): Employee[] {
    if (direction === '' || column === '') {
        return employees;
    } else {
        return [...employees].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(employee: Employee, term: string, pipe: PipeTransform) {
    return employee.fullName.toLowerCase().includes(term.toLowerCase());
}
