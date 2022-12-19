import { PipeTransform } from "@angular/core";
import {EmployeeDiscount} from "../models/employee-discount.model";

export type SortColumn = keyof EmployeeDiscount | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(employeeDiscounts: EmployeeDiscount[], column: SortColumn, direction: string): EmployeeDiscount[] {
    if (direction === '' || column === '') {
        return employeeDiscounts;
    } else {
        return [...employeeDiscounts].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(employeeDiscount: EmployeeDiscount, term: string, pipe: PipeTransform) {
    return employeeDiscount.observations.toLowerCase().includes(term.toLowerCase());
}
