import { PipeTransform } from "@angular/core";
import {Tracking} from "../models/tracking.model";

export type SortColumn = keyof Tracking | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(employees: Tracking[], column: SortColumn, direction: string): Tracking[] {
    if (direction === '' || column === '') {
        return employees;
    } else {
        return [...employees].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(employee: Tracking, term: string, pipe: PipeTransform) {
    return employee.bill.toLowerCase().includes(term.toLowerCase());
}
