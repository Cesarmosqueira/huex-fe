import { PipeTransform } from "@angular/core";
import {ExpenseType} from "../models/expense-type.model";

export type SortColumn = keyof ExpenseType | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(expenseTypes: ExpenseType[], column: SortColumn, direction: string): ExpenseType[] {
    if (direction === '' || column === '') {
        return expenseTypes;
    } else {
        return [...expenseTypes].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(expenseType: ExpenseType, term: string, pipe: PipeTransform) {
    return expenseType.expenseType.toLowerCase().includes(term.toLowerCase());
}
